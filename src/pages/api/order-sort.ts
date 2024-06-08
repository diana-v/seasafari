import { NextApiRequest, NextApiResponse } from 'next';
import { asc, desc, ilike, or } from 'drizzle-orm';

import { db } from '@/server/db';
import { Order, orders } from '@/server/db/schema';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { searchTerm, field, direction } = req.query;

    try {
        const testQuery = await db.query.orders.findMany({ limit: 1 });

        console.log('Test query result:', testQuery);

        const sortDirection = direction === 'asc' ? asc : desc;

        const sortedOrders = await db.query.orders.findMany({
            where: (order) => or(ilike(order.orderRef, `%${searchTerm}%`), ilike(order.orderEmail, `%${searchTerm}%`)),
            orderBy: [sortDirection(orders[field as keyof Order])],
        });

        console.log('Raw sorted orders:', sortedOrders);

        return res.status(200).send(sortedOrders);
    } catch {
        return res.status(500).send('Error sending email');
    }
};
