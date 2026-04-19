import { TypedObject } from '@portabletext/types';
import * as React from 'react';

import { RichTextComponent } from '@/components/RichText/RichTextComponent';
import { ImageContainer } from '@/containers/Image/ImageContainer';

export interface AboutProps {
    benefits?: {
        description?: TypedObject | TypedObject[];
        image?: string;
        title?: string;
    }[];
    description?: TypedObject | TypedObject[];
    image?: string;
    title?: string;
}

export const AboutLayout: React.FC<AboutProps> = ({ benefits, description, image, title }) => (
    <div className="xl:container mx-auto px-4 my-8 md:my-16 lg:my-24 flex flex-col xl:flex-row items-start gap-6 xl:gap-16">
        <div className="flex flex-col items-start w-full lg:basis-2/5 gap-2 xl:gap-14">
            {title && <h2>{title}</h2>}
            {image && (
                <div className="w-full h-56 md:h-72 lg:h-96 xl:h-auto xl:max-w-xl xl:aspect-square">
                    <ImageContainer
                        classNames={{ image: 'rounded-3xl shadow-sm object-cover w-full h-full', root: 'h-full' }}
                        height={600}
                        src={image}
                        width={600}
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
                            <div className="flex flex-col gap-4 items-start" key={index}>
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 shadow-md flex-shrink-0">
                                    {benefit.image && (
                                        <ImageContainer
                                            classNames={{
                                                image: 'block w-4.5 h-4.5 object-contain mx-auto',
                                                root: 'flex items-center justify-center w-full h-full',
                                            }}
                                            hasPlaceholder={false}
                                            height={16}
                                            src={benefit.image}
                                            width={16}
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
