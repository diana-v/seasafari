import { cache } from 'react';

import { client } from '@/lib/sanity';

export interface ReviewsSectionResponse {
    title: string;
}

export const fetchReviewsSectionData = cache(async (locale = 'lt', defaultLocale = 'lt'): Promise<ReviewsSectionResponse> => {
    console.log(`[Cache Miss] Fetching Reviews Data for: ${locale}`);

    return await client.fetch(
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
    )
})
