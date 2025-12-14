import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const body = JSON.parse(req.body);

    try {
        const credentials = Buffer.from(
            `${process.env.MAKECOMMERCE_SHOP_ID}:${process.env.MAKECOMMERCE_SECRET_KEY}`
        ).toString('base64');

        const cookies = new Cookies(req, res);

        cookies.set('paymentRef', body.reference, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 1000 * 60 * 60,
        });

        const params = `ref=${encodeURIComponent(body.reference)}&email=${encodeURIComponent(
            body.email
        )}&amount=${encodeURIComponent(body.amount)}&count=${encodeURIComponent(
            body.count
        )}&locale=${encodeURIComponent(body.locale)}`;

        const response = await fetch(`${process.env.MAKECOMMERCE_API_URL}/v1/transactions`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Authorization: `Basic ${credentials}`,
            },
            body: JSON.stringify({
                transaction: {
                    amount: body.amount,
                    currency: 'EUR',
                    reference: body.reference,

                    transaction_url: {
                        return_url: {
                            url: `${process.env.NEXT_PUBLIC_DOMAIN}/${body.locale}/pending?ref=${body.reference}`,
                            method: 'POST',
                        },
                        cancel_url: {
                            url: `${process.env.NEXT_PUBLIC_DOMAIN}/${body.locale}/#gift-cards`,
                            method: 'POST',
                        },
                        notification_url: {
                            url: `${process.env.NEXT_PUBLIC_DOMAIN}/api/payment-success?${params}`,
                            method: 'POST',
                        },
                    },
                },
                customer: {
                    email: body.email,
                    ip: req.query?.clientIp,
                    country: req.query?.clientCountry,
                    locale: body.locale,
                },
            }),
        });

        const responseData = await response.json();

        return res.status(200).send(`${process.env.MAKECOMMERCE_GATEWAY_URL}/pay.html?trx=${responseData.id}`);
    } catch {
        return res.status(500).send('Error setting up payment');
    }
};
