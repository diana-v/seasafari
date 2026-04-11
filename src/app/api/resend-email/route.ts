import { NextRequest, NextResponse } from 'next/server';
import { Buffer } from 'node:buffer';
import { Resend } from 'resend';

import { generatePdfDoc } from '@/templates/payment-success';
import { languages, LocaleType } from '@/translations/success';
import { getTemplate } from '@/utils/getTemplate';

const resend = new Resend(process.env.RESEND_API_KEY ?? '');

const resendEmail = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { amount, email, locale = 'lt', orderRef, validFrom, validTo } = body;

        const validFromDate = new Date(validFrom);
        const validToDate = new Date(validTo);

        if (!email || !orderRef || !amount || !validFromDate || !validToDate) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const localisedString = languages[locale as LocaleType];

        const pdfStream = await generatePdfDoc({
            count: (+amount / 25).toString(),
            locale,
            orderRef,
            validFrom: validFromDate,
            validTo: validToDate,
        });

        const chunks: Buffer[] = [];

        for await (const chunk of pdfStream) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
        const pdfBuffer = Buffer.concat(chunks);
        const attachment = pdfBuffer.toString('base64');

        await resend.emails.send({
            attachments: [
                {
                    content: attachment,
                    contentType: 'application/pdf',
                    filename: `${orderRef}.pdf`,
                },
            ],
            from: process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL ?? '',
            html: getTemplate(locale, orderRef, email, amount, validFromDate, validToDate),
            subject: `${localisedString.giftCardEmailSubject} - ${orderRef}`,
            to: email,
        });

        console.log('Email sent successfully!');

        return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);

        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
};

export { resendEmail as POST };
