import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import cn from 'clsx';

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
    sectionTitle?: string;
    title?: string;
    description?: string;
    cards?: BlogCardType[];
}

export const BlogsLayout: React.FC<BlogsProps> = ({ sectionTitle, title, description, cards }) => {
    if (!cards?.length) {
        return null;
    }

    const { locale, defaultLocale } = useRouter();
    const localisedString = languages[(locale ?? defaultLocale) as LocaleType];

    return (
        <div id={sectionTitle?.toLowerCase()} className="py-8 md:py-16 lg:py-24">
            <div className="container mx-auto px-4 flex flex-col items-center gap-6 md:gap-10 lg:gap-16">
                {(title || description) && (
                    <div className="max-w-5xl text-center">
                        {title && <h1 className="uppercase">{title}</h1>}
                        {description && <p>{description}</p>}
                    </div>
                )}

                <div className="flex flex-wrap flex-col md:flex-row gap-4 lg:gap-8">
                    {cards?.slice(0, 3)?.map((card, index) => (
                        <div
                            key={index}
                            className={cn('flex-grow basis-1 md:basis-1/3 lg:basis-1/4 max-w-[480px]', {
                                'hidden md:block': index === 1,
                                'hidden lg:block': index === 2,
                            })}
                        >
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
                <Link
                    className="border border-red-900 text-red-900 hover:bg-red-900 hover:text-white px-16 py-2 rounded"
                    href={{
                        pathname: '/[locale]/blogs',
                        query: { locale },
                    }}
                >
                    {localisedString.showMore}
                </Link>
            </div>
        </div>
    );
};
