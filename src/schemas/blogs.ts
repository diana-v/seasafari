import { cache } from 'react';

import { client } from '@/lib/sanity';

export interface BlogCardResponse {
    _createdAt: string;
    backgroundColor?: string;
    description: string;
    image: string;
    orderRank?: number;
    slug: string;
    title: string;
}

export interface BlogsSectionResponse {
    cards: BlogCardResponse[];
    description: string;
    slug: string;
    title: string;
}

export const fetchBlogsSectionData = cache(async (locale = 'lt', defaultLocale = 'lt'): Promise<BlogsSectionResponse> => {
    console.log(`[Cache Miss] Fetching Blogs Data for: ${locale}`);

    return await client.fetch(
        `
    *[_type == "blogs"] {
        "slug": slug.current,
        "title": coalesce(title.[$locale], title.[$defaultLocale]),
        "description": coalesce(description.[$locale], description.[$defaultLocale]),
        "cards": *[_type == "blog"] {
            "slug": slug.current,
            "image": image.asset->url,
            "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
            "description": coalesce(description.[$locale], description.[$defaultLocale], "Missing translation"),
            backgroundColor,
            _createdAt,
            orderRank,
        } | order(orderRank)
    }[0]
`,
        { defaultLocale, locale },
        {
            next: {
                revalidate: 60,
                tags: ['blogs']
            }
        }
    )
})
