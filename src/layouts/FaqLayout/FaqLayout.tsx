import { TypedObject } from '@portabletext/types';
import * as React from 'react';

import { AccordionComponent } from '@/components/Accordion/AccordionComponent';
import { RichTextComponent } from '@/components/RichText/RichTextComponent';

export interface FaqProps {
    description?: TypedObject | TypedObject[];
    faq?: FaqType[];
    seoDescription?: string;
    title?: string;
}

interface FaqType {
    content: TypedObject | TypedObject[];
    title: string;
}

export const FaqLayout: React.FC<FaqProps> = ({ description, faq, title }) => {
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
