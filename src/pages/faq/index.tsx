import * as React from 'react';
import { createClient } from '@sanity/client';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';

import { NavigationContainer, NavigationProps } from '@/containers/Navigation/NavigationContainer';
import { fetchNavigationData } from '@/schemas/navigation';
import { FooterContainer, FooterProps } from '@/containers/Footer/FooterContainer';
import { fetchFooterSectionData } from '@/schemas/footer';
import { fetchFAQSectionData } from '@/schemas/faq';
import { FAQLayout, FAQProps } from '@/layouts/FAQLayout/FAQLayout';
import { Widget, WidgetProps } from '@/components/Widget/WidgetComponent';
import { fetchGiftCardWidgetSectionData } from '@/schemas/giftCardWidget';

interface PageProps {
    navigation?: NavigationProps;
    faq?: FAQProps;
    footer?: FooterProps;
    giftCardWidget?: WidgetProps;
}

const FAQ: NextPage<PageProps> = ({ navigation, faq, footer, giftCardWidget }) => {
    const { title, seoDescription, description, faq: items } = faq ?? {};

    return (
        <div className="flex-grow bg-grey-50 min-h-screen">
            <Head>
                <title>{`${title ?? ''} | SeaSafari`}</title>
                <meta name="description" content={seoDescription} />
            </Head>
            <NavigationContainer logo={navigation?.logo} phone={navigation?.phone} isSimple />
            <div className="container max-w-7xl min-h-[calc(100vh-130px)] mx-auto px-4 py-8 md:py-16 lg:py-24 flex flex-col flex-wrap items-center gap-6 md:gap-8 lg:gap-10">
                <FAQLayout title={title} description={description} faq={items} />
            </div>
            <FooterContainer common={footer?.common} faq={footer?.faq} />
            {giftCardWidget && giftCardWidget.title && (
                <Widget
                    isVisible
                    link={giftCardWidget.link}
                    title={giftCardWidget.title}
                    image={giftCardWidget.image}
                />
            )}
        </div>
    );
};

const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
    useCdn: false,
});

export const getServerSideProps: GetServerSideProps = async ({ locale, defaultLocale }) => {
    const navigation = await fetchNavigationData(client, locale, defaultLocale);
    const faq = await fetchFAQSectionData(client, locale, defaultLocale);
    const footer = await fetchFooterSectionData(client, locale, defaultLocale);
    const giftCardWidget = await fetchGiftCardWidgetSectionData(client, locale, defaultLocale);

    return {
        props: {
            navigation,
            faq,
            footer,
            giftCardWidget,
        },
    };
};

export default FAQ;
