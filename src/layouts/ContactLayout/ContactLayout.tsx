import * as React from 'react';
import { TypedObject } from '@portabletext/types';

import { ImageContainer } from '@/containers/Image/ImageContainer';
import { RichTextComponent } from '@/components/RichText/RichTextComponent';
import ContactForm from '@/forms/ContactForm';

export interface ContactProps {
    sectionTitle?: string;
    title?: string;
    description?: TypedObject | TypedObject[];
    backgroundImage?: string;
}

export const ContactLayout: React.FC<ContactProps> = ({ sectionTitle, title, description, backgroundImage }) => (
    <div id={sectionTitle?.toLowerCase()} className="relative h-screen">
        <ImageContainer src={backgroundImage} width={1264} height={500} className="object-cover w-full h-screen" />
        <div className="w-4/5 md:w-3/4 lg:w-3/5 max-w-3xl rounded absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 px-6 pb-8 py-8 md:pt-12 lg:pt-16 bg-white flex flex-col flex-grow gap-4 items-center shadow-xl divide-y">
            <div className="max-w-lg text-center">
                {title && <h1 className="uppercase">{title}</h1>}
                {description && <RichTextComponent content={description} />}
            </div>
            <div className="w-full divide-y">
                <div className="py-8 md:px-4 flex-grow">
                    <ContactForm />
                </div>
            </div>
        </div>
    </div>
);
