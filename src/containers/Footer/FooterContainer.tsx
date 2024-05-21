import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { TypedObject } from '@portabletext/types/src';

import { ImageContainer } from '@/containers/Image/ImageContainer';
import { IconComponent } from '@/components/Icon/IconComponent';

export type ItemType = {
    label: string;
    slug: string;
    content?: TypedObject | TypedObject[];
};

type ContactType = {
    title?: string;
    value?: string;
};

type CompanyContactType = {
    title?: string;
    name?: string;
    companyCode?: string;
    address?: string;
};

export interface FooterProps {
    items: ItemType[];
    contact: {
        socialLinks?: {
            platform?: string;
            link?: string;
            icon?: string;
        }[];
        address?: ContactType;
        email?: ContactType;
        phone?: ContactType;
        companyDetails?: CompanyContactType;
    };
}

export const FooterContainer: React.FC<FooterProps> = ({ items, contact }) => {
    const { locale } = useRouter();

    if (!items || !contact) {
        return null;
    }

    const { address, phone, email, companyDetails, socialLinks } = contact;

    return (
        <div className="w-full bg-black text-white flex flex-col divide-y">
            <div className="flex flex-col sm:flex-row flex-grow flex-wrap justify-between sm:items-center p-4 gap-4">
                <div className="font-bold">© Copyright {new Date().getFullYear()} SeaSafari</div>
                <div className="flex flex-wrap sm:divide-x gap-y-4">
                    {items?.map(
                        (item, index) =>
                            item.content && (
                                <p key={index} className="!mb-0">
                                    <Link
                                        href={{
                                            pathname: '/[locale]/c/[contentId]',
                                            query: { contentId: item.slug, locale },
                                        }}
                                        className="px-4 underline underline-offset-4"
                                    >
                                        {item.label}
                                    </Link>
                                </p>
                            )
                    )}
                </div>
            </div>
            <div className="p-4 flex flex-col sm:flex-row flex-wrap justify-between gap-4">
                <div>
                    <p className="flex gap-2">
                        <IconComponent className="w-6 h-6" name="pin" />
                        {address?.value}
                    </p>
                    <p className="flex gap-2">
                        <IconComponent className="w-6 h-6" name="email" />
                        <a href={`mailto:${email?.value}`}>{email?.value}</a>
                    </p>
                    <p className="flex gap-2">
                        <IconComponent className="w-6 h-6" name="phone" />
                        <a href={`tel:${phone?.value}`}>{phone?.value}</a>
                    </p>
                </div>

                {companyDetails?.title && (
                    <div>
                        <p className="m-0 font-bold">{companyDetails?.title}</p>
                        <p>{companyDetails?.name}</p>
                        <p>{companyDetails?.companyCode}</p>
                        <p>{companyDetails?.address}</p>
                    </div>
                )}
                <div className="flex flex-col gap-4 justify-center flex-wrap">
                    {socialLinks &&
                        socialLinks?.map((socialLink, index) => (
                            <a
                                key={index}
                                className="flex flex-row items-center px-4 gap-2 underline underline-offset-4"
                                target="_blank"
                                href={socialLink.link}
                                rel="noreferrer"
                            >
                                {socialLink.icon && (
                                    <ImageContainer src={socialLink.icon} width={40} height={40} className="w-6 h-6" />
                                )}
                                <p className="m-0">{socialLink.platform}</p>
                            </a>
                        ))}
                </div>
            </div>
        </div>
    );
};
