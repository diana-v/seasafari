import { createClient } from '@sanity/client';
import { Metadata } from 'next';
import * as React from 'react';

import { CardComponent, CardType } from '@/components/Card/CardComponent';
import { Widget } from '@/components/Widget/WidgetComponent';
import { FooterContainer } from '@/containers/Footer/FooterContainer';
import { NavigationContainer } from '@/containers/Navigation/NavigationContainer';
import { fetchBlogsSectionData } from '@/schemas/blogs';
import { fetchFooterSectionData } from '@/schemas/footer';
import { fetchGiftCardWidgetSectionData } from '@/schemas/giftCardWidget';
import { fetchNavigationData } from '@/schemas/navigation';
import { languages, LocaleType } from '@/translations/blog';

const client = createClient({
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
    dataset: process.env.SANITY_STUDIO_DATASET,
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    useCdn: false,
});

interface PageParams {
    params: Promise<{
        locale: string;
    }>;
}

export default async function BlogsPage({ params }: PageParams) {
    const { locale } = await params;

    const [navigation, blogs, footer, giftCardWidget] = await Promise.all([
        fetchNavigationData(client, locale, 'lt'),
        fetchBlogsSectionData(client, locale, 'lt'),
        fetchFooterSectionData(client, locale, 'lt'),
        fetchGiftCardWidgetSectionData(client, locale, 'lt'),
    ]);

    const { cards, description, slug, title } = blogs ?? {};
    const localisedString = languages[locale as LocaleType] || languages['lt'];

    return (
        <div className="flex-grow bg-gray-50 min-h-screen" id={slug ?? ''}>
            <NavigationContainer
                isSimple
                logo={navigation?.logo}
                phone={navigation?.phone}
            />

            <div className="xl:container min-h-[calc(100vh-130px)] mx-auto px-4 py-8 md:py-16 lg:py-24 flex flex-col flex-wrap gap-6 md:gap-8 lg:gap-10">
                {(title || description) && (
                    <div className="max-w-5xl">
                        {title && <h2 className="text-2xl md:text-4xl font-bold mb-4">{title}</h2>}
                        {description && <p className="text-gray-600">{description}</p>}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    {cards?.map((card, index) => (
                        <div className="max-w-[736px] w-full" key={index}>
                            <CardComponent
                                classNames={{
                                    image: 'brightness-50',
                                    root: `h-full w-full`,
                                }}
                                createdAt={card._createdAt}
                                description={card.description}
                                image={card.image}
                                linkTitle={localisedString.continueReading}
                                linkUrl={`/${locale}/blogs/${card.slug}`}
                                style={{ backgroundColor: card.backgroundColor }}
                                title={card.title}
                                type={CardType.Blog}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <FooterContainer common={footer?.common} faq={footer?.faq} />

            {giftCardWidget && giftCardWidget.title && (
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
    const { locale } = await params;
    const blogs = await fetchBlogsSectionData(client, locale, 'lt');
    const { cards, description, slug, title } = blogs ?? {};

    return {
        description: description,
        openGraph: {
            description: description,
            images: cards?.[0]?.image ? [cards[0].image] : [],
            siteName: 'SeaSafari',
            title: title,
            type: 'article',
            url: `https://www.seasafari.lt/${locale}/${slug ?? ''}`,
        },
        title: `${title ?? ''} | SeaSafari`,
        twitter: {
            card: 'summary_large_image',
            description: description,
            images: cards?.[0]?.image ? [cards[0].image] : [],
            title: title,
        },
    };
}
