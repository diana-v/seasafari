import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/server/db';
import { orders } from '@/server/db/schema';
import { isString } from '@/utils/isString';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const ref = searchParams.get('ref');

    if (!isString(ref)) {
        return NextResponse.json(
            { message: 'Missing reference' },
            { status: 400 }
        );
    }

    try {
        const result = await db
            .instance
            .select({ status: orders.status })
            .from(orders)
            .where(eq(orders.orderRef, ref))
            .limit(1);

        const order = result[0];

        if (!order) {
            return NextResponse.json({
                paid: false,
                status: 'pending',
            });
        }

        if (order.status === 'created') {
            return NextResponse.json({
                paid: true,
                status: 'created',
            });
        }

        return NextResponse.json({
            paid: false,
            status: 'pending',
        });
    } catch (error) {
        console.error('Drizzle/Neon Error:', error);

        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
