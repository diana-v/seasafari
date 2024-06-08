import { NextApiRequest, NextApiResponse } from 'next';
import { asc, desc, ilike, or } from 'drizzle-orm';

import { db } from '@/server/db';
import { Order, orders } from '@/server/db/schema';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { searchTerm = '', field, direction } = req.query;

    try {
        const sortDirection = direction === 'asc' ? asc : desc;

        const sortedOrders = await db.query.orders.findMany({
            where: (order) => or(ilike(order.orderRef, `%${searchTerm}%`), ilike(order.orderEmail, `%${searchTerm}%`)),
            orderBy: sortDirection(orders[field as keyof Order]),
        });

        return res.status(200).send(sortedOrders);
    } catch {
        return res.status(500).send('Error sending email');
    }
};
