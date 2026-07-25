'use cache';
import { cacheLife, cacheTag } from 'next/cache';

import { client } from '@/lib/sanity';

export interface GiftCardWidgetResponse {
    image: string;
    link?: string;
    title: string;
}

export async function fetchGiftCardWidgetSectionData(locale = 'lt', defaultLocale = 'lt'): Promise<GiftCardWidgetResponse> {
    cacheTag('giftCardWidget');
    cacheLife('weeks');

    return await client.fetch(
        `
    *[_type == "giftCardWidget"]{
        "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
        "image": image.asset->url,
        link,
    }[0]
`,
        { defaultLocale, locale }
    )
}
