import { Resend } from 'resend';
import { Buffer } from 'node:buffer';
import { NextApiRequest, NextApiResponse } from 'next';

import { languages, LocaleType } from '@/translations/success';
import { generatePdfDoc } from '@/templates/payment-success';
import { getTemplate } from '@/utils/getTemplate';

const resend = new Resend(process.env.RESEND_API_KEY ?? '');

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { email, orderRef, amount, locale = 'lt', validFrom, validTo } = req.body;

        const validFromDate = new Date(validFrom);
        const validToDate = new Date(validTo);

        if (!email || !orderRef || !amount || !validFromDate || !validToDate) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const localisedString = languages[locale as LocaleType];

        const pdfStream = await generatePdfDoc({
            orderRef,
            validFrom: validFromDate,
            validTo: validToDate,
            count: (+amount / 25).toString(),
            locale,
        });

        const chunks: Buffer[] = [];

        for await (const chunk of pdfStream) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
        const pdfBuffer = Buffer.concat(chunks);
        const attachment = pdfBuffer.toString('base64');

        await resend.emails.send({
            to: email,
            from: process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL ?? '',
            subject: `${localisedString.giftCardEmailSubject} - ${orderRef}`,
            html: getTemplate(locale, orderRef, email, amount, validFromDate, validToDate),
            attachments: [
                {
                    content: attachment,
                    filename: `${orderRef}.pdf`,
                    contentType: 'application/pdf',
                },
            ],
        });

        console.log('Email sent successfully!');

        return res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);

        return res.status(500).json({ error: 'Failed to send email' });
    }
};
