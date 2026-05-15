import { createClient } from '@sanity/client';
import { Metadata } from 'next';
import Link from 'next/link';
import * as React from 'react';
import { Suspense } from 'react';

import { FooterContainer } from '@/containers/Footer/FooterContainer';
import { NavigationContainer } from '@/containers/Navigation/NavigationContainer';
import { fetchFooterSectionData } from '@/schemas/footer';
import { fetchNavigationData } from '@/schemas/navigation';
import { languages, LocaleType } from '@/translations/error';

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
    searchParams: Promise<{ errorCode?: string }>;
}

export const metadata: Metadata = {
    robots: { follow: true, index: false },
    title: 'Payment Error | SeaSafari',
};

export default async function PaymentErrorPage({ params, searchParams }: PageProps) {
    const { locale } = await params;
    const { errorCode } = await searchParams;

    const navigation = await fetchNavigationData(locale, 'lt')
    const footer = await fetchFooterSectionData(locale, 'lt')

    const localisedString = languages[locale as LocaleType] || languages['lt'];

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Suspense fallback={<div className="h-24" />}>
                <NavigationContainer
                    isSimple
                    logo={navigation?.logo}
                    phone={navigation?.phone}
                />
            </Suspense>

            <main className="xl:container mx-auto flex-grow flex flex-col px-4">
                <div className="max-w-4xl mx-auto text-center flex flex-grow flex-col gap-4 items-center justify-center py-12">
                    <div className="flex flex-col gap-4 items-center justify-center relative w-full">
                        {errorCode && (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-200/50 text-[10rem] md:text-[20rem] lg:text-[25rem] font-black select-none pointer-events-none -z-0 overflow-hidden leading-none">
                                {errorCode}
                            </div>
                        )}

                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 z-10">
                            {localisedString.errorMessage}
                        </h1>

                        <Link
                            aria-label={localisedString.link}
                            className="text-lg font-medium underline underline-offset-8 hover:text-blue-900 transition-colors z-10"
                            href={`/${locale}`}
                            prefetch={false}
                        >
                            {localisedString.link}
                        </Link>
                    </div>

                    <div className="max-w-2xl mt-8 text-gray-500 z-10 leading-relaxed">
                        <p>
                            {localisedString.disclaimerQuestion}{' '}
                            <Link className="text-gray-900 font-semibold underline underline-offset-4 hover:text-blue-900" href={`/${locale}/#kontaktai`} prefetch={false}>
                                {localisedString.disclaimerSubmitForm}
                            </Link>
                            {' '}{localisedString.disclaimerOr}{' '}
                            <Link
                                className="text-gray-900 font-semibold underline underline-offset-4 hover:text-blue-900"
                                href={`mailto:${process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL}`}
                                prefetch={false}
                            >
                                {localisedString.disclaimerSendEmail}
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            <FooterContainer common={footer?.common} faq={footer?.faq} />
        </div>
    );
}
