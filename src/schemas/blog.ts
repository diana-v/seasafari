import { SanityClient } from '@sanity/client';

export const fetchBlogSectionData = (
    client: SanityClient,
    blogId?: string | string[],
    locale?: string,
    defaultLocale?: string
) =>
    client.fetch(
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
        { locale, defaultLocale, blogId }
    );
