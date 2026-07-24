'use cache';
import { cacheLife, cacheTag } from 'next/cache';

import { client } from '@/lib/sanity';

export interface PartnerLogo {
    image: string;
}

export interface PartnersSectionResponse {
    description?: string;
    logos: PartnerLogo[];
    title: string;
}

export async function fetchPartnersSectionData(locale = 'lt', defaultLocale = 'lt'): Promise<PartnersSectionResponse> {
    cacheTag('partners');
    cacheLife('weeks');

    return await client.fetch(
        `
    *[_type == "partners"]{
        "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
        "description": coalesce(description.[$locale], description.[$defaultLocale]),
        "logos": logos[] {
            "image": image.asset->url,
        },
    }[0]
`,
        { defaultLocale, locale }
    )
}
