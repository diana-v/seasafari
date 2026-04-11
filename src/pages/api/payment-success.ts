import { NextApiRequest, NextApiResponse } from 'next';
import { Buffer } from 'node:buffer';
import crypto from 'node:crypto';
import { eq } from 'drizzle-orm';
import { Resend } from 'resend';

import { db } from '@/server/db';
import { orders, Status } from '@/server/db/schema';
import { generatePdfDoc } from '@/templates/payment-success';
import { languages, LocaleType } from '@/translations/success';
import { getTemplate } from '@/utils/getTemplate';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const { json, mac } = req.body;

    if (!json || !mac) {
        return res.status(400).send('Missing data');
    }

    const secret = process.env.MAKECOMMERCE_SECRET_KEY ?? '';
    const calculatedMac = crypto
        .createHash('sha512')
        .update(json + secret)
        .digest('hex')
        .toUpperCase();

    if (calculatedMac !== (mac as string).toUpperCase()) {
        return res.status(401).send('Invalid signature');
    }

    const data = JSON.parse(json);
    const { status, reference, amount, locale } = data;

    const email = req.query.email as string;

    if (status !== 'COMPLETED') {
        return res.status(200).send('Notification received');
    }

    if (!email) {
        return res.status(400).send('Customer email missing');
    }

    const effectiveLocale = locale || 'lt';
    const localisedString = languages[effectiveLocale as LocaleType];
    const resend = new Resend(process.env.RESEND_API_KEY ?? '');

    try {
        const existingOrder = await db.select().from(orders).where(eq(orders.orderRef, reference));

        if (existingOrder.length > 0) {
            return res.status(200).send('Order already processed');
        }

        const parsedAmount = Number.parseInt(amount, 10);
        const [order] = await db
            .insert(orders)
            .values({
                orderRef: reference,
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
            orderRef: reference,
            count: (parsedAmount / 28).toString(),
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
            subject: `${localisedString.giftCardEmailSubject} - ${reference}`,
            html: getTemplate(effectiveLocale, reference, email, amount.toString(), validFrom, validTo),
            attachments: [
                {
                    content: attachment,
                    filename: `${reference}.pdf`,
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
