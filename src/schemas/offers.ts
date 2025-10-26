import { SanityClient } from '@sanity/client';

export const fetchOffersSectionData = (client: SanityClient, locale?: string, defaultLocale?: string) =>
    client.fetch(
        `
    *[_type == "offers"] {
        "title": coalesce(title.[$locale], title.[$defaultLocale]),
        "description": coalesce(description.[$locale], description.[$defaultLocale]),
        "cards": *[_type == "offer"] {
            "slug": slug.current,
            "imageCompressed": imageCompressed.asset->url,
            "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
            "description": coalesce(description.[$locale], description.[$defaultLocale], "Missing translation"),
            "linkTitle": coalesce(linkTitle.[$locale], linkTitle.[$defaultLocale], "Missing translation"),
            orderRank,
        } | order(orderRank)
    }[0]
`,
        { locale, defaultLocale }
    );
