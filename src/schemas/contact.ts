import { SanityClient } from '@sanity/client';

export const fetchContactSectionData = (client: SanityClient, locale?: string, defaultLocale?: string) =>
    client.fetch(
        `
    *[_type == "contact"]{
        "sectionTitle": coalesce(sectionTitle.[$locale], sectionTitle.[$defaultLocale], "Missing translation"),
        "backgroundImage": backgroundImage.asset->url,
        "title": coalesce(title.[$locale], title.[$defaultLocale]),
        "description": coalesce(description.[$locale], description.[$defaultLocale])
    }[0]
`,
        { locale, defaultLocale }
    );
