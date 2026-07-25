'use cache';
import { TypedObject } from '@portabletext/types';
import { cacheLife, cacheTag } from 'next/cache';

import { client } from '@/lib/sanity';

export interface ContentSectionResponse {
    content: TypedObject | TypedObject[];
    label: string;
    slug: string;
}

export async function fetchContentSectionData(contentId: string | string[], locale = 'lt', defaultLocale = 'lt'): Promise<ContentSectionResponse> {
    cacheTag('content', typeof contentId === 'string' ? contentId : 'footer-content');
    cacheLife('weeks');

    return await client.fetch(
        `
    *[_type == "footer" && slug.current == $contentId]{
        "slug": slug.current,
        "label": coalesce(label.[$locale], label.[$defaultLocale]),
        "content": coalesce(content.[$locale], content.[$defaultLocale]),
    }[0]
`,
        { contentId, defaultLocale, locale }
    )
}
