import * as React from 'react';
import { TypedObject } from '@portabletext/types';

import { RichTextComponent } from '@/components/RichText/RichTextComponent';
import { AccordionComponent } from '@/components/Accordion/AccordionComponent';

type FAQType = {
    title: string;
    content: TypedObject | TypedObject[];
};

export interface FAQProps {
    title?: string;
    seoDescription?: string;
    description?: TypedObject | TypedObject[];
    faq?: FAQType[];
}

export const FAQLayout: React.FC<FAQProps> = ({ title, description, faq }) => {
    if (!faq?.length) {
        return null;
    }

    return (
        <div className="xl:container mx-auto px-4 flex flex-col gap-6 md:gap-10 lg:gap-16">
            {(title || description) && (
                <div className="max-w-5xl">
                    {title && <h2 className="uppercase">{title}</h2>}
                    {description && <RichTextComponent content={description} />}
                </div>
            )}
            {faq.length > 0 && <AccordionComponent items={faq} />}
        </div>
    );
};
