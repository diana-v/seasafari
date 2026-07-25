'use cache';
import { cacheLife, cacheTag } from 'next/cache';

import { client } from '@/lib/sanity';

export interface NavigationProps {
    logo: string;
    phone: string;
}

export interface NavigationSectionResponse {
    logo: string;
    phone: string;
}

export async function fetchNavigationData(locale = 'lt', defaultLocale = 'lt'): Promise<NavigationProps> {
    cacheTag('navigation', 'common');
    cacheLife('weeks');

    return await client.fetch(
        `
    *[_type == "common"]{
        "logo": logo.asset->url,
        phone
    }[0]
`,
        { defaultLocale, locale }
    )
}
