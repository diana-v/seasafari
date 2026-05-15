import { TypedObject } from '@portabletext/types';
import { cache } from 'react';

import { client } from '@/lib/sanity';

export interface ContactSectionResponse {
    description: TypedObject | TypedObject[];
    formTitle: string;
    phone: string;
    title: string;
}

export const fetchContactSectionData = cache(async (locale = 'lt', defaultLocale = 'lt'): Promise<ContactSectionResponse> => {
    console.log(`[Cache Miss] Fetching Contact Data for: ${locale}`);

    return await client.fetch(
        `
    *[_type == "contact"]{
        "title": coalesce(title.[$locale], title.[$defaultLocale]),
        "description": coalesce(description.[$locale], description.[$defaultLocale]),
        "formTitle": coalesce(formTitle.[$locale], formTitle.[$defaultLocale]),
        "phone": *[_type == "common"].phone
    }[0]
`,
        { defaultLocale, locale },
        {
            next: {
                revalidate: 3600,
                tags: ['contact']
            }
        }
    )
})
