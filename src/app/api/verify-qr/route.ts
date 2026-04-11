import { and, asc, desc, eq, ilike, or } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/server/db';
import { Order, orders, Status } from '@/server/db/schema';
import { languages, LocaleType } from '@/translations/admin';
import { checkAdminAuth } from '@/utils/checkAdminAuth';
import { verifyGiftCardToken } from '@/utils/jwt';

const verifyToken = async (req: NextRequest) => {
    const { searchParams } = req.nextUrl;

    const locale = searchParams.get('locale');
    const localisedString = languages[locale as LocaleType] ?? languages.en;

    if (!await checkAdminAuth()) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    const token = searchParams.get('token');
    const direction = searchParams.get('direction') || 'asc';
    const field = searchParams.get('field') || 'orderRef';
    const searchTerm = searchParams.get('searchTerm') || '';
    const showCompleted = searchParams.get('showCompleted') || 'false';

    if (!token) {
        return NextResponse.json({ reason: 'missing token', valid: false }, { status: 400 });
    }

    try {
        const decoded = verifyGiftCardToken(token);

        const order = await db.query.orders.findFirst({
            where: (o) => eq(o.orderRef, decoded.orderRef),
        });

        if (!order) {
            return NextResponse.json({ reason: localisedString.orderNotFound, valid: false }, { status: 404 });
        }

        if (order.status === Status.COMPLETED) {
            return NextResponse.json({
                orderRef: order.orderRef,
                reason: localisedString.alreadyUsed,
                valid: false,
            }, { status: 200 });
        }

        if (decoded.expired) {
            return NextResponse.json({
                orderRef: order.orderRef,
                reason: localisedString.manualCheckRequired,
                valid: false,
            }, { status: 200 });
        }

        await db.update(orders).set({ status: Status.COMPLETED }).where(eq(orders.orderRef, order.orderRef));

        const sortDirection = direction === 'asc' ? asc : desc;
        const shouldShowCompleted = showCompleted === 'true';

        const updatedOrders = await db.query.orders.findMany({
            orderBy: sortDirection(orders[field as keyof Order]),
            where: (o) =>
                and(
                    or(ilike(o.orderRef, `%${searchTerm}%`), ilike(o.orderEmail, `%${searchTerm}%`)),
                    shouldShowCompleted
                        ? or(eq(o.status, Status.COMPLETED), eq(o.status, Status.CREATED))
                        : eq(o.status, Status.CREATED)
                ),
        });

        return NextResponse.json({
            reason: `${localisedString.scanSuccess} - ${order.orderRef}`,
            updatedOrders,
            valid: true
        }, { status: 200 });
    } catch (error) {
        console.error(error);

        return NextResponse.json({ reason: localisedString.scanError, valid: false }, { status: 401 });
    }
};

export { verifyToken as GET, verifyToken as POST };
