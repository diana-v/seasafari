import { createClient } from '@sanity/client';
import { Metadata } from 'next';
import * as React from 'react';

import { FooterContainer } from '@/containers/Footer/FooterContainer';
import { NavigationContainer } from '@/containers/Navigation/NavigationContainer';
import { fetchFooterSectionData } from '@/schemas/footer';
import { fetchNavigationData } from '@/schemas/navigation';

import PaymentPendingClient from './PaymentPendingClient';

const client = createClient({
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
    dataset: process.env.SANITY_STUDIO_DATASET,
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    useCdn: true,
});

interface PageProps {
    params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
    robots: { index: false },
    title: 'Payment Pending | SeaSafari',
};

export default async function PaymentPendingPage({ params }: PageProps) {
    const { locale } = await params;

    const [navigation, footer] = await Promise.all([
        fetchNavigationData(client, locale, 'lt'),
        fetchFooterSectionData(client, locale, 'lt'),
    ]);

    return (
        <div className="flex flex-col min-h-screen">
            <NavigationContainer
                isSimple
                logo={navigation?.logo}
                phone={navigation?.phone}
            />

            <PaymentPendingClient locale={locale} />

            <FooterContainer common={footer?.common} faq={footer?.faq} />
        </div>
    );
}
