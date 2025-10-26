import { SanityClient } from '@sanity/client';

export const fetchPartnersSectionData = (client: SanityClient, locale?: string, defaultLocale?: string) =>
    client.fetch(
        `
    *[_type == "partners"]{
        "title": coalesce(title.[$locale], title.[$defaultLocale]),
        "description": coalesce(description.[$locale], description.[$defaultLocale]),
        "logos": logos[] {
            "image": image.asset->url,
        },
    }[0]
`,
        { locale, defaultLocale }
    );
