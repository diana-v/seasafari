import * as React from 'react';
import { createClient } from '@sanity/client';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { NavigationContainer, NavigationProps } from '@/containers/Navigation/NavigationContainer';
import { fetchNavigationData } from '@/schemas/navigation';
import { FooterContainer, FooterProps } from '@/containers/Footer/FooterContainer';
import { fetchFooterSectionData } from '@/schemas/footer';
import { fetchBlogsSectionData } from '@/schemas/blogs';
import { CardComponent, CardType } from '@/components/Card/CardComponent';
import { languages, LocaleType } from '@/translations/blog';
import { Widget, WidgetProps } from '@/components/Widget/WidgetComponent';
import { fetchGiftCardWidgetSectionData } from '@/schemas/giftCardWidget';

type BlogCardType = {
    slug?: string;
    title?: string;
    image?: string;
    description?: string;
    backgroundColor?: string;
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
    giftCardWidget?: WidgetProps;
}

const Blogs: NextPage<PageProps> = ({ navigation, blogs, footer, giftCardWidget }) => {
    const { slug, title, description, cards } = blogs ?? {};
    const { locale, defaultLocale } = useRouter();
    const localisedString = languages[(locale ?? defaultLocale) as LocaleType];

    return (
        <div id={slug ?? ''} className="flex-grow bg-grey-50 min-h-screen">
            <Head>
                <title>{`${title ?? ''} | SeaSafari`}</title>
                <meta name="description" content={description} />
            </Head>
            <NavigationContainer logo={navigation?.logo} phone={navigation?.phone} isSimple />
            <div className="xl:container min-h-[calc(100vh-130px)] mx-auto px-4 py-8 md:py-16 lg:py-24 flex flex-col flex-wrap gap-6 md:gap-8 lg:gap-10">
                {(title || description) && (
                    <div className="max-w-5xl">
                        {title && <h2>{title}</h2>}
                        {description && <p>{description}</p>}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    {cards?.map((card, index) => (
                        <div key={index} className="max-w-[736px] w-full">
                            <CardComponent
                                classNames={{
                                    root: `h-full w-full`,
                                    image: 'brightness-50',
                                }}
                                style={{ backgroundColor: card.backgroundColor }}
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
    const blogs = await fetchBlogsSectionData(client, locale, defaultLocale);
    const footer = await fetchFooterSectionData(client, locale, defaultLocale);
    const giftCardWidget = await fetchGiftCardWidgetSectionData(client, locale, defaultLocale);

    return {
        props: {
            navigation,
            blogs,
            footer,
            giftCardWidget,
        },
    };
};

export default Blogs;
