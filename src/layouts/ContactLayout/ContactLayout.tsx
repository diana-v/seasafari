import * as React from 'react';
import { TypedObject } from '@portabletext/types';
import Link from 'next/link';

import { ImageContainer } from '@/containers/Image/ImageContainer';
import { RichTextComponent } from '@/components/RichText/RichTextComponent';
import ContactForm from '@/forms/ContactForm';

type ContactType = {
    title?: string;
    value?: string;
};

export interface ContactProps {
    sectionTitle?: string;
    title?: string;
    description?: TypedObject | TypedObject[];
    socialLinks?: {
        platform?: string;
        link?: string;
        icon?: string;
    }[];
    address?: ContactType;
    email?: ContactType;
    phone?: ContactType;
    backgroundImage?: string;
}

export const ContactLayout: React.FC<ContactProps> = ({
    sectionTitle,
    title,
    description,
    socialLinks,
    address,
    email,
    phone,
    backgroundImage,
}) => (
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
                <div className="pt-8 flex flex-col md:flex-row flex-wrap flex-grow justify-between gap-4 break-all">
                    {address?.title && address.value && (
                        <div>
                            <p className="m-0 font-bold">{address?.title}</p>
                            <p>{address?.value}</p>
                        </div>
                    )}
                    {email?.title && email.value && (
                        <div>
                            <p className="m-0 font-bold">{email?.title}</p>
                            <Link className="underline underline-offset-4" href={`mailto:${email.value}`}>
                                {email?.value}
                            </Link>
                        </div>
                    )}
                    {phone?.title && phone.value && (
                        <div>
                            <p className="m-0 font-bold">{phone?.title}</p>
                            <Link href={`tel:${phone.value}`}>{phone?.value}</Link>
                        </div>
                    )}
                    <div className="flex flex-wrap w-full md:justify-around gap-4">
                        {socialLinks &&
                            socialLinks?.map((socialLink, index) => (
                                <a
                                    key={index}
                                    className="flex flex-row items-center gap-2 text-red-900"
                                    target="_blank"
                                    href={socialLink.link}
                                    rel="noreferrer"
                                >
                                    {socialLink.icon && (
                                        <ImageContainer
                                            src={socialLink.icon}
                                            width={40}
                                            height={40}
                                            className="w-6 h-6"
                                        />
                                    )}
                                    <p className="m-0">{socialLink.platform}</p>
                                </a>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);
