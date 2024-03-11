import * as React from 'react';
import { TypedObject } from '@portabletext/types';

import { RichTextComponent } from '@/components/RichText/RichTextComponent';
import { AccordionComponent } from '@/components/Accordion/AccordionComponent';

type FAQType = {
    title: string;
    content: TypedObject | TypedObject[];
};

export interface FAQProps {
    sectionTitle?: string;
    title?: string;
    description?: TypedObject | TypedObject[];
    faq?: FAQType[];
}

export const FAQLayout: React.FC<FAQProps> = ({ sectionTitle, title, description, faq }) => {
    if (!faq?.length) {
        return null;
    }

    return (
        <div id={sectionTitle?.toLowerCase()} className="bg-grey-50 py-8 md:py-16 lg:py-24">
            <div className="container mx-auto px-4 flex flex-col items-center flex flex-col gap-6 md:gap-10 lg:gap-16">
                {(title || description) && (
                    <div className="max-w-5xl text-center">
                        {title && <h1 className="uppercase">{title}</h1>}
                        {description && <RichTextComponent content={description} />}
                    </div>
                )}
                {faq.length > 0 && <AccordionComponent items={faq} />}
            </div>
        </div>
    );
};
