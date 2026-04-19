import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { Buffer } from 'node:buffer';
import crypto from 'node:crypto';
import { Resend } from 'resend';

import { db } from '@/server/db';
import { orders, Status } from '@/server/db/schema';
import { generatePdfDoc } from '@/templates/payment-success';
import { languages, LocaleType } from '@/translations/success';
import { getTemplate } from '@/utils/getTemplate';

export async function POST(req: Request) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    let rawText = '';

    try {
        rawText = await req.text();
    } catch {
        return new NextResponse('Invalid body', { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let payload: any = {};

    try {
        payload = JSON.parse(rawText);
    } catch {
        payload = Object.fromEntries(new URLSearchParams(rawText));
    }

    const { json, mac } = payload;

    if (!json || !mac) {
        return new NextResponse('Missing data', { status: 400 });
    }

    const secret = process.env.MAKECOMMERCE_SECRET_KEY ?? '';
    const calculatedMac = crypto
        .createHash('sha512')
        .update(json + secret)
        .digest('hex')
        .toUpperCase();

    if (calculatedMac !== String(mac).toUpperCase()) {
        return new NextResponse('Invalid signature', { status: 401 });
    }

    const data = JSON.parse(json);
    const { amount, locale, reference, status } = data;

    if (status !== 'COMPLETED') {
        return new NextResponse('Notification received', { status: 200 });
    }

    if (!email) {
        return new NextResponse('Customer email missing', { status: 400 });
    }

    const effectiveLocale = locale || 'lt';
    const localisedString = languages[effectiveLocale as LocaleType];
    const resend = new Resend(process.env.RESEND_API_KEY ?? '');

    try {
        const existing = await db
            .instance
            .select()
            .from(orders)
            .where(eq(orders.orderRef, reference))
            .limit(1);

        if (existing.length === 0) {
            // eslint-disable-next-line no-console
            console.warn('Unknown orderRef:', reference);

            return NextResponse.json(
                { ok: false },
                { status: 404 }
            );
        }

        const [order] = await db
            .instance
            .update(orders)
            .set({
                status: Status.CREATED,
                validFrom: new Date(),
                validTo: new Date(
                    new Date().getFullYear() + 1,
                    new Date().getMonth(),
                    new Date().getDate()
                ),
            })
            .where(eq(orders.orderRef, reference))
            .returning({
                validFrom: orders.validFrom,
                validTo: orders.validTo,
            });

        const parsedAmount = Number.parseInt(amount, 10);
        const validFrom = new Date(order.validFrom);
        const validTo = new Date(order.validTo);

        const pdfStream = await generatePdfDoc({
            count: (parsedAmount / 28).toString(),
            locale: effectiveLocale,
            orderRef: reference,
            validFrom,
            validTo,
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
            attachments: [
                {
                    content: attachment,
                    contentType: 'application/pdf',
                    filename: `${reference}.pdf`,
                },
            ],
            from: process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL ?? '',
            html: getTemplate(
                effectiveLocale,
                reference,
                email,
                amount.toString(),
                validFrom,
                validTo
            ),
            subject: `${localisedString.giftCardEmailSubject} - ${reference}`,
            to: email,
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Webhook Error:', error);

        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
