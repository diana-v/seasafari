import * as React from 'react';
import { createClient } from '@sanity/client';
import { GetServerSideProps, NextPage } from 'next';
import { TypedObject } from '@portabletext/types';
import Head from 'next/head';

import { RichTextComponent } from '@/components/RichText/RichTextComponent';
import { NavigationContainer, NavigationProps } from '@/containers/Navigation/NavigationContainer';
import { fetchHeaderData } from '@/schemas/navigation';
import { fetchContentSectionData } from '@/schemas/content';
import { fetchFooterSectionData } from '@/schemas/footer';
import { FooterContainer, FooterProps } from '@/containers/Footer/FooterContainer';

export interface ContentProps {
    label?: string;
    slug?: string;
    content?: TypedObject | TypedObject[];
}

interface PageProps {
    navigation?: NavigationProps;
    content?: ContentProps;
    footer?: FooterProps;
    isAuthenticated: boolean;
}

const Content: NextPage<PageProps> = ({ navigation, content, footer, isAuthenticated }) => (
    <div id={content?.slug} className="flex-grow bg-grey-50 min-h-screen">
        <Head>
            <title>{`${content?.label} | SeaSafari`}</title>
        </Head>
        <NavigationContainer logo={navigation?.logo} sections={navigation?.sections} />
        <div className="container min-h-[calc(100vh-130px)] mx-auto px-4 py-8 md:py-16 lg:py-24 flex flex-wrap flex-col lg:flex-row gap-6 md:gap-10 lg:gap-16">
            {content?.content && <RichTextComponent content={content.content} />}
        </div>
        <FooterContainer items={footer?.items} contact={footer?.contact} />
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
    const navigation = await fetchHeaderData(client, locale, defaultLocale);
    const content = await fetchContentSectionData(client, contentId, locale, defaultLocale);
    const footer = await fetchFooterSectionData(client, locale, defaultLocale);

    return {
        props: {
            navigation,
            content,
            footer,
        },
    };
};

export default Content;
