import * as React from 'react';
import { TypedObject } from '@portabletext/types';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { CardComponent, CardType } from '@/components/Card/CardComponent';
import { RichTextComponent } from '@/components/RichText/RichTextComponent';

type OffersCardType = {
    slug?: string;
    title?: string;
    imageCompressed?: string;
    description?: string;
};

export interface OffersProps {
    sectionTitle?: string;
    title?: string;
    description?: TypedObject | TypedObject[];
    cards?: OffersCardType[];
}

export const OffersLayout: React.FC<OffersProps> = ({ sectionTitle, title, description, cards }) => {
    if (!cards?.length) {
        return null;
    }

    const { locale } = useRouter();

    return (
        <div id={sectionTitle?.toLowerCase()} className="bg-grey-50 py-8 md:py-16 lg:py-24">
            <div className="container mx-auto px-4 flex flex-col items-center flex flex-col gap-6 md:gap-10 lg:gap-16">
                {(title || description) && (
                    <div className="max-w-5xl text-center">
                        {title && <h1 className="uppercase">{title}</h1>}
                        {description && <RichTextComponent content={description} />}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
                    {cards?.map((card, index) => (
                        <Link
                            key={index}
                            href={{
                                pathname: '/[locale]/[offerId]',
                                query: { offerId: card.slug, locale },
                            }}
                            className="max-w-[480px]"
                        >
                            <CardComponent
                                classNames={{ root: 'mb-4 h-full w-full', image: 'h-[250px] brightness-50' }}
                                type={CardType.Image}
                                title={card.title}
                                description={card.description}
                                image={card.imageCompressed}
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};
