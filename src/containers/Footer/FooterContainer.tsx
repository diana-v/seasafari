import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { ImageContainer } from '@/containers/Image/ImageContainer';
import { IconComponent } from '@/components/Icon/IconComponent';
import { FAQProps } from '@/layouts/FAQLayout/FAQLayout';
import { languages as languagesCommon, LocaleType as LocaleTypeCommon } from '@/translations/common';
import { languages as languagesFooter, LocaleType as LocaleTypeFooter } from '@/translations/footer';

type CompanyContactType = {
    name?: string;
    companyCode?: string;
    address?: string;
};

type SocialLinkType = {
    platform?: string;
    link?: string;
    icon?: string;
};

export interface FooterProps {
    faq?: FAQProps;
    common?: {
        logo?: string;
        phone?: string;
        address?: string;
        email?: string;
        companyDetails?: CompanyContactType;
        socialLinks?: SocialLinkType[];
        privacyPolicy?: { slug: string };
        purchaseRules?: { slug: string };
    };
}

export const FooterContainer: React.FC<FooterProps> = ({ faq, common }) => {
    const { locale, defaultLocale } = useRouter();
    const localisedStringCommon = languagesCommon[(locale ?? defaultLocale) as LocaleTypeCommon];
    const localisedStringFooter = languagesFooter[(locale ?? defaultLocale) as LocaleTypeFooter];

    if (!common || !faq) {
        return null;
    }

    const { logo, phone, address, email, companyDetails, socialLinks, privacyPolicy, purchaseRules } = common;

    return (
        <footer className="w-full bg-slate-900 text-slate-300">
            <div className="xl:container mx-auto px-4 md:px-8">
                <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    <div className="flex flex-col gap-4 pr-8">
                        {logo ? (
                            <ImageContainer
                                src={logo}
                                width={100}
                                height={50}
                                classNames={{ root: 'h-full', image: 'w-[100px] h-[50px]' }}
                            />
                        ) : (
                            <h3 className="text-2xl font-bold text-white">{localisedStringFooter.title}</h3>
                        )}
                        <p className="text-slate-400">{localisedStringFooter.cta}</p>
                        <div className="flex gap-3 mt-4">
                            {socialLinks?.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-10 h-10 bg-slate-800 hover:bg-blue-900 rounded-full flex items-center justify-center transition-colors"
                                    aria-label={social.platform}
                                >
                                    {social.icon && (
                                        <ImageContainer
                                            src={social.icon}
                                            width={20}
                                            height={20}
                                            classNames={{ root: 'w-5 h-5', image: 'w-5 h-5' }}
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
                                    href={{
                                        pathname: '/[locale]/c/[contentId]',
                                        query: { contentId: privacyPolicy?.slug, locale },
                                    }}
                                    aria-label={localisedStringCommon.privacyPolicy}
                                    scroll={true}
                                    className="hover:text-white transition-colors"
                                >
                                    {localisedStringCommon.privacyPolicy}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={{
                                        pathname: '/[locale]/c/[contentId]',
                                        query: { contentId: purchaseRules?.slug, locale },
                                    }}
                                    aria-label={localisedStringCommon.purchaseRules}
                                    scroll={true}
                                    className="hover:text-white transition-colors"
                                >
                                    {localisedStringCommon.purchaseRules}
                                </Link>
                            </li>
                            {faq?.title && (
                                <li>
                                    <Link
                                        href={{ pathname: '/[locale]/faq', query: { locale } }}
                                        aria-label={faq.title}
                                        scroll={true}
                                        className="hover:text-white transition-colors"
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
                                <p>{address}</p>
                            </li>
                            <li className="flex items-center gap-3">
                                <IconComponent className="w-5 h-5 shrink-0 text-slate-400" name="email" />
                                <a
                                    href={`mailto:${email}`}
                                    aria-label={email}
                                    className="hover:text-white transition-colors"
                                >
                                    {email}
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <IconComponent className="w-5 h-5 shrink-0 text-slate-400" name="phone" />
                                <a
                                    href={`tel:${phone}`}
                                    aria-label={phone}
                                    className="hover:text-white transition-colors"
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
