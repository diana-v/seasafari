'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import * as React from 'react';

import type { FaqProps } from '@/layouts/FaqLayout/FaqLayout';

import { IconComponent } from '@/components/Icon/IconComponent';
import { ImageContainer } from '@/containers/Image/ImageContainer';
import { languages as languagesCommon, LocaleType as LocaleTypeCommon } from '@/translations/common';
import { languages as languagesFooter, LocaleType as LocaleTypeFooter } from '@/translations/footer';

export interface FooterProps {
    common?: {
        address?: string;
        companyDetails?: CompanyContactType;
        email?: string;
        logo?: string;
        phone?: string;
        privacyPolicy?: { slug: string };
        purchaseRules?: { slug: string };
        socialLinks?: SocialLinkType[];
    };
    faq?: FaqProps;
}

interface CompanyContactType {
    address?: string;
    companyCode?: string;
    name?: string;
}

interface SocialLinkType {
    icon?: string;
    link?: string;
    platform?: string;
}

export const FooterContainer: React.FC<FooterProps> = ({ common, faq }) => {
    const params = useParams();
    const locale = params.locale as string;
    const defaultLocale = 'lt';
    const localisedStringCommon = languagesCommon[(locale ?? defaultLocale) as LocaleTypeCommon];
    const localisedStringFooter = languagesFooter[(locale ?? defaultLocale) as LocaleTypeFooter];

    if (!common || !faq) {
        return null;
    }

    const { address, companyDetails, email, logo, phone, privacyPolicy, purchaseRules, socialLinks } = common;

    return (
        <footer className="w-full bg-slate-900 text-slate-300">
            <div className="xl:container mx-auto px-4 md:px-8">
                <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    <div className="flex flex-col gap-4 pr-8">
                        {logo ? (
                            <ImageContainer
                                classNames={{ image: 'w-[100px] h-[50px]', root: 'h-full' }}
                                height={50}
                                src={logo}
                                width={100}
                            />
                        ) : (
                            <h3 className="text-2xl font-bold text-white">{localisedStringFooter.title}</h3>
                        )}
                        <p className="text-slate-400">{localisedStringFooter.cta}</p>
                        <div className="flex gap-3 mt-4">
                            {socialLinks?.map((social, index) => (
                                <a
                                    aria-label={social.platform}
                                    className="w-10 h-10 bg-slate-800 hover:bg-blue-900 rounded-full flex items-center justify-center transition-colors"
                                    href={social.link}
                                    key={index}
                                    rel="noreferrer"
                                    target="_blank"
                                >
                                    {social.icon && (
                                        <ImageContainer
                                            classNames={{ image: 'w-5 h-5', root: 'w-5 h-5' }}
                                            height={20}
                                            src={social.icon}
                                            width={20}
                                        />
                                    )}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="font-semibold text-white">{localisedStringFooter.quickLinks}</div>
                        <ul className="space-y-2 !ml-0 !list-none">
                            <li>
                                <Link
                                    aria-label={localisedStringCommon.privacyPolicy}
                                    className="hover:text-white transition-colors"
                                    href={`/${locale}/c/${privacyPolicy?.slug}`}
                                    scroll={true}
                                >
                                    {localisedStringCommon.privacyPolicy}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    aria-label={localisedStringCommon.purchaseRules}
                                    className="hover:text-white transition-colors"
                                    href={`/${locale}/c/${purchaseRules?.slug}`}
                                    scroll={true}
                                >
                                    {localisedStringCommon.purchaseRules}
                                </Link>
                            </li>
                            {faq?.title && (
                                <li>
                                    <Link
                                        aria-label={faq.title}
                                        className="hover:text-white transition-colors"
                                        href={`/${locale}/faq`}
                                        scroll={true}
                                    >
                                        {faq.title}
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="font-semibold text-white">{localisedStringFooter.contactUs}</div>
                        <ul className="space-y-3 !ml-0">
                            <li className="flex items-center gap-3">
                                <IconComponent className="w-5 h-5 shrink-0 text-slate-400" name="pin" />
                                <p className="mb-0">{address}</p>
                            </li>
                            <li className="flex items-center gap-3">
                                <IconComponent className="w-5 h-5 shrink-0 text-slate-400" name="email" />
                                <a
                                    aria-label={email}
                                    className="hover:text-white transition-colors"
                                    href={`mailto:${email}`}
                                >
                                    {email}
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <IconComponent className="w-5 h-5 shrink-0 text-slate-400" name="phone" />
                                <a
                                    aria-label={phone}
                                    className="hover:text-white transition-colors"
                                    href={`tel:${phone}`}
                                >
                                    {phone}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {companyDetails && (
                        <div className="flex flex-col gap-4">
                            <div className="font-semibold text-white">{localisedStringCommon.companyDetails}</div>
                            <div className="text-slate-400 space-y-1">
                                <p>{companyDetails.name}</p>
                                <p>{companyDetails.companyCode}</p>
                                <p>{companyDetails.address}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="py-6 border-t border-slate-800 text-center sm:text-left">
                    <p className="text-sm text-slate-500">© Copyright {new Date().getFullYear()} SeaSafari</p>
                </div>
            </div>
        </footer>
    );
};
