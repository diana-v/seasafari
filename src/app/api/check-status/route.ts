import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/server/db';
import { orders } from '@/server/db/schema';

const getOrderStatus = async (req: NextRequest) => {
    const { searchParams } = req.nextUrl;
    const ref = searchParams.get('ref');

    if (!ref) {
        return NextResponse.json({ message: 'Missing reference' }, { status: 400 });
    }

    try {
        const result = await db.select({ status: orders.status }).from(orders).where(eq(orders.orderRef, ref)).limit(1);

        const order = result[0];

        if (!order) {
            return NextResponse.json({
                paid: false,
                status: 'pending',
            }, { status: 200 });
        }

        if (order.status === 'created') {
            return NextResponse.json({
                paid: true,
                status: 'created',
            }, { status: 200 });
        }

        return NextResponse.json({ paid: false, status: 'pending' }, { status: 200 });
    } catch (error) {
        console.error('Drizzle/Neon Error:', error);

        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export { getOrderStatus as GET };
