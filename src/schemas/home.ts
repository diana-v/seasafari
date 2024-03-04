import { SanityClient } from '@sanity/client';

export const fetchHomeSectionData = (client: SanityClient, locale?: string, defaultLocale?: string) =>
    client.fetch(
        `
    *[_type == "home"]{
        "sectionTitle": coalesce(sectionTitle.[$locale], sectionTitle.[$defaultLocale], "Missing translation"),
        "videoWebm": videoWebm.asset->url,
        "videoMp4": videoMp4.asset->url,
        "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
    }[0]
`,
        { locale, defaultLocale }
    );
