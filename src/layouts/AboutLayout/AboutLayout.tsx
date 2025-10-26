import * as React from 'react';
import { TypedObject } from '@portabletext/types';

import { ImageContainer } from '@/containers/Image/ImageContainer';
import { RichTextComponent } from '@/components/RichText/RichTextComponent';

export interface AboutProps {
    image?: string;
    title?: string;
    description?: TypedObject | TypedObject[];
    benefits?: {
        image?: string;
        title?: string;
        description?: TypedObject | TypedObject[];
    }[];
}

export const AboutLayout: React.FC<AboutProps> = ({ title, image, description, benefits }) => (
    <div className="xl:container mx-auto px-4 my-8 md:my-16 lg:my-24 flex flex-col xl:flex-row items-start gap-6 xl:gap-16">
        <div className="flex flex-col items-start w-full lg:basis-2/5 gap-2 xl:gap-14">
            {title && <h2>{title}</h2>}
            {image && (
                <div className="w-full h-56 md:h-72 lg:h-96 xl:h-auto xl:max-w-xl xl:aspect-square">
                    <ImageContainer
                        src={image}
                        width={600}
                        height={600}
                        classNames={{ root: 'h-full', image: 'rounded-3xl shadow-sm object-cover w-full h-full' }}
                    />
                </div>
            )}
        </div>

        <div className="flex-grow lg:basis-3/5">
            <div className="flex flex-col gap-6 lg:gap-8">
                {description && <RichTextComponent content={description} />}

                {benefits && benefits.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 md:gap-y-6 md:gap-x-10">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="flex flex-col gap-4 items-start">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 shadow-md">
                                    {benefit.image && (
                                        <ImageContainer
                                            src={benefit.image}
                                            width={16}
                                            height={16}
                                            classNames={{ root: 'min-h-full h-full' }}
                                        />
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    {benefit.title && <div className="text-lg font-bold">{benefit.title}</div>}
                                    {benefit.description && <RichTextComponent content={benefit.description} />}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>
);
