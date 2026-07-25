'use cache';
import { cacheLife, cacheTag } from 'next/cache';

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

export async function fetchBlogsSectionData(locale = 'lt', defaultLocale = 'lt'): Promise<BlogsSectionResponse> {
    cacheTag('blogs');
    cacheLife('weeks');

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
        { defaultLocale, locale }
    )
}
