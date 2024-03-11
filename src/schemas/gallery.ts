import { SanityClient } from '@sanity/client';

export const fetchGallerySectionData = (client: SanityClient, locale?: string, defaultLocale?: string) =>
    client.fetch(
        `
    *[_type == "gallery"]{
        "sectionTitle": coalesce(sectionTitle.[$locale], sectionTitle.[$defaultLocale], "Missing translation"),
        "title": coalesce(title.[$locale], title.[$defaultLocale]),
        "description": coalesce(description.[$locale], description.[$defaultLocale]),
        "cards": cards[] {
            "image": image.asset->url,
            url,
        },
    }[0]
`,
        { locale, defaultLocale }
    );
