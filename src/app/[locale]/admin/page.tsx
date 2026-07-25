import { asc, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { fetchNavigationData } from '@/schemas/navigation';
import { db } from '@/server/db';
import { orders, Status } from '@/server/db/schema';
import { checkAdminAuth } from '@/utils/checkAdminAuth';

import AdminClient from './AdminClient';

export default function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
    return (
        <Suspense>
            <AdminPageContent params={params} />
        </Suspense>
    );
}

async function AdminPageContent({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const isAuthenticated = await checkAdminAuth()

    if (!isAuthenticated) redirect(`/${locale}/login`);

    const navigation = await fetchNavigationData(locale, 'lt')

    const initialOrders = await
        db.instance.query.orders.findMany({
            orderBy: asc(orders.orderRef),
            where: (order) => eq(order.status, Status.CREATED),
        })

    // eslint-disable-next-line unicorn/prefer-structured-clone
    const formattedOrders = JSON.parse(JSON.stringify(initialOrders));

    return (
        <AdminClient
            initialOrders={formattedOrders}
            lang={locale}
            navigation={navigation}
        />
    );
}