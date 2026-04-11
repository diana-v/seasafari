import { createClient } from '@sanity/client';
import { Metadata } from 'next';
import Link from 'next/link';
import * as React from 'react';

import { FooterContainer } from '@/containers/Footer/FooterContainer';
import { NavigationContainer } from '@/containers/Navigation/NavigationContainer';
import { fetchFooterSectionData } from '@/schemas/footer';
import { fetchNavigationData } from '@/schemas/navigation';
import { languages, LocaleType } from '@/translations/failed';

const client = createClient({
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
    dataset: process.env.SANITY_STUDIO_DATASET,
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    useCdn: true, // This page can use CDN as the data is static common data
});

interface PageProps {
    params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
    robots: { index: false },
    title: 'Payment Failed | SeaSafari',
};

export default async function PaymentFailedPage({ params }: PageProps) {
    const { locale } = await params;

    // Parallel fetching for shared UI components
    const [navigation, footer] = await Promise.all([
        fetchNavigationData(client, locale, 'lt'),
        fetchFooterSectionData(client, locale, 'lt'),
    ]);

    const localisedString = languages[locale as LocaleType] || languages['lt'];
    const contactEmail = process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL;

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <NavigationContainer
                isSimple
                logo={navigation?.logo}
                phone={navigation?.phone}
            />

            <main className="xl:container mx-auto flex-grow flex flex-col justify-center px-4">
                <div className="max-w-xl mx-auto text-center flex flex-col gap-6 items-center py-20">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-red-600">
                        {localisedString.paymentFailed}
                    </h1>

                    <p className="text-lg text-gray-700 leading-relaxed">
                        {localisedString.paymentFailedDescription}
                    </p>

                    <Link
                        className="mt-6 px-10 py-4 bg-black text-white rounded-full font-bold hover:bg-gray-800 transform hover:scale-105 transition-all shadow-lg"
                        href={`/${locale}`}
                    >
                        {localisedString.link}
                    </Link>

                    <div className="mt-12 pt-8 border-t border-gray-100 w-full">
                        <p className="text-gray-400 text-sm">
                            {localisedString.havingIssues}{' '}
                            <Link
                                className="text-gray-900 font-medium underline underline-offset-4 hover:text-red-600 transition-colors"
                                href={`mailto:${contactEmail}`}
                            >
                                {contactEmail}
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            <FooterContainer common={footer?.common} faq={footer?.faq} />
        </div>
    );
}
