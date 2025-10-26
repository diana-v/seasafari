import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { CardComponent, CardType } from '@/components/Card/CardComponent';
import { languages, LocaleType } from '@/translations/blog';
import { IconComponent } from '@/components/Icon/IconComponent';

type BlogCardType = {
    slug?: string;
    title?: string;
    image?: string;
    description?: string;
    _createdAt?: string;
    backgroundColor?: string;
};

export interface BlogsProps {
    title?: string;
    description?: string;
    cards?: BlogCardType[];
}

export const BlogsLayout: React.FC<BlogsProps> = ({ title, description, cards }) => {
    if (!cards?.length) {
        return null;
    }

    const { locale, defaultLocale } = useRouter();
    const localisedString = languages[(locale ?? defaultLocale) as LocaleType];

    return (
        <div className="pt-8 md:pt-16 lg:pt-24">
            <div className="xl:container mx-auto px-4 flex flex-col gap-6 md:gap-10 lg:gap-16">
                <div className="flex flex-wrap md:flex-nowrap items-center gap-8 justify-between">
                    {(title || description) && (
                        <div className="max-w-5xl">
                            {title && <h2>{title}</h2>}
                            {description && <p>{description}</p>}
                        </div>
                    )}
                    <Link
                        className="flex shrink-0 text-white bg-blue-900 rounded-full items-center gap-2 px-6 py-3 "
                        href={{
                            pathname: '/[locale]/blogs',
                            query: { locale },
                        }}
                        aria-label={localisedString.showMore}
                    >
                        {localisedString.showMore}
                        <IconComponent name="arrowRightUp" className="h-2.5 w-3" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
                    {cards?.slice(0, 2)?.map((card, index) => {
                        return (
                            <div key={index}>
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
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
