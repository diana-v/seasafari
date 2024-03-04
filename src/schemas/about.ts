import { SanityClient } from '@sanity/client';

export const fetchAboutSectionData = (client: SanityClient, locale?: string, defaultLocale?: string) =>
    client.fetch(
        `
    *[_type == "about"]{
        "sectionTitle": coalesce(sectionTitle.[$locale], sectionTitle.[$defaultLocale], "Missing translation"),
        "image": image.asset->url,
        "description": coalesce(description.[$locale], description.[$defaultLocale], "Missing translation")
    }[0]
`,
        { locale, defaultLocale }
    );
