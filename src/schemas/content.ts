import { TypedObject } from '@portabletext/types';
import { SanityClient } from '@sanity/client';

export interface ContentSectionResponse {
    content: TypedObject | TypedObject[];
    label: string;
    slug: string;
}

export const fetchContentSectionData = (
    client: SanityClient,
    contentId: string | string[],
    locale = 'lt',
    defaultLocale = 'lt'
): Promise<ContentSectionResponse> =>
    client.fetch(
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
    );
