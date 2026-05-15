import { TypedObject } from '@portabletext/types';
import { cache } from 'react';

import { client } from '@/lib/sanity';

export interface FAQItem {
    content: TypedObject | TypedObject[];
    title: string;
}

export interface FAQSectionResponse {
    description: TypedObject | TypedObject[];
    faq: FAQItem[];
    title: string;
}

export const fetchFAQSectionData = cache(async (locale = 'lt', defaultLocale = 'lt'): Promise<FAQSectionResponse> => {
    console.log(`[Cache Miss] Fetching FAQ Data for: ${locale}`);

    return await client.fetch(
        `
    *[_type == "faq"]{
        "title": coalesce(title.[$locale], title.[$defaultLocale]),
        "description": coalesce(description.[$locale], description.[$defaultLocale]),
        "faq": frequentlyAskedQuestions[] {
            "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
            "content": coalesce(content.[$locale], content.[$defaultLocale], "Missing translation"),
        },
    }[0]
`,
        { defaultLocale, locale },
        {
            next: {
                revalidate: 3600,
                tags: ['faq']
            }
        }
    )
})
