import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import { Buffer } from 'node:buffer';
import { eq } from 'drizzle-orm';
import { Resend } from 'resend';

import { db } from '@/server/db';
import { orders, Status } from '@/server/db/schema';
import { generatePdfDoc } from '@/templates/payment-success';
import { languages, LocaleType } from '@/translations/success';
import { getTemplate } from '@/utils/getTemplate';
import { isString } from '@/utils/isString';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { ref, email, amount, count, locale, defaultLocale } = req.query;
    const cookies = new Cookies(req, res);
    const localisedString = languages[(locale ?? defaultLocale) as LocaleType];

    const resend = new Resend(process.env.RESEND_API_KEY ?? '');

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

        const validFrom = new Date(order.validFrom);
        const validTo = new Date(order.validTo);

        const pdfStream = await generatePdfDoc({
            orderRef: ref,
            count,
            validFrom,
            validTo,
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

        await resend.emails.send({
            to: email,
            from: process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL ?? '',
            subject: `${localisedString.giftCardEmailSubject} - ${ref}`,
            html: getTemplate(locale, ref, email, amount, validFrom, validTo),
            attachments: [
                {
                    content: attachment,
                    filename: `${ref}.pdf`,
                    contentType: 'application/pdf',
                },
            ],
        });

        cookies.set('paymentRef', ref, { sameSite: 'none', secureProxy: true });
        cookies.set('paymentEmail', email, { sameSite: 'none', secureProxy: true });
        cookies.set('validFrom', validFrom.toString(), { sameSite: 'none', secureProxy: true });
        cookies.set('validTo', validTo.toString(), { sameSite: 'none', secureProxy: true });
        cookies.set('count', encodeURIComponent(count), { sameSite: 'none', secureProxy: true });
        res.redirect(302, `/${locale}/success`);
    } catch {
        res.status(500).redirect(`/${locale}/error?errorCode=500`);

        return;
    }
};
