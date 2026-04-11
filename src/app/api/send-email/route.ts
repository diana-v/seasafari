import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const sendEmail = async (req: NextRequest) => {
    const resend = new Resend(process.env.RESEND_API_KEY ?? '');

    try {
        const body = await req.json();

        await resend.emails.send({
            from: `${body.from}`,
            html: `<p>${body.text}</p>`,
            subject: `${body.subject}`,
            to: `${body.to}`,
        });

        return new NextResponse('Email sent successfully', { status: 200 });
    } catch {
        return new NextResponse('Error sending email', { status: 500 });
    }
};

export { sendEmail as POST };
