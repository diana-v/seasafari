import * as React from 'react';
import { TypedObject } from '@portabletext/types';

import { ImageContainer } from '@/containers/Image/ImageContainer';
import { RichTextComponent } from '@/components/RichText/RichTextComponent';

export interface AboutProps {
    sectionTitle?: string;
    image?: string;
    description?: TypedObject | TypedObject[];
}

export const AboutLayout: React.FC<AboutProps> = ({ sectionTitle, image, description }) => (
    <div
        id={sectionTitle?.toLowerCase()}
        className="container mx-auto px-4 my-8 md:my-16 lg:my-24 flex flex-wrap flex-col lg:flex-row items-center gap-6 md:gap-10 lg:gap-16"
    >
        <div className="basis-1 flex-grow w-full">
            {image && (
                <ImageContainer
                    src={image}
                    width={750}
                    height={550}
                    className="rounded object-cover flex-grow h-96 lg:h-auto"
                />
            )}
        </div>
        <div className="basis-1 flex-grow w-full">{description && <RichTextComponent content={description} />}</div>
    </div>
);
