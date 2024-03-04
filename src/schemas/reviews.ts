import { SanityClient } from '@sanity/client';

export const fetchReviewsSectionData = (client: SanityClient, locale?: string, defaultLocale?: string) =>
    client.fetch(
        `
    *[_type == "reviews"]{
        "sectionTitle": coalesce(sectionTitle.[$locale], sectionTitle.[$defaultLocale], "Missing translation"),
        "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
        "cards": cards[] {
            "name": coalesce(name.[$locale], name.[$defaultLocale], "Missing translation"),
            "review": coalesce(review.[$locale], review.[$defaultLocale], "Missing translation"),
            "image": image.asset->url,
        },
    }[0]
`,
        { locale, defaultLocale }
    );
