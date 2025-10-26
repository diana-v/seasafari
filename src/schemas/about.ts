import { SanityClient } from '@sanity/client';

export const fetchAboutSectionData = (client: SanityClient, locale?: string, defaultLocale?: string) =>
    client.fetch(
        `
    *[_type == "about"]{
        "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
        "image": image.asset->url,
        "description": coalesce(description.[$locale], description.[$defaultLocale]),
        "benefits": benefits[] {
            "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
            "description": coalesce(description.[$locale], description.[$defaultLocale], "Missing translation"),
            "image": image.asset->url
        }
    }[0]
`,
        { locale, defaultLocale }
    );
