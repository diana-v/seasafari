import { SanityClient } from '@sanity/client';

export const fetchNavigationData = (client: SanityClient, locale?: string, defaultLocale?: string) =>
    client.fetch(
        `
    *[_type == "common"]{
        "logo": logo.asset->url,
        "phone": coalesce(phone.[$locale], phone.[$defaultLocale], "Missing translation"),
    }[0]
`,
        { locale, defaultLocale }
    );
