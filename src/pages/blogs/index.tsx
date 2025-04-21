import * as React from 'react';
import { createClient } from '@sanity/client';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { NavigationContainer, NavigationProps } from '@/containers/Navigation/NavigationContainer';
import { fetchHeaderData } from '@/schemas/navigation';
import { FooterContainer, FooterProps } from '@/containers/Footer/FooterContainer';
import { fetchFooterSectionData } from '@/schemas/footer';
import { fetchBlogsSectionData } from '@/schemas/blogs';
import { CardComponent, CardType } from '@/components/Card/CardComponent';
import { languages, LocaleType } from '@/translations/blog';

type BlogCardType = {
    slug?: string;
    title?: string;
    image?: string;
    description?: string;
    _createdAt?: string;
};

export interface BlogsProps {
    slug?: string;
    title?: string;
    description?: string;
    cards?: BlogCardType[];
}

interface PageProps {
    navigation?: NavigationProps;
    blogs?: BlogsProps;
    footer?: FooterProps;
}

const Blogs: NextPage<PageProps> = ({ navigation, blogs, footer }) => {
    const { slug, title, description, cards } = blogs ?? {};
    const { locale, defaultLocale } = useRouter();
    const localisedString = languages[(locale ?? defaultLocale) as LocaleType];

    return (
        <div id={slug ?? ''} className="flex-grow bg-grey-50 min-h-screen">
            <Head>
                <title>{`${title ?? ''} | SeaSafari`}</title>
                <meta name="description" content={description} />
            </Head>
            <NavigationContainer logo={navigation?.logo} sections={navigation?.sections} />
            <div className="container max-w-7xl min-h-[calc(100vh-130px)] mx-auto px-4 py-8 md:py-16 lg:py-24 flex flex-col flex-wrap items-center gap-6 md:gap-8 lg:gap-10">
                {(title || description) && (
                    <div className="max-w-5xl text-center">
                        {title && <h1 className="uppercase">{title}</h1>}
                        {description && <p>{description}</p>}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
                    {cards?.map((card, index) => (
                        <div key={index} className="max-w-[480px] w-full">
                            <CardComponent
                                classNames={{ root: 'h-full w-full', image: 'h-[250px] brightness-50' }}
                                type={CardType.Blog}
                                title={card.title}
                                description={card.description}
                                createdAt={card._createdAt}
                                image={card.image}
                                linkUrl={{
                                    pathname: '/[locale]/blogs/[blogId]',
                                    query: { blogId: card.slug, locale },
                                }}
                                linkTitle={localisedString.continueReading}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <FooterContainer items={footer?.items} contact={footer?.contact} />
        </div>
    );
};

const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
    useCdn: false,
});

export const getServerSideProps: GetServerSideProps = async ({ params, locale, defaultLocale }) => {
    const navigation = await fetchHeaderData(client, locale, defaultLocale);
    const blogs = await fetchBlogsSectionData(client, locale, defaultLocale);
    const footer = await fetchFooterSectionData(client, locale, defaultLocale);

    return {
        props: {
            navigation,
            blogs,
            footer,
        },
    };
};

export default Blogs;
