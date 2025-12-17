import { NextApiRequest, NextApiResponse } from 'next';
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
    const { ref, email, amount, locale, defaultLocale } = req.query;
    const effectiveLocale = (locale as string) || (req.body?.locale as string) || 'lt'; // Default fallback

    const localisedString = languages[(effectiveLocale ?? defaultLocale) as LocaleType];
    const resend = new Resend(process.env.RESEND_API_KEY ?? '');

    if (!isString(ref) || !isString(email) || !isString(amount)) {
        return res.status(400).send('Invalid parameters');
    }

    try {
        const existingOrder = await db.select().from(orders).where(eq(orders.orderRef, ref));

        if (existingOrder.length > 0) {
            return res.status(200).send('Order already processed');
        }

        const parsedAmount = Number.parseInt(amount, 10);
        const [order] = await db
            .insert(orders)
            .values({
                orderRef: ref,
                orderEmail: email,
                orderAmount: parsedAmount,
                status: Status.CREATED,
                validFrom: new Date(),
                validTo: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()),
            })
            .returning({ validFrom: orders.validFrom, validTo: orders.validTo });

        const validFrom = new Date(order.validFrom);
        const validTo = new Date(order.validTo);

        const pdfStream = await generatePdfDoc({
            orderRef: ref,
            count: (parsedAmount / 25).toString(),
            validFrom,
            validTo,
            locale: effectiveLocale,
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
            html: getTemplate(effectiveLocale, ref, email, amount, validFrom, validTo),
            attachments: [
                {
                    content: attachment,
                    filename: `${ref}.pdf`,
                    contentType: 'application/pdf',
                },
            ],
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Webhook Error:', error);

        return res.status(500).send('Internal Server Error');
    }
};
