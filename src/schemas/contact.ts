'use cache';
import { TypedObject } from '@portabletext/types';
import { cacheLife, cacheTag } from 'next/cache';

import { client } from '@/lib/sanity';

export interface ContactSectionResponse {
    description: TypedObject | TypedObject[];
    formTitle: string;
    phone: string;
    title: string;
}

export async function fetchContactSectionData(locale = 'lt', defaultLocale = 'lt'): Promise<ContactSectionResponse> {
    cacheTag('contact');
    cacheLife('weeks');

    return await client.fetch(
        `
    *[_type == "contact"]{
        "title": coalesce(title.[$locale], title.[$defaultLocale]),
        "description": coalesce(description.[$locale], description.[$defaultLocale]),
        "formTitle": coalesce(formTitle.[$locale], formTitle.[$defaultLocale]),
        "phone": *[_type == "common"].phone
    }[0]
`,
        { defaultLocale, locale }
    )
}
