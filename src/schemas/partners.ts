import { cache } from 'react';

import { client } from '@/lib/sanity';

export interface PartnerLogo {
    image: string;
}

export interface PartnersSectionResponse {
    description?: string;
    logos: PartnerLogo[];
    title: string;
}

export const fetchPartnersSectionData = cache(async (locale = 'lt', defaultLocale = 'lt'): Promise<PartnersSectionResponse> => {
    console.log(`[Cache Miss] Fetching Partners Data for: ${locale}`);

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
        { defaultLocale, locale },
        {
            next: {
                revalidate: 3600,
                tags: ['partners']
            }
        }
    )
})
