import { SanityClient } from '@sanity/client';

export const fetchGallerySectionData = (client: SanityClient, locale?: string, defaultLocale?: string) =>
    client.fetch(
        `
    *[_type == "gallery"]{
        "cards": cards[] {
            "image": image.asset->url,
            url,
        },
    }[0]
`,
        { locale, defaultLocale }
    );
