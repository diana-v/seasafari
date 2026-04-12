import { and, asc, desc, eq, ilike, or } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/server/db';
import { Order, orders, Status } from '@/server/db/schema';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const searchTerm = searchParams.get('searchTerm') ?? '';
    const field = searchParams.get('field');
    const direction = searchParams.get('direction');
    const showCompleted = searchParams.get('showCompleted');

    try {
        const sortDirection = direction === 'asc' ? asc : desc;
        const shouldShowCompleted = showCompleted === 'true';

        const sortedOrders = await db.query.orders.findMany({
            orderBy: field
                ? sortDirection(orders[field as keyof Order])
                : undefined,
            where: (order) =>
                and(
                    or(
                        ilike(order.orderRef, `%${searchTerm}%`),
                        ilike(order.orderEmail, `%${searchTerm}%`)
                    ),
                    shouldShowCompleted
                        ? or(
                            eq(order.status, Status.COMPLETED),
                            eq(order.status, Status.CREATED)
                        )
                        : eq(order.status, Status.CREATED)
                ),
        });

        return new NextResponse(JSON.stringify(sortedOrders), {
            headers: {
                'content-type': 'application/json',
            },
            status: 200,
        });
    } catch {
        return new NextResponse('Error sending email', { status: 500 });
    }
}
