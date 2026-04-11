'use client';

import { TypedObject } from '@portabletext/types';
import { useParams } from 'next/navigation';
import * as React from 'react';

import { CardComponent, CardType } from '@/components/Card/CardComponent';
import { RichTextComponent } from '@/components/RichText/RichTextComponent';

export interface OffersProps {
    cards?: OffersCardType[];
    description?: TypedObject | TypedObject[];
    title?: string;
}

interface OffersCardType {
    description?: string;
    imageCompressed?: string;
    linkTitle?: string;
    slug?: string;
    title?: string;
}

export const OffersLayout: React.FC<OffersProps> = ({ cards, description, title }) => {
    const params = useParams();
    const locale = params.locale as string;

    if (!cards?.length) {
        return null;
    }

    return (
        <div className="bg-blue-50 pt-8 md:pt-16 lg:pt-24" id="offers">
            <div className="xl:container mx-auto px-4 flex flex-col gap-6 md:gap-10 lg:gap-16">
                {(title || description) && (
                    <div className="max-w-5xl">
                        {title && <h2>{title}</h2>}
                        {description && <RichTextComponent content={description} />}
                    </div>
                )}

                <div className="flex flex-col divide-y divide-gray-200">
                    {cards?.map((card, index) => (
                        <CardComponent
                            classNames={{ root: 'py-12 h-full w-full' }}
                            description={card.description}
                            image={card.imageCompressed}
                            index={index}
                            key={index}
                            linkTitle={card.linkTitle}
                            linkUrl={`/${locale}/${card?.slug}`}
                            title={card.title}
                            type={CardType.Image}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
