'use cache';
import { TypedObject } from '@portabletext/types';
import { cacheLife, cacheTag } from 'next/cache';

import { client } from '@/lib/sanity';

export interface OfferListingCard {
    description: string;
    imageCompressed: string;
    linkTitle: string;
    orderRank?: number;
    slug: string;
    title: string;
}

export interface OffersSectionResponse {
    cards: OfferListingCard[];
    description: TypedObject | TypedObject[];
    title: string;
}

export async function fetchOffersSectionData(locale = 'lt', defaultLocale = 'lt'): Promise<OffersSectionResponse> {
    cacheTag('offers', 'offer-list');
    cacheLife('weeks');

    return await client.fetch(
        `
    *[_type == "offers"] {
        "title": coalesce(title.[$locale], title.[$defaultLocale]),
        "description": coalesce(description.[$locale], description.[$defaultLocale]),
        "cards": *[_type == "offer"] {
            "slug": slug.current,
            "imageCompressed": imageCompressed.asset->url,
            "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
            "description": coalesce(description.[$locale], description.[$defaultLocale], "Missing translation"),
            "linkTitle": coalesce(linkTitle.[$locale], linkTitle.[$defaultLocale], "Missing translation"),
            orderRank,
        } | order(orderRank)
    }[0]
`,
        { defaultLocale, locale }
    )
}
