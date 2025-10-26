import * as React from 'react';
import { TypedObject } from '@portabletext/types';
import { useRouter } from 'next/router';

import { CardComponent, CardType } from '@/components/Card/CardComponent';
import { RichTextComponent } from '@/components/RichText/RichTextComponent';

type OffersCardType = {
    slug?: string;
    title?: string;
    imageCompressed?: string;
    description?: string;
    linkTitle?: string;
};

export interface OffersProps {
    title?: string;
    description?: TypedObject | TypedObject[];
    cards?: OffersCardType[];
}

export const OffersLayout: React.FC<OffersProps> = ({ title, description, cards }) => {
    if (!cards?.length) {
        return null;
    }

    const { locale } = useRouter();

    return (
        <div id="offers" className="bg-blue-50 pt-8 md:pt-16 lg:pt-24">
            <div className="xl:container mx-auto px-4 flex flex-col gap-6 md:gap-10 lg:gap-16">
                {(title || description) && (
                    <div className="max-w-5xl">
                        {title && <h2>{title}</h2>}
                        {description && <RichTextComponent content={description} />}
                    </div>
                )}

                <div className="flex flex-col divide-y">
                    {cards?.map((card, index) => (
                        <CardComponent
                            key={index}
                            classNames={{ root: 'mb-12 pt-12 h-full w-full' }}
                            type={CardType.Image}
                            title={card.title}
                            description={card.description}
                            image={card.imageCompressed}
                            linkUrl={{
                                pathname: '/[locale]/[offerId]',
                                query: { offerId: card.slug, locale },
                            }}
                            linkTitle={card.linkTitle}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
