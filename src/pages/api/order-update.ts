import { NextApiRequest, NextApiResponse } from 'next';
import { eq } from 'drizzle-orm';
import { asc, desc, ilike, or } from 'drizzle-orm';

import { db } from '@/server/db';
import { Order, orders } from '@/server/db/schema';

const isString = (value: unknown): value is string => {
    return typeof value === 'string';
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { searchTerm, field, direction, orderRef, status } = req.query;

    if (!isString(orderRef) || !isString(status)) {
        return res.status(400).send('Invalid query parameters');
    }
    try {
        await db.update(orders).set({ status: status }).where(eq(orders.orderRef, orderRef));

        const sortDirection = direction === 'asc' ? asc : desc;

        const updatedOrders = await db.query.orders.findMany({
            where: (order) => or(ilike(order.orderRef, `%${searchTerm}%`), ilike(order.orderEmail, `%${searchTerm}%`)),
            orderBy: [sortDirection(orders[field as keyof Order])],
        });

        return res.status(200).send(updatedOrders);
    } catch {
        return res.status(500).send('Error sending email');
    }
};
