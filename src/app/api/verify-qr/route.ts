import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/server/db';
import { orders, Status } from '@/server/db/schema';
import { languages, LocaleType } from '@/translations/admin';
import { checkAdminAuth } from '@/utils/checkAdminAuth';
import { verifyGiftCardToken } from '@/utils/jwt';

export const runtime = 'nodejs';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const token = searchParams.get('token');
    const locale = searchParams.get('locale');

    const localisedString =
        languages[locale as LocaleType] ?? languages.en;

    if (!checkAdminAuth()) {
        return NextResponse.redirect(new URL('/', req.url), 302);
    }

    if (!token) {
        return NextResponse.json(
            { reason: 'missing token', valid: false },
            { status: 400 }
        );
    }

    try {
        const decoded = verifyGiftCardToken(token);

        const order = await db.instance.query.orders.findFirst({
            where: (o) => eq(o.orderRef, decoded.orderRef),
        });

        if (!order) {
            return NextResponse.json(
                { reason: localisedString.orderNotFound, valid: false },
                { status: 404 }
            );
        }

        if (order.status === Status.COMPLETED) {
            return NextResponse.json({
                orderRef: order.orderRef,
                reason: localisedString.alreadyUsed,
                valid: false,
            });
        }

        if (order.status === Status.UNPAID) {
            return NextResponse.json({
                orderRef: order.orderRef,
                reason: localisedString.unpaid,
                valid: false,
            });
        }

        if (decoded.expired) {
            return NextResponse.json({
                orderRef: order.orderRef,
                reason: localisedString.manualCheckRequired,
                valid: false,
            });
        }

        await db
            .instance
            .update(orders)
            .set({ status: Status.COMPLETED })
            .where(eq(orders.orderRef, order.orderRef));

        return NextResponse.json({
            reason: `${localisedString.scanSuccess} - ${order.orderRef}`,
            valid: true,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { reason: localisedString.scanError, valid: false },
            { status: 401 }
        );
    }
}
