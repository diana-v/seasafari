import { SanityClient } from '@sanity/client';

export const fetchHomeSectionData = (client: SanityClient, locale?: string, defaultLocale?: string) =>
    client.fetch(
        `
    *[_type == "home"]{
        "sectionTitle": coalesce(sectionTitle.[$locale], sectionTitle.[$defaultLocale], "Missing translation"),
        "videoWebm": videoWebm.asset->url,
        "videoMp4": videoMp4.asset->url,
        "image": image.asset->url,
        "heroMedia": {
            "desktopContent": heroMedia.desktopContent,
            "mobileContent": heroMedia.mobileContent
        },
        "title": coalesce(title.[$locale], title.[$defaultLocale]),
    }[0]
`,
        { locale, defaultLocale }
    );
