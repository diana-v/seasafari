import { TypedObject } from '@portabletext/types';
import { SanityClient } from '@sanity/client';

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

export const fetchAboutSectionData = (
    client: SanityClient,
    locale = 'lt',
    defaultLocale = 'lt'
): Promise<AboutSectionResponse> =>
    client.fetch(
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
    );
