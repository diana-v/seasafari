import { NextApiRequest, NextApiResponse } from 'next';
import { asc, desc, ilike, or, and, eq } from 'drizzle-orm';

import { db } from '@/server/db';
import { Order, orders, Status } from '@/server/db/schema';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { searchTerm, field, direction, showCompleted } = req.query;

    try {
        const sortDirection = direction === 'asc' ? asc : desc;
        const shouldShowCompleted = showCompleted === 'true';

        const sortedOrders = await db.query.orders.findMany({
            where: (order) =>
                and(
                    or(ilike(order.orderRef, `%${searchTerm}%`), ilike(order.orderEmail, `%${searchTerm}%`)),
                    shouldShowCompleted
                        ? or(eq(order.status, Status.COMPLETED), eq(order.status, Status.CREATED))
                        : eq(order.status, Status.CREATED)
                ),
            orderBy: sortDirection(orders[field as keyof Order]),
        });

        return res.status(200).send(sortedOrders);
    } catch {
        return res.status(500).send('Error sending email');
    }
};
