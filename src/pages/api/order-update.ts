import { NextApiRequest, NextApiResponse } from 'next';
import { eq } from 'drizzle-orm';
import { asc, desc, ilike, or, and } from 'drizzle-orm';

import { db } from '@/server/db';
import { Order, orders, Status } from '@/server/db/schema';
import { isString } from '@/utils/isString';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { searchTerm, field, direction, orderRef, status, showCompleted } = req.query;

    if (!isString(orderRef) || !isString(status)) {
        return res.status(400).send('Invalid query parameters');
    }
    try {
        await db.update(orders).set({ status: status }).where(eq(orders.orderRef, orderRef));

        const sortDirection = direction === 'asc' ? asc : desc;
        const shouldShowCompleted = showCompleted === 'true';

        const updatedOrders = await db.query.orders.findMany({
            where: (order) =>
                and(
                    or(ilike(order.orderRef, `%${searchTerm}%`), ilike(order.orderEmail, `%${searchTerm}%`)),
                    shouldShowCompleted
                        ? or(eq(order.status, Status.COMPLETED), eq(order.status, Status.CREATED))
                        : eq(order.status, Status.CREATED)
                ),
            orderBy: sortDirection(orders[field as keyof Order]),
        });

        return res.status(200).send(updatedOrders);
    } catch {
        return res.status(500).send('Error sending email');
    }
};
