import { useRouter } from 'next/router';
import * as React from 'react';
import { GetStaticProps, NextPage } from 'next';
import { createClient } from '@sanity/client';
import Link from 'next/link';

import { NavigationContainer, NavigationProps } from '@/containers/Navigation/NavigationContainer';
import { FooterContainer, FooterProps } from '@/containers/Footer/FooterContainer';
import { fetchNavigationData } from '@/schemas/navigation';
import { fetchFooterSectionData } from '@/schemas/footer';
import { languages, LocaleType } from '@/translations/failed';

interface PageProps {
    navigation?: NavigationProps;
    footer?: FooterProps;
}

const PaymentFailedPage: NextPage<PageProps> = ({ navigation, footer }) => {
    const { locale, defaultLocale } = useRouter();
    const localisedString = languages[(locale ?? defaultLocale) as LocaleType];

    return (
        <>
            <NavigationContainer logo={navigation?.logo} phone={navigation?.phone} isSimple />
            <div className="xl:container mx-auto min-h-[calc(100vh-130px)] flex flex-col justify-center">
                <div className="max-w-lg mx-auto text-center flex flex-col gap-6 items-center">
                    <h2 className="text-red-600">{localisedString.paymentFailed}</h2>
                    <p className="text-gray-900">{localisedString.paymentFailedDescription}</p>

                    <Link
                        href="/"
                        className="mt-6 px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-colors"
                    >
                        {localisedString.link}
                    </Link>

                    <p className="text-gray-400 text-sm mt-8">
                        {localisedString.havingIssues}
                        <Link
                            className="underline underline-offset-4"
                            href={`mailto:${process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL}`}
                        >
                            {process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL}
                        </Link>
                    </p>
                </div>
            </div>
            <FooterContainer common={footer?.common} faq={footer?.faq} />
        </>
    );
};

const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
    useCdn: true,
});

export const getStaticProps: GetStaticProps = async ({ locale, defaultLocale }) => {
    const navigation = await fetchNavigationData(client, locale, defaultLocale);
    const footer = await fetchFooterSectionData(client, locale, defaultLocale);

    return {
        props: {
            navigation,
            footer,
        },
    };
};

export default PaymentFailedPage;
