import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import sendgrid from '@sendgrid/mail';
import { Buffer } from 'node:buffer';

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
        return res.status(400).send('Invalid query parameters');
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
        cookies.set('count', count, { sameSite: 'none', secureProxy: true });
        res.redirect(302, `/success`);
    } catch {
        return res.status(500).send('Error');
    }
};
