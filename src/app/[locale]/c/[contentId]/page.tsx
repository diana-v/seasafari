import { createClient } from '@sanity/client';
import { Metadata } from 'next';
import * as React from 'react';
import { Suspense } from 'react';

import { RichTextComponent } from '@/components/RichText/RichTextComponent';
import { Widget } from '@/components/Widget/WidgetComponent';
import { FooterContainer } from '@/containers/Footer/FooterContainer';
import { NavigationContainer } from '@/containers/Navigation/NavigationContainer';
import { fetchContentSectionData } from '@/schemas/content';
import { fetchFooterSectionData } from '@/schemas/footer';
import { fetchGiftCardWidgetSectionData } from '@/schemas/giftCardWidget';
import { fetchNavigationData } from '@/schemas/navigation';
import { fetchBlogSectionData } from '@/schemas/blog';
import { fetchBlogsSectionData } from '@/schemas/blogs';

const client = createClient({
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
    dataset: process.env.SANITY_STUDIO_DATASET,
    maxRetries: 3,
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    retryDelay: (attempt) => attempt * 1000,
    useCdn: true,
});

interface PageParams {
    params: Promise<{
        contentId: string;
        locale: string;
    }>;
}

export default async function ContentPage({ params }: PageParams) {
    const { contentId, locale } = await params;

    const content = await fetchContentSectionData(client, contentId, locale, 'lt')
    const giftCardWidget = await fetchGiftCardWidgetSectionData(client, locale, 'lt')
    const navigation = await fetchNavigationData(client, locale, 'lt')
    const footer = await fetchFooterSectionData(client, locale, 'lt')

    if (!content) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500">Page not found.</p>
            </div>
        );
    }

    return (
        <div className="content flex-grow bg-gray-50 min-h-screen" id={content.slug}>
            <Suspense fallback={<div className="h-24" />}>
                <NavigationContainer
                    isSimple
                    logo={navigation?.logo}
                    phone={navigation?.phone}
                />
            </Suspense>

            <main className="container min-h-[calc(100vh-130px)] mx-auto px-4 py-8 md:py-16 lg:py-24 flex flex-col gap-6 md:gap-10 lg:gap-16">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 border-b border-gray-200 pb-6">
                    {content.label}
                </h1>

                <article className="prose prose-blue max-w-none whitespace-pre-line">
                    {content.content && <RichTextComponent content={content.content} />}
                </article>
            </main>

            <FooterContainer common={footer?.common} faq={footer?.faq} />

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
    const { contentId, locale } = await params;
    const content = await fetchContentSectionData(client, contentId, locale, 'lt');

    return {
        title: `${content?.label ?? ''} | SeaSafari`,
    };
}
