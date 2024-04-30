import { SanityClient } from '@sanity/client';

export const fetchContentSectionData = (
    client: SanityClient,
    contentId?: string | string[],
    locale?: string,
    defaultLocale?: string
) =>
    client.fetch(
        `
    *[_type == "footer" && slug.current == $contentId]{
        "slug": slug.current,
        "label": coalesce(label.[$locale], label.[$defaultLocale]),
        "content": coalesce(content.[$locale], content.[$defaultLocale]),
    }[0]
`,
        { locale, defaultLocale, contentId }
    );
