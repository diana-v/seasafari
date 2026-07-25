'use cache';
import { cacheLife, cacheTag } from 'next/cache';

import { client } from '@/lib/sanity';

export interface FooterCommon {
    address: string;
    companyDetails: {
        address: string;
        companyCode: string;
        name: string;
    };
    email: string;
    logo: string;
    phone: string;
    privacyPolicy: {
        slug: string;
    };
    purchaseRules: {
        slug: string;
    };
    socialLinks: {
        icon: string;
        link: string;
        platform: string;
    }[];
}

export interface FooterFAQ {
    title: string;
}

export interface FooterSectionResponse {
    common: FooterCommon;
    faq: FooterFAQ;
}

export async function fetchFooterSectionData(locale = 'lt', defaultLocale = 'lt'): Promise<FooterSectionResponse> {
    cacheTag('footer', 'common', 'faq');
    cacheLife('weeks');

    return await client.fetch(
        `
    *[_type == "footer"] {
      "common": *[_type == "common"] {
        "logo": logo.asset->url,
        phone,
        email,
        "address": coalesce(address.[$locale], address.[$defaultLocale], "Missing translation"),
        "companyDetails": companyDetails {
          name,
          "companyCode": coalesce(companyCode.[$locale], companyCode.[$defaultLocale], "Missing translation"),
          "address": coalesce(address.[$locale], address.[$defaultLocale], "Missing translation")
        },
        "socialLinks": socialLinks[] {
          "platform": coalesce(platform.[$locale], platform.[$defaultLocale], "Missing translation"),
          "link": coalesce(link.[$locale], link.[$defaultLocale], "Missing translation"),
          "icon": icon.asset->url
        },
        "privacyPolicy": privacyPolicy {
          "slug": slug.current,
        },
        "purchaseRules": purchaseRules {
          "slug": slug.current,
        }
      }[0],
      "faq": *[_type == "faq"] {
        "title": coalesce(title.[$locale], title.[$defaultLocale]),
      }[0],
    }[0]
`,
        { defaultLocale, locale }
    )
}
