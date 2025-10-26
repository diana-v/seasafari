import { SanityClient } from '@sanity/client';

export const fetchContactSectionData = (client: SanityClient, locale?: string, defaultLocale?: string) =>
    client.fetch(
        `
    *[_type == "contact"]{
        "title": coalesce(title.[$locale], title.[$defaultLocale]),
        "description": coalesce(description.[$locale], description.[$defaultLocale]),
        "formTitle": coalesce(formTitle.[$locale], formTitle.[$defaultLocale]),
        "phone": *[_type == "common"].phone
    }[0]
`,
        { locale, defaultLocale }
    );
