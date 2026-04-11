import { createClient } from '@sanity/client';
import { asc, eq } from 'drizzle-orm';
import { cookies as nextCookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { fetchNavigationData } from '@/schemas/navigation';
import { db } from '@/server/db';
import { orders, Status } from '@/server/db/schema';

import AdminClient from './AdminClient';

const client = createClient({
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
    dataset: process.env.SANITY_STUDIO_DATASET,
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    useCdn: false,
});

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const cookieStore = await nextCookies();
    const authCookie = cookieStore.get('auth')?.value;

    if (!authCookie) redirect('/login');

    const decodedValue = Buffer.from(authCookie, 'base64').toString('utf8');
    const [username, password] = decodedValue.split(':');

    if (username !== process.env.BASIC_AUTH_USER || password !== process.env.BASIC_AUTH_PASSWORD) {
        redirect('/login');
    }

    const [navigation, initialOrders] = await Promise.all([
        fetchNavigationData(client, locale, 'lt'),
        db.query.orders.findMany({
            orderBy: asc(orders.orderRef),
            where: (order) => eq(order.status, Status.CREATED),
        })
    ]);

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