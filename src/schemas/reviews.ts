'use cache';
import { cacheLife, cacheTag } from 'next/cache';

import { client } from '@/lib/sanity';

export interface ReviewsSectionResponse {
    title: string;
}

export async function fetchReviewsSectionData(locale = 'lt', defaultLocale = 'lt'): Promise<ReviewsSectionResponse> {
    cacheTag('reviews');
    cacheLife('weeks');

    return await client.fetch(
        `
    *[_type == "reviews"]{
        "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
    }[0]
`,
        { defaultLocale, locale }
    )
}
