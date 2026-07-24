'use cache';
import { TypedObject } from '@portabletext/types';
import { cacheLife, cacheTag } from 'next/cache';

import { client } from '@/lib/sanity';

export interface BlogSectionResponse {
    _createdAt: string;
    backgroundColor?: string;
    content: TypedObject | TypedObject[];
    description: string;
    image: string;
    slug: string;
    title: string;
}

export async function fetchBlogSectionData(blogId: string | string[], locale = 'lt', defaultLocale = 'lt'): Promise<BlogSectionResponse> {
    cacheTag('blog', typeof blogId === 'string' ? blogId : 'list');
    cacheLife('weeks');

    return await client.fetch(
        `
    *[_type == "blog" && slug.current == $blogId]{
        "slug": slug.current,
        "image": image.asset->url,
        "title": coalesce(title.[$locale], title.[$defaultLocale]),
        "description": coalesce(description.[$locale], description.[$defaultLocale]),
        "content": coalesce(content.[$locale], content.[$defaultLocale], "Missing translation"),
        backgroundColor,
        _createdAt
    }[0]
`,
        { blogId, defaultLocale, locale }
    )
}
