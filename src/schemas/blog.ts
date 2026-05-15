import { TypedObject } from '@portabletext/types';
import { cache } from 'react';

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

export const fetchBlogSectionData = cache(async (blogId: string | string[], locale = 'lt', defaultLocale = 'lt'): Promise<BlogSectionResponse> => {
    console.log(`[Cache Miss] Fetching Blog Data for: ${locale}`);

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
        { blogId, defaultLocale, locale },
        {
            next: {
                revalidate: 60,
                tags: ['blog', typeof blogId === 'string' ? blogId : 'list']
            }
        }
    )
})
