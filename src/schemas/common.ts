import { TypedObject } from '@portabletext/types';
import { cache } from 'react';

import { client } from '@/lib/sanity';

export interface CommonSectionResponse {
    address: string;
    companyDetails: CompanyDetails;
    email: string;
    logo: string;
    phone: string;
    privacyPolicy: PrivacyPolicy;
    socialLinks: SocialLink[];
}

export interface CompanyDetails {
    address: string;
    companyCode: string;
    name: string;
}

export interface PrivacyPolicy {
    content: TypedObject | TypedObject[];
    slug: string;
}

export interface SocialLink {
    icon: string;
    link: string;
    platform: string;
}

export const fetchCommonData = cache(async (locale = 'lt', defaultLocale = 'lt'): Promise<CommonSectionResponse> => {
    console.log(`[Cache Miss] Fetching Common Data for: ${locale}`);

    return await client.fetch(
        `
    *[_type == "common"]{
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
          "content": coalesce(content.[$locale], content.[$defaultLocale], "Missing translation")
         }
    }[0]
`,
        { defaultLocale, locale },
        {
            next: {
                revalidate: 3600,
                tags: ['common']
            }
        }
    )
})
