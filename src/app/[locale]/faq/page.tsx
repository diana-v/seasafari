import { createClient } from '@sanity/client';
import { Metadata } from 'next';
import * as React from 'react';
import { Suspense } from 'react';

import { Widget } from '@/components/Widget/WidgetComponent';
import { FooterContainer } from '@/containers/Footer/FooterContainer';
import { NavigationContainer } from '@/containers/Navigation/NavigationContainer';
import { FaqLayout } from '@/layouts/FaqLayout/FaqLayout';
import { fetchFAQSectionData } from '@/schemas/faq';
import { fetchFooterSectionData } from '@/schemas/footer';
import { fetchGiftCardWidgetSectionData } from '@/schemas/giftCardWidget';
import { fetchNavigationData } from '@/schemas/navigation';

const client = createClient({
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
    dataset: process.env.SANITY_STUDIO_DATASET,
    maxRetries: 3,
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    retryDelay: (attempt) => attempt * 1000,
    useCdn: true,
});

interface PageParams {
    params: Promise<{ locale: string }>;
}

export default async function FaqPage({ params }: PageParams) {
    const { locale } = await params;

    const navigation = await fetchNavigationData(locale, 'lt')
    const footer = await fetchFooterSectionData(locale, 'lt')
    const faq = await fetchFAQSectionData(locale, 'lt')
    const giftCardWidget = await fetchGiftCardWidgetSectionData(locale, 'lt')

    const { description, faq: items, title } = faq ?? {};

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Suspense fallback={<div className="h-24" />}>
                <NavigationContainer
                    isSimple
                    logo={navigation?.logo}
                    phone={navigation?.phone}
                />
            </Suspense>

            <main className="container max-w-7xl flex-grow mx-auto px-4 py-8 md:py-16 lg:py-24 flex flex-col items-center gap-6 md:gap-8 lg:gap-10">
                <FaqLayout
                    description={description}
                    faq={items}
                    title={title}
                />
            </main>

            <FooterContainer
                common={footer?.common}
                faq={footer?.faq}
            />

            {giftCardWidget?.title && (
                <Widget
                    image={giftCardWidget.image}
                    isVisible
                    link={giftCardWidget.link}
                    title={giftCardWidget.title}
                />
            )}
        </div>
    );
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
    const { locale } = await params;
    const faq = await fetchFAQSectionData(locale, 'lt');

    return {
        description: '',
        title: `${faq?.title ?? ''} | SeaSafari`,
    };
}
