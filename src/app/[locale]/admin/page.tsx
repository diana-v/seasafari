import { createClient } from '@sanity/client';
import { asc, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

import { fetchNavigationData } from '@/schemas/navigation';
import { db } from '@/server/db';
import { orders, Status } from '@/server/db/schema';
import { checkAdminAuth } from '@/utils/checkAdminAuth';

import AdminClient from './AdminClient';
import { fetchBlogsSectionData } from '@/schemas/blogs';
import { fetchGiftCardWidgetSectionData } from '@/schemas/giftCardWidget';
import { fetchFooterSectionData } from '@/schemas/footer';

const client = createClient({
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
    dataset: process.env.SANITY_STUDIO_DATASET,
    maxRetries: 3,
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    retryDelay: (attempt) => attempt * 1000,
    useCdn: true,
});

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const isAuthenticated = await checkAdminAuth()

    if (!isAuthenticated) redirect(`/${locale}/login`);

    const navigation = await fetchNavigationData(client, locale, 'lt')

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