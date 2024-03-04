import { SanityClient } from '@sanity/client';

export const fetchHeaderData = (client: SanityClient, locale?: string, defaultLocale?: string) =>
    client.fetch(
        `
    *[_type == "navigation"]{
        "logo": logo.asset->url,
        "sections": sections[] {
            "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
        },
    }[0]
`,
        { locale, defaultLocale }
    );
