import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const resend = new Resend(process.env.RESEND_API_KEY ?? '');
    const body = JSON.parse(req.body);

    try {
        await resend.emails.send({
            to: `${body.to}`,
            from: `${body.from}`,
            subject: `${body.subject}`,
            html: `<p>${body.text}</p>`,
        });

        return res.status(200).send('Email sent successfully');
    } catch {
        return res.status(500).send('Error sending email');
    }
};
