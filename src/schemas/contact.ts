import { TypedObject } from '@portabletext/types';
import { SanityClient } from '@sanity/client';

export interface ContactSectionResponse {
    description: TypedObject | TypedObject[];
    formTitle: string;
    phone: string;
    title: string;
}

export const fetchContactSectionData = (
    client: SanityClient,
    locale = 'lt',
    defaultLocale = 'lt'
): Promise<ContactSectionResponse> =>
    client.fetch(
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
    );
