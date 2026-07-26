'use cache';
import { TypedObject } from '@portabletext/types';
import { cacheLife, cacheTag } from 'next/cache';

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

export async function fetchFAQSectionData(locale = 'lt', defaultLocale = 'lt'): Promise<FAQSectionResponse> {
    cacheTag('faq');
    cacheLife('weeks');

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
        { defaultLocale, locale }
    )
}
