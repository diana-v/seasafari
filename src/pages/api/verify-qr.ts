import { NextApiRequest, NextApiResponse } from 'next';
import { eq, and, or, ilike, asc, desc } from 'drizzle-orm';

import { verifyGiftCardToken } from '@/utils/jwt';
import { db } from '@/server/db';
import { orders, Order, Status } from '@/server/db/schema';
import { languages, LocaleType } from '@/translations/admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { locale } = req.query;
    const localisedString = languages[locale as LocaleType] ?? languages.en;

    console.warn('verify: got x-api-key =', req.headers['x-api-key'] ? 'present' : 'missing');

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
            return res.status(404).json({ valid: false, reason: localisedString.orderNotFound });
        }

        if (order.status === Status.COMPLETED) {
            return res.status(200).json({
                valid: false,
                reason: localisedString.alreadyUsed,
                orderRef: order.orderRef,
            });
        }

        if (decoded.expired) {
            return res.status(200).json({
                valid: false,
                reason: localisedString.manualCheckRequired,
                orderRef: order.orderRef,
            });
        }

        await db.update(orders).set({ status: Status.COMPLETED }).where(eq(orders.orderRef, order.orderRef));

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

        return res
            .status(200)
            .json({ valid: true, reason: `${localisedString.scanSuccess} - ${order.orderRef}`, updatedOrders });
    } catch (error) {
        console.error(error);

        return res.status(401).json({ valid: false, reason: localisedString.scanError });
    }
}
