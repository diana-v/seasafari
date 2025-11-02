import * as React from 'react';
import { createClient } from '@sanity/client';
import { GetServerSideProps, NextPage } from 'next';
import { TypedObject } from '@portabletext/types';
import Head from 'next/head';

import { RichTextComponent } from '@/components/RichText/RichTextComponent';
import { NavigationContainer, NavigationProps } from '@/containers/Navigation/NavigationContainer';
import { fetchNavigationData } from '@/schemas/navigation';
import { fetchContentSectionData } from '@/schemas/content';
import { fetchFooterSectionData } from '@/schemas/footer';
import { FooterContainer, FooterProps } from '@/containers/Footer/FooterContainer';
import { fetchGiftCardWidgetSectionData } from '@/schemas/giftCardWidget';
import { Widget, WidgetProps } from '@/components/Widget/WidgetComponent';

export interface ContentProps {
    label?: string;
    slug?: string;
    content?: TypedObject | TypedObject[];
}

interface PageProps {
    navigation?: NavigationProps;
    content?: ContentProps;
    footer?: FooterProps;
    giftCardWidget?: WidgetProps;
}

const Content: NextPage<PageProps> = ({ navigation, content, footer, giftCardWidget }) => (
    <div id={content?.slug} className="content flex-grow bg-grey-50 min-h-screen">
        <Head>
            <title>{`${content?.label} | SeaSafari`}</title>
        </Head>
        <NavigationContainer logo={navigation?.logo} phone={navigation?.phone} isSimple />
        <div className="container min-h-[calc(100vh-130px)] mx-auto px-4 py-8 md:py-16 lg:py-24 flex flex-wrap flex-col lg:flex-row gap-6 md:gap-10 lg:gap-16">
            {content?.content && <RichTextComponent content={content.content} />}
        </div>
        <FooterContainer common={footer?.common} faq={footer?.faq} />
        {giftCardWidget && giftCardWidget.title && (
            <Widget isVisible link={giftCardWidget.link} title={giftCardWidget.title} image={giftCardWidget.image} />
        )}
    </div>
);

const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
    useCdn: false,
});

export const getServerSideProps: GetServerSideProps = async ({ params, locale, defaultLocale }) => {
    const contentId = params?.contentId;
    const navigation = await fetchNavigationData(client, locale, defaultLocale);
    const content = await fetchContentSectionData(client, contentId, locale, defaultLocale);
    const footer = await fetchFooterSectionData(client, locale, defaultLocale);
    const giftCardWidget = await fetchGiftCardWidgetSectionData(client, locale, defaultLocale);

    return {
        props: {
            navigation,
            content,
            footer,
            giftCardWidget,
        },
    };
};

export default Content;
