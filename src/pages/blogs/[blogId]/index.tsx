import * as React from 'react';
import { createClient } from '@sanity/client';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { TypedObject } from '@portabletext/types';

import { RichTextComponent } from '@/components/RichText/RichTextComponent';
import { NavigationContainer, NavigationProps } from '@/containers/Navigation/NavigationContainer';
import { fetchHeaderData } from '@/schemas/navigation';
import { FooterContainer, FooterProps } from '@/containers/Footer/FooterContainer';
import { fetchFooterSectionData } from '@/schemas/footer';
import { fetchBlogSectionData } from '@/schemas/blog';
import { ImageContainer } from '@/containers/Image/ImageContainer';
import { IconComponent } from '@/components/Icon/IconComponent';

export interface BlogProps {
    slug?: string;
    image?: string;
    title?: string;
    description?: string;
    content?: TypedObject | TypedObject[];
    _createdAt?: string;
}

interface PageProps {
    navigation?: NavigationProps;
    blog?: BlogProps;
    footer?: FooterProps;
}

const Blog: NextPage<PageProps> = ({ navigation, blog, footer }) => (
    <div id={blog?.slug ?? ''} className="flex-grow bg-grey-50 min-h-screen">
        <Head>
            <title>{`${blog?.title ?? ''} | SeaSafari`}</title>
            <meta name="description" content={blog?.description} />
        </Head>
        <NavigationContainer logo={navigation?.logo} sections={navigation?.sections} />
        <div className="container max-w-7xl min-h-[calc(100vh-130px)] mx-auto px-4 py-8 md:py-16 lg:py-24 flex flex-col flex-wrap gap-6 md:gap-8 lg:gap-10">
            {blog?.image && (
                <ImageContainer
                    src={blog?.image}
                    width={1500}
                    height={250}
                    className={'w-full h-[200px] md:h-[300px] lg:h-[450px] object-cover rounded-t'}
                />
            )}
            <div>
                {blog?.title && <h1 className="mb-0">{blog?.title}</h1>}
                <div className="bg-grey-50 text-grey-400 text-sm pb-4 border-b border-grey-100 flex gap-2 items-center">
                    <IconComponent name="calendar" className="w-4 h-4 text-grey-400" />
                    {blog?._createdAt && blog?._createdAt?.split('T')[0]}
                </div>
            </div>
            <div className="basis-1 flex-grow w-full whitespace-pre-line">
                {blog?.content && <RichTextComponent content={blog.content} />}
            </div>
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
    const blogId = params?.blogId;
    const navigation = await fetchHeaderData(client, locale, defaultLocale);
    const blog = await fetchBlogSectionData(client, blogId, locale, defaultLocale);
    const footer = await fetchFooterSectionData(client, locale, defaultLocale);

    return {
        props: {
            navigation,
            blog,
            footer,
        },
    };
};

export default Blog;
