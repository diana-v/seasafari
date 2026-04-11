import { SanityClient } from '@sanity/client';

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

export const fetchHomeSectionData = (
    client: SanityClient,
    locale = 'lt',
    defaultLocale = 'lt'
): Promise<HomeSectionResponse> =>
    client.fetch(
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
    );
