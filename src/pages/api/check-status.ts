import { NextApiRequest, NextApiResponse } from 'next';
import { eq } from 'drizzle-orm';

import { db } from '@/server/db';
import { orders } from '@/server/db/schema';
import { isString } from '@/utils/isString';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { ref } = req.query;

    if (!isString(ref)) {
        return res.status(400).json({ message: 'Missing reference' });
    }

    try {
        const result = await db.select({ status: orders.status }).from(orders).where(eq(orders.orderRef, ref)).limit(1);

        const order = result[0];

        if (!order) {
            return res.status(200).json({
                status: 'pending',
                paid: false,
            });
        }

        if (order.status === 'created') {
            return res.status(200).json({
                status: 'created',
                paid: true,
            });
        }

        return res.status(200).json({ status: 'pending', paid: false });
    } catch (error) {
        console.error('Drizzle/Neon Error:', error);

        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
