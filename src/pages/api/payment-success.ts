import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import sendgrid from '@sendgrid/mail';
import { Buffer } from 'node:buffer';
import { eq } from 'drizzle-orm';

import { db } from '@/server/db';
import { orders, Status } from '@/server/db/schema';
import { generatePdfDoc } from '@/templates/payment-success';

const getTemplateId = (locale: string): string => {
    switch (locale) {
        case 'lt': {
            return process.env.SENDGRID_GIFTCARD_TEMPLATE_ID_LT ?? '';
        }
        case 'ru': {
            return process.env.SENDGRID_GIFTCARD_TEMPLATE_ID_RU ?? '';
        }
        default: {
            return process.env.SENDGRID_GIFTCARD_TEMPLATE_ID_EN ?? '';
        }
    }
};

const isString = (value: unknown): value is string => {
    return typeof value === 'string';
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { ref, email, amount, count, locale } = req.query;
    const cookies = new Cookies(req, res);

    sendgrid.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY ?? '');

    if (!isString(ref) || !isString(email) || !isString(count) || !isString(locale) || !isString(amount)) {
        res.status(400).redirect(`/${locale}/error?errorCode=400`);

        return;
    }

    const existingOrder = await db.select().from(orders).where(eq(orders.orderRef, ref));

    if (existingOrder.length > 0) {
        res.status(400).redirect(`/${locale}/error?errorCode=400`);

        return;
    }

    try {
        const [order] = await db
            .insert(orders)
            .values({
                orderRef: ref,
                orderEmail: email,
                orderAmount: Number.parseInt(amount, 10),
                status: Status.CREATED,
                validFrom: new Date(),
                validTo: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()),
            })
            .returning({ validFrom: orders.validFrom, validTo: orders.validTo });

        const validFrom = order?.validFrom;
        const validTo = order?.validTo;

        const pdfStream = await generatePdfDoc({
            orderRef: ref,
            count,
            validFrom: validFrom.toISOString().split('T')[0],
            validTo: validTo.toISOString().split('T')[0],
            locale,
        });

        const chunks: Buffer[] = [];

        for await (const chunk of pdfStream) {
            if (Buffer.isBuffer(chunk)) {
                chunks.push(chunk);
            } else {
                chunks.push(Buffer.from(chunk));
            }
        }
        const pdfBuffer = Buffer.concat(chunks);
        const attachment = pdfBuffer.toString('base64');

        await sendgrid.send({
            to: email,
            from: process.env.NEXT_PUBLIC_SENDGRID_EMAIL ?? '',
            templateId: getTemplateId(locale),
            dynamicTemplateData: {
                ref: ref,
                email: email,
                amount: amount,
                validFrom: validFrom.toISOString().split('T')[0],
                validTo: validTo.toISOString().split('T')[0],
            },
            attachments: [
                {
                    content: attachment,
                    filename: `${ref}.pdf`,
                    type: 'application/pdf',
                    disposition: 'attachment',
                },
            ],
        });

        cookies.set('paymentRef', ref, { sameSite: 'none', secureProxy: true });
        cookies.set('paymentEmail', email, { sameSite: 'none', secureProxy: true });
        cookies.set('validFrom', validFrom.toISOString().split('T')[0], { sameSite: 'none', secureProxy: true });
        cookies.set('validTo', validTo.toISOString().split('T')[0], { sameSite: 'none', secureProxy: true });
        cookies.set('count', encodeURIComponent(count), { sameSite: 'none', secureProxy: true });
        res.redirect(302, `/${locale}/success`);
    } catch {
        res.status(500).redirect(`/${locale}/error?errorCode=500`);

        return;
    }
};
