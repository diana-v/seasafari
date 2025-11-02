import { NextApiRequest, NextApiResponse } from 'next';

import { isString } from '@/utils/isString';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { token, locale } = req.query;

    if (!isString(token) || !isString(locale)) {
        return res.status(400).send('Invalid query parameters');
    }

    try {
        const response = await fetch(
            `/api/verify-qr?token=${encodeURIComponent(token)}
            &locale=${encodeURIComponent(locale)}`,
            {
                headers: {
                    'x-api-key': process.env.ADMIN_API_KEY ?? '',
                } as HeadersInit,
            }
        );

        const data = await response.json();

        return res.status(response.status).json(data);
    } catch (error) {
        console.error('Failed to fetch verify-qr response:', error);

        return res.status(500).json({ valid: false, reason: 'Server error while verifying QR' });
    }
}
