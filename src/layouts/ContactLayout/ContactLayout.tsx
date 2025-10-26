import * as React from 'react';
import { TypedObject } from '@portabletext/types';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { RichTextComponent } from '@/components/RichText/RichTextComponent';
import ContactForm from '@/forms/ContactForm';
import { IconComponent } from '@/components/Icon/IconComponent';
import { languages, LocaleType } from '@/translations/navigation';

export interface ContactProps {
    title?: string;
    description?: TypedObject | TypedObject[];
    phone?: string;
    formTitle?: string;
}

export const ContactLayout: React.FC<ContactProps> = ({ title, description, phone, formTitle }) => {
    const { locale, defaultLocale } = useRouter();
    const localisedString = languages[(locale ?? defaultLocale) as LocaleType];

    return (
        <div className="relative">
            <div className="absolute bottom-0 left-0 w-full h-[60%] bg-blue-50" />

            <div className="relative xl:container mx-auto lg:px-4 pt-16 md:pt-24 lg:pt-32">
                <div className="shadow-2xl lg:shadow-none grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                    <div className="hidden lg:flex flex-col gap-2 md:gap-4 self-end pb-24">
                        <div>
                            {title && <h3 className="text-slate-800">{title}</h3>}
                            {description && (
                                <div className="text-slate-600 text-lg max-w-md">
                                    <RichTextComponent content={description} />
                                </div>
                            )}
                        </div>
                        <Link
                            href={`tel:${phone}`}
                            className="flex items-center gap-2 px-6 py-3 border border-blue-900 rounded-full text-blue-900 hover:bg-blue-900 hover:text-white transition-colors duration-200 w-fit"
                        >
                            {localisedString.contactUs}
                            <IconComponent name="arrowRightUp" className="h-2.5 w-3" />
                        </Link>
                    </div>

                    <div className="w-full lg:max-w-lg lg:mx-auto">
                        <div className="bg-white p-8 md:p-10 rounded-t-3xl shadow-2xl flex flex-col gap-6">
                            <h2 className="capitalize text-slate-800">{formTitle}</h2>
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
