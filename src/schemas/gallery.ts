import { SanityClient } from '@sanity/client';

export interface GalleryCard {
    image: string;
    url?: string;
}

export interface GallerySectionResponse {
    cards: GalleryCard[];
}

export const fetchGallerySectionData = (
    client: SanityClient,
    locale = 'lt',
    defaultLocale = 'lt'
): Promise<GallerySectionResponse> =>
    client.fetch(
        `
    *[_type == "gallery"]{
        "cards": cards[] {
            "image": image.asset->url,
            url,
        },
    }[0]
`,
        { defaultLocale, locale },
        {
            next: {
                revalidate: 600,
                tags: ['gallery']
            }
        }
    );
