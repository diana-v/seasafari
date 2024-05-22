import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from "cookies";
import sendgrid from "@sendgrid/mail";

const getTemplateId = (locale: string): string => {
    switch (locale) {
        case 'lt':
            return process.env.SENDGRID_GIFTCARD_TEMPLATE_ID_LT ?? '';
        case 'ru':
            return process.env.SENDGRID_GIFTCARD_TEMPLATE_ID_RU ?? '';
        default:
            return process.env.SENDGRID_GIFTCARD_TEMPLATE_ID_EN ?? '';
    }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { ref, email, locale } = req.query;
    const cookies = new Cookies(req, res);
    sendgrid.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY ?? '');

    try {
        await sendgrid.send({
            to: email,
            from: process.env.NEXT_PUBLIC_SENDGRID_EMAIL ?? '',
            templateId: getTemplateId(locale as string),
            dynamicTemplateData: {
                ref: ref as string,
                email: email as string,
                validFrom: new Date().toISOString().split('T')[0],
                validTo: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()).toISOString().split('T')[0]
            }
        });

        cookies.set('paymentRef', ref as string, { sameSite: 'none', secureProxy: true })
        cookies.set('paymentEmail', email as string, { sameSite: 'none', secureProxy: true })
        res.redirect(302, `/success`);
    } catch {
        return res.status(500).send('Error');
    }
};
