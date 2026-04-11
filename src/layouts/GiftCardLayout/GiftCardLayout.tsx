import { TypedObject } from '@portabletext/types';
import * as React from 'react';

import { IconComponent } from '@/components/Icon/IconComponent';
import { RichTextComponent } from '@/components/RichText/RichTextComponent';
import { ImageContainer } from '@/containers/Image/ImageContainer';
import { GiftCardForm, type OptionType } from '@/forms/GiftCardForm';

export interface GiftcardProps {
    bullets?: { text: string }[];
    description?: TypedObject | TypedObject[];
    image?: string;
    options?: OptionType[];
    title?: string;
}

export const GiftCardLayout: React.FC<GiftcardProps> = ({ bullets, description, image, options, title }) => {
    if (!options?.length) return null;

    return (
        <div
            className="xl:container mx-auto px-4 my-12 md:my-20 lg:my-28 flex flex-col gap-10 relative"
            id="gift-cards"
        >
            <div className="flex flex-col max-w-5xl">
                {title && <h2>{title}</h2>}
                {description && <RichTextComponent content={description} />}

                {bullets && bullets.length > 0 && (
                    <div className="flex flex-col gap-3 mt-4">
                        {bullets.map((bullet, index) => (
                            <div className="flex items-center gap-3" key={index}>
                                <IconComponent
                                    className="h-8 w-8 rounded-full bg-blue-100 p-2 shadow-sm"
                                    name="check"
                                />
                                <p>{bullet.text}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex flex-col sm:flex-row w-full rounded-3xl shadow-xl bg-white overflow-hidden">
                {image && (
                    <div className="relative w-full sm:w-1/2 h-56 sm:h-auto">
                        <ImageContainer
                            alt={title}
                            classNames={{ image: 'object-cover w-full h-full', root: 'h-full' }}
                            height={580}
                            src={image}
                            width={752}
                        />
                    </div>
                )}

                <div className="flex flex-col justify-center p-6 md:p-8 w-full sm:w-1/2">
                    <GiftCardForm options={options} />
                </div>
            </div>

            <IconComponent
                className="hidden xl:block absolute -z-20 -top-48 -right-20 h-[720px] -rotate-12 text-[#f5f6ff]"
                name="propeller"
            />
        </div>
    );
};
