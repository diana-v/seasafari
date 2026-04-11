import { and, asc, desc, eq, ilike, or } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/server/db';
import { Order, orders, Status } from '@/server/db/schema';

const orderSort = async (req: NextRequest) => {
    const { searchParams } = req.nextUrl;

    const direction = searchParams.get('direction');
    const field = searchParams.get('field');
    const searchTerm = searchParams.get('searchTerm') || '';
    const showCompleted = searchParams.get('showCompleted');

    try {
        const sortDirection = direction === 'asc' ? asc : desc;
        const shouldShowCompleted = showCompleted === 'true';

        const sortedOrders = await db.query.orders.findMany({
            orderBy: sortDirection(orders[field as keyof Order]),
            where: (order) =>
                and(
                    or(ilike(order.orderRef, `%${searchTerm}%`), ilike(order.orderEmail, `%${searchTerm}%`)),
                    shouldShowCompleted
                        ? or(eq(order.status, Status.COMPLETED), eq(order.status, Status.CREATED))
                        : eq(order.status, Status.CREATED)
                ),
        });

        return NextResponse.json(sortedOrders, { status: 200 });
    } catch {
        return new NextResponse('Error sending email', { status: 500 });
    }
};

export { orderSort as GET };
