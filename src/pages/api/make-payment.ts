import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const body = JSON.parse(req.body);

    try {
        const credentials = Buffer.from(
            `${process.env.MAKECOMMERCE_SHOP_ID}:${process.env.MAKECOMMERCE_SECRET_KEY}`
        ).toString('base64');

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
                            url: `${process.env.NEXT_PUBLIC_DOMAIN}/${body.locale}/success?ref=${body.reference}&email=${body.email}`,
                            method: 'POST',
                        },
                        cancel_url: {
                            url: `${process.env.NEXT_PUBLIC_DOMAIN}/${body.locale}/dovanu-kuponai`,
                            method: 'POST',
                        },
                        notification_url: {
                            url: `${process.env.NEXT_PUBLIC_DOMAIN}/${body.locale}`,
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

        return res.status(200).send(`https://payment.test.maksekeskus.ee/pay.html?trx=${responseData.id}`);
    } catch {
        return res.status(500).send('Error setting up payment');
    }
};
