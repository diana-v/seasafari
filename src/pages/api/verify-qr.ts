import { NextApiRequest, NextApiResponse } from 'next';
import { eq, and, or, ilike, asc, desc } from 'drizzle-orm';

import { verifyGiftCardToken } from '@/utils/jwt';
import { db } from '@/server/db';
import { orders, Order, Status } from '@/server/db/schema';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.headers['x-api-key'] !== process.env.ADMIN_API_KEY) {
        return res.redirect(302, '/');
    }

    const token = req.query.token as string | undefined;
    const { searchTerm = '', field = 'orderRef', direction = 'asc', showCompleted = 'false' } = req.query;

    if (!token) {
        return res.status(400).json({ valid: false, reason: 'missing token' });
    }

    try {
        const decoded = verifyGiftCardToken(token);

        const order = await db.query.orders.findFirst({
            where: (o) => eq(o.orderRef, decoded.orderRef),
        });

        if (!order) {
            return res.status(404).json({ valid: false, reason: 'not found' });
        }

        let updatedStatus = order.status;

        if (decoded.expired) {
            return res.status(200).json({
                valid: false,
                reason: 'token expired, manual check required',
                manualCheckRequired: true,
                orderRef: order.orderRef,
            });
        }

        if (order.status !== Status.COMPLETED) {
            updatedStatus = Status.COMPLETED;
        }

        await db.update(orders).set({ status: updatedStatus }).where(eq(orders.orderRef, order.orderRef));

        const sortDirection = direction === 'asc' ? asc : desc;
        const shouldShowCompleted = showCompleted === 'true';

        const updatedOrders = await db.query.orders.findMany({
            where: (o) =>
                and(
                    or(ilike(o.orderRef, `%${searchTerm}%`), ilike(o.orderEmail, `%${searchTerm}%`)),
                    shouldShowCompleted
                        ? or(eq(o.status, Status.COMPLETED), eq(o.status, Status.CREATED))
                        : eq(o.status, Status.CREATED)
                ),
            orderBy: sortDirection(orders[field as keyof Order]),
        });

        return res.status(200).json({ valid: true, updatedOrders });
    } catch (error) {
        console.error(error);

        return res.status(401).json({ valid: false, reason: 'invalid token' });
    }
}
