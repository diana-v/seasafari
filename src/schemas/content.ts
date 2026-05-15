import { TypedObject } from '@portabletext/types';
import { cache } from 'react';

import { client } from '@/lib/sanity';

export interface ContentSectionResponse {
    content: TypedObject | TypedObject[];
    label: string;
    slug: string;
}

export const fetchContentSectionData = cache(async (contentId: string | string[], locale = 'lt', defaultLocale = 'lt'): Promise<ContentSectionResponse> => {
    console.log(`[Cache Miss] Fetching Content Data for: ${locale}`);

    return await client.fetch(
        `
    *[_type == "footer" && slug.current == $contentId]{
        "slug": slug.current,
        "label": coalesce(label.[$locale], label.[$defaultLocale]),
        "content": coalesce(content.[$locale], content.[$defaultLocale]),
    }[0]
`,
        { contentId, defaultLocale, locale },
        {
            next: {
                revalidate: 3600,
                tags: ['content', typeof contentId === 'string' ? contentId : 'footer-content']
            }
        }
    )
})
