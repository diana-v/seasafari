import { cache } from 'react';

import { client } from '@/lib/sanity';

export interface GalleryCard {
    image: string;
    url?: string;
}

export interface GallerySectionResponse {
    cards: GalleryCard[];
}

export const fetchGallerySectionData = cache(async (locale = 'lt', defaultLocale = 'lt'): Promise<GallerySectionResponse> => {
    console.log(`[Cache Miss] Fetching Gallery Data for: ${locale}`);

    return await client.fetch(
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
    )
})
