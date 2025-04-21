import { SanityClient } from '@sanity/client';

export const fetchBlogsSectionData = (client: SanityClient, locale?: string, defaultLocale?: string) =>
    client.fetch(
        `
    *[_type == "blogs"] {
        "slug": slug.current,
        "sectionTitle": coalesce(sectionTitle.[$locale], sectionTitle.[$defaultLocale], "Missing translation"),
        "title": coalesce(title.[$locale], title.[$defaultLocale]),
        "description": coalesce(description.[$locale], description.[$defaultLocale]),
        "cards": *[_type == "blog"] {
            "slug": slug.current,
            "image": image.asset->url,
            "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
            "description": coalesce(description.[$locale], description.[$defaultLocale], "Missing translation"),
            _createdAt,
            orderRank,
        } | order(orderRank)
    }[0]
`,
        { locale, defaultLocale }
    );
