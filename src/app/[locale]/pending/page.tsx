import { createClient } from '@sanity/client';
import { Metadata } from 'next';
import * as React from 'react';
import { Suspense } from 'react';

import { FooterContainer } from '@/containers/Footer/FooterContainer';
import { NavigationContainer } from '@/containers/Navigation/NavigationContainer';
import { fetchFooterSectionData } from '@/schemas/footer';
import { fetchNavigationData } from '@/schemas/navigation';

import PaymentPendingClient from './PaymentPendingClient';

const client = createClient({
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
    dataset: process.env.SANITY_STUDIO_DATASET,
    maxRetries: 3,
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    retryDelay: (attempt) => attempt * 1000,
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
            <Suspense fallback={<div className="h-24" />}>
                <NavigationContainer
                    isSimple
                    logo={navigation?.logo}
                    phone={navigation?.phone}
                />
            </Suspense>

            <Suspense fallback={<div className="min-h-[calc(100vh-130px)]" />}>
                <PaymentPendingClient locale={locale} />
            </Suspense>

            <FooterContainer common={footer?.common} faq={footer?.faq} />
        </div>
    );
}
