import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { Buffer } from 'node:buffer';
import { Resend } from 'resend';

import { db } from '@/server/db';
import { orders, Status } from '@/server/db/schema';
import { generatePdfDoc } from '@/templates/payment-success';
import { languages, LocaleType } from '@/translations/success';
import { getTemplate } from '@/utils/getTemplate';

const paymentSuccess = async (req: NextRequest) => {
    const { searchParams } = req.nextUrl;

    const amount = searchParams.get('amount');
    const defaultLocale = searchParams.get('defaultLocale');
    const email = searchParams.get('email');
    const locale = searchParams.get('locale');
    const ref = searchParams.get('ref');

    let body: any = {};

    try {
        body = await req.json();
    } catch {
        // Fallback for requests without a body
    }

    const effectiveLocale = (locale as string) || (body?.locale as string) || 'lt';

    const localisedString = languages[(effectiveLocale ?? defaultLocale) as LocaleType];
    const resend = new Resend(process.env.RESEND_API_KEY ?? '');

    if (!ref || !email || !amount) {
        return new NextResponse('Invalid parameters', { status: 400 });
    }

    try {
        const existingOrder = await db.select().from(orders).where(eq(orders.orderRef, ref));

        if (existingOrder.length > 0) {
            return new NextResponse('Order already processed', { status: 200 });
        }

        const parsedAmount = Number.parseInt(amount, 10);
        const [order] = await db
            .insert(orders)
            .values({
                orderAmount: parsedAmount,
                orderEmail: email,
                orderRef: ref,
                status: Status.CREATED,
                validFrom: new Date(),
                validTo: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()),
            })
            .returning({ validFrom: orders.validFrom, validTo: orders.validTo });

        const validFrom = new Date(order.validFrom);
        const validTo = new Date(order.validTo);

        const pdfStream = await generatePdfDoc({
            count: (parsedAmount / 25).toString(),
            locale: effectiveLocale,
            orderRef: ref,
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
                    filename: `${ref}.pdf`,
                },
            ],
            from: process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL ?? '',
            html: getTemplate(effectiveLocale, ref, email, amount, validFrom, validTo),
            subject: `${localisedString.giftCardEmailSubject} - ${ref}`,
            to: email,
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Webhook Error:', error);

        return new NextResponse('Internal Server Error', { status: 500 });
    }
};

export { paymentSuccess as POST };
