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
    heroMedia?: HeroMedia;
    image?: string;
    subtitle?: string;
    title: string;
    videoMp4?: string;
    videoWebm?: string;
}

export const fetchHomeSectionData = cache(async (locale = 'lt', defaultLocale = 'lt'): Promise<HomeSectionResponse> => {
    console.log(`[Cache Miss] Fetching Home Data for: ${locale}`);

    return await client.fetch(
        `
    *[_type == "home"]{
        "videoWebm": videoWebm.asset->url,
        "videoMp4": videoMp4.asset->url,
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
        }
    }[0]
`,
        { defaultLocale, locale },
        {
            next: {
                revalidate: 600,
                tags: ['home']
            }
        }
    )
})
