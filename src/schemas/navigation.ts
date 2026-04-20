import { SanityClient } from '@sanity/client';

export interface NavigationProps {
    logo: string;
    phone: string;
}

export interface NavigationSectionResponse {
    logo: string;
    phone: string;
}


export const fetchNavigationData = (
    client: SanityClient,
    locale = 'lt',
    defaultLocale = 'lt'
): Promise<NavigationProps> =>
    client.fetch(
        `
    *[_type == "common"]{
        "logo": logo.asset->url,
        phone
    }[0]
`,
        { defaultLocale, locale },
        {
            next: {
                revalidate: 3600,
                tags: ['navigation', 'common']
            }
        }
    );
