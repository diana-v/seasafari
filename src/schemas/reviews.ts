import { SanityClient } from '@sanity/client';

export const fetchReviewsSectionData = (client: SanityClient, locale?: string, defaultLocale?: string) =>
    client.fetch(
        `
    *[_type == "reviews"]{
        "title": coalesce(title.[$locale], title.[$defaultLocale]),
    }[0]
`,
        { locale, defaultLocale }
    );
