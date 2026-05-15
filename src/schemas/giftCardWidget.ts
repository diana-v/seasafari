import { cache } from 'react';

import { client } from '@/lib/sanity';

export interface GiftCardWidgetResponse {
    image: string;
    link?: string;
    title: string;
}

export const fetchGiftCardWidgetSectionData = cache(async (locale = 'lt', defaultLocale = 'lt'): Promise<GiftCardWidgetResponse> => {
    console.log(`[Cache Miss] Fetching Gift Card Widget Data for: ${locale}`);

    return await client.fetch(
        `
    *[_type == "giftCardWidget"]{
        "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
        "image": image.asset->url,
        link,
    }[0]
`,
        { defaultLocale, locale },
        {
            next: {
                revalidate: 3600,
                tags: ['giftCardWidget']
            }
        }
    )
})
