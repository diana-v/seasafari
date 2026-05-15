import { cache } from 'react';

import { client } from '@/lib/sanity';

export interface NavigationProps {
    logo: string;
    phone: string;
}

export interface NavigationSectionResponse {
    logo: string;
    phone: string;
}

export const fetchNavigationData = cache(async (locale = 'lt', defaultLocale = 'lt'): Promise<NavigationProps> => {
    console.log(`[Cache Miss] Fetching Navigation Data for: ${locale}`);

    return await client.fetch(
        `
    *[_type == "common"]{
        "logo": logo.asset->url,
        phone
    }[0]
`,
        { defaultLocale, locale },
        {
            next: {
                revalidate: 3600,
                tags: ['navigation', 'common']
            }
        }
    )
})
