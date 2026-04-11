import { and, asc, desc, eq, ilike, or } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/server/db';
import { Order, orders, Status } from '@/server/db/schema';

const orderUpdate = async (req: NextRequest) => {
    const { searchParams } = req.nextUrl;

    const direction = searchParams.get('direction');
    const field = searchParams.get('field');
    const orderRef = searchParams.get('orderRef');
    const searchTerm = searchParams.get('searchTerm') || '';
    const showCompleted = searchParams.get('showCompleted');
    const status = searchParams.get('status') as Status;

    if (!orderRef || !status) {
        return new NextResponse('Invalid query parameters', { status: 400 });
    }

    try {
        await db.update(orders).set({ status: status }).where(eq(orders.orderRef, orderRef));

        const sortDirection = direction === 'asc' ? asc : desc;
        const shouldShowCompleted = showCompleted === 'true';

        const updatedOrders = await db.query.orders.findMany({
            orderBy: sortDirection(orders[field as keyof Order]),
            where: (order) =>
                and(
                    or(ilike(order.orderRef, `%${searchTerm}%`), ilike(order.orderEmail, `%${searchTerm}%`)),
                    shouldShowCompleted
                        ? or(eq(order.status, Status.COMPLETED), eq(order.status, Status.CREATED))
                        : eq(order.status, Status.CREATED)
                ),
        });

        return NextResponse.json(updatedOrders, { status: 200 });
    } catch {
        return new NextResponse('Error sending email', { status: 500 });
    }
};

export { orderUpdate as PATCH, orderUpdate as POST };
