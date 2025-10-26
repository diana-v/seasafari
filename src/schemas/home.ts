import { SanityClient } from '@sanity/client';

export const fetchHomeSectionData = (client: SanityClient, locale?: string, defaultLocale?: string) =>
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
        { locale, defaultLocale }
    );
