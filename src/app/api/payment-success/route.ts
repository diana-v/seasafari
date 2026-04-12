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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let body: any;

    try {
        body = await req.json();
    } catch {
        return new NextResponse('Invalid JSON body', { status: 400 });
    }

    const { json, mac } = body;

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
        const existingOrder = await db
            .select()
            .from(orders)
            .where(eq(orders.orderRef, reference));

        if (existingOrder.length > 0) {
            return new NextResponse('Order already processed', { status: 200 });
        }

        const parsedAmount = Number.parseInt(amount, 10);

        const [order] = await db
            .insert(orders)
            .values({
                orderAmount: parsedAmount,
                orderEmail: email,
                orderRef: reference,
                status: Status.CREATED,
                validFrom: new Date(),
                validTo: new Date(
                    new Date().getFullYear() + 1,
                    new Date().getMonth(),
                    new Date().getDate()
                ),
            })
            .returning({
                validFrom: orders.validFrom,
                validTo: orders.validTo,
            });

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
        console.error('Webhook Error:', error);

        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
