import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import * as React from 'react';
import { Suspense } from 'react';

import { FooterContainer } from '@/containers/Footer/FooterContainer';
import { NavigationContainer } from '@/containers/Navigation/NavigationContainer';
import { fetchFooterSectionData } from '@/schemas/footer';
import { fetchNavigationData } from '@/schemas/navigation';

import PaymentPendingClient from './PaymentPendingClient';

interface PageProps {
    params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
    robots: { index: false },
    title: 'Payment Pending | SeaSafari',
};

const supportedLocales = new Set(['en', 'lt', 'ru']);

export default async function PaymentPendingPage({ params }: PageProps) {
    const { locale } = await params;

    if (!supportedLocales.has(locale)) notFound();

    const navigation = await fetchNavigationData(locale, 'lt')
    const footer = await fetchFooterSectionData(locale, 'lt')

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
