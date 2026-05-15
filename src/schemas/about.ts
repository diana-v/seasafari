import { TypedObject } from '@portabletext/types';
import { cache } from 'react';

import { client } from '@/lib/sanity';

export interface AboutSectionResponse {
    benefits?: Benefit[];
    description?: TypedObject | TypedObject[];
    image: string;
    title: string;
}

export interface Benefit {
    description: TypedObject | TypedObject[];
    image: string;
    title: string;
}

export const fetchAboutSectionData = cache(async (locale = 'lt', defaultLocale = 'lt'): Promise<AboutSectionResponse> => {
    console.log(`[Cache Miss] Fetching About Data for: ${locale}`);

    return await client.fetch(
        `
    *[_type == "about"]{
        "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
        "image": image.asset->url,
        "description": coalesce(description.[$locale], description.[$defaultLocale]),
        "benefits": benefits[] {
            "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
            "description": coalesce(description.[$locale], description.[$defaultLocale], "Missing translation"),
            "image": image.asset->url
        }
    }[0]
`,
        { defaultLocale, locale },
        {
            next: {
                revalidate: 60,
                tags: ['about']
            }
        }
    )
})
