import { and, eq, lt } from 'drizzle-orm';

import { db } from '@/server/db';
import { orders, Status } from '@/server/db/schema';

export async function GET() {
    const now = new Date();

    await db.instance.delete(orders).where(
        and(
            eq(orders.status, Status.UNPAID),
            lt(orders.validTo, now)
        )
    );

    return Response.json({ ok: true });
}
