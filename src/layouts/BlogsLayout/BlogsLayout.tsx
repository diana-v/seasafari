'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import * as React from 'react';

import { CardComponent, CardType } from '@/components/Card/CardComponent';
import { IconComponent } from '@/components/Icon/IconComponent';
import { languages, LocaleType } from '@/translations/blog';

export interface BlogsProps {
    cards?: BlogCardType[];
    description?: string;
    title?: string;
}

interface BlogCardType {
    _createdAt?: string;
    backgroundColor?: string;
    description?: string;
    image?: string;
    slug?: string;
    title?: string;
}

export const BlogsLayout: React.FC<BlogsProps> = ({ cards, description, title }) => {
    const params = useParams();
    const locale = params.locale as string;
    const defaultLocale = 'lt';
    const localisedString = languages[(locale ?? defaultLocale) as LocaleType];

    if (!cards?.length) {
        return null;
    }

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
                        aria-label={localisedString.showMore}
                        className="flex shrink-0 text-white bg-blue-900 rounded-full items-center gap-2 px-6 py-3"
                        href={`/${locale}/blogs`}
                        scroll={true}
                    >
                        {localisedString.showMore}
                        <IconComponent className="h-2.5 w-3" name="arrowRightUp" />
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row gap-4 lg:gap-8">
                    {cards?.slice(0, 2)?.map((card, index) => {
                        return (
                            <div className="flex-1" key={index}>
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
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
