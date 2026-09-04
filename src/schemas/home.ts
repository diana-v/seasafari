import { cache } from 'react';

import { client } from '@/lib/sanity';

export interface HeroMedia {
    desktopContent?: 'image' | 'video' | undefined;
    mobileContent?: 'image' | 'video' | undefined;
}

export interface HomeCTA {
    label: string;
    link: string;
}

export interface HomeSectionResponse {
    cta?: HomeCTA;
    ctaSecondary?: HomeCTA;
    heroMedia?: HeroMedia;
    image?: string;
    subtitle?: string;
    title: string;
}

export const fetchHomeSectionData = cache(async (locale = 'lt', defaultLocale = 'lt'): Promise<HomeSectionResponse> => {

    return await client.fetch(
        `
    *[_type == "home"]{
        "image": image.asset->url,
        "heroMedia": {
            "desktopContent": heroMedia.desktopContent,
            "mobileContent": heroMedia.mobileContent
        },
        "title": coalesce(title.[$locale], title.[$defaultLocale]),
        "subtitle": coalesce(subtitle.[$locale], subtitle.[$defaultLocale]),
        "cta": {
            "link": coalesce(cta.link.[$locale], cta.link.[$defaultLocale]),
            "label": coalesce(cta.label.[$locale], cta.label.[$defaultLocale]),
        },
        "ctaSecondary": {
            "link": coalesce(ctaSecondary.link.[$locale], ctaSecondary.link.[$defaultLocale]),
            "label": coalesce(ctaSecondary.label.[$locale], ctaSecondary.label.[$defaultLocale]),
        }
    }[0]
`,
        { defaultLocale, locale },
        {
            next: {
                revalidate: 604_800,
                tags: ['home']
            }
        }
    )
})
