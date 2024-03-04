import { SanityClient } from '@sanity/client';

export const fetchSafetySectionData = (client: SanityClient, locale?: string, defaultLocale?: string) =>
    client.fetch(
        `
    *[_type == "safety"]{
        "sectionTitle": coalesce(sectionTitle.[$locale], sectionTitle.[$defaultLocale], "Missing translation"),
        "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
        "description": coalesce(description.[$locale], description.[$defaultLocale], "Missing translation"),
        "cards": cards[] {
            "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
            "icon": icon.asset->url,
            "image": image.asset->url,
        },
        "disclaimer": coalesce(disclaimer.[$locale], disclaimer.[$defaultLocale], "Missing translation"),
    }[0]
`,
        { locale, defaultLocale }
    );
