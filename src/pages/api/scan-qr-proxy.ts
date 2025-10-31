import { NextApiRequest, NextApiResponse } from 'next';

import { isString } from '@/utils/isString';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { token } = req.query;

    if (!isString(token)) {
        return res.status(400).send('Invalid query parameters');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/verify-qr?token=${encodeURIComponent(token)}`, {
        headers: { 'x-api-key': process.env.ADMIN_API_KEY } as HeadersInit,
    });

    const data = await response.json();

    res.status(response.status).json(data);
}
