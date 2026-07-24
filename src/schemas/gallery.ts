'use cache';
import { cacheLife, cacheTag } from 'next/cache';

import { client } from '@/lib/sanity';

export interface GalleryCard {
    image: string;
    url?: string;
}

export interface GallerySectionResponse {
    cards: GalleryCard[];
}

export async function fetchGallerySectionData(locale = 'lt', defaultLocale = 'lt'): Promise<GallerySectionResponse> {
    cacheTag('gallery');
    cacheLife('weeks');

    return await client.fetch(
        `
    *[_type == "gallery"]{
        "cards": cards[] {
            "image": image.asset->url,
            url,
        },
    }[0]
`,
        { defaultLocale, locale }
    )
}
