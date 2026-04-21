import { SanityClient } from '@sanity/client';

export interface ReviewsSectionResponse {
    title: string;
}

export const fetchReviewsSectionData = (
    client: SanityClient,
    locale = 'lt',
    defaultLocale = 'lt'
): Promise<ReviewsSectionResponse> =>
    client.fetch(
        `
    *[_type == "reviews"]{
        "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
    }[0]
`,
        { defaultLocale, locale },
        {
            next: {
                revalidate: 3600,
                tags: ['reviews']
            }
        }
    );
