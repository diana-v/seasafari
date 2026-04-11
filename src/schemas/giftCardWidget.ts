import { SanityClient } from '@sanity/client';

export interface GiftCardWidgetResponse {
    image: string;
    link?: string;
    title: string;
}

export const fetchGiftCardWidgetSectionData = (
    client: SanityClient,
    locale = 'lt',
    defaultLocale = 'lt'
): Promise<GiftCardWidgetResponse> =>
    client.fetch(
        `
    *[_type == "giftCardWidget"]{
        "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
        "image": image.asset->url,
        link,
    }[0]
`,
        { defaultLocale, locale },
        {
            next: {
                revalidate: 3600,
                tags: ['giftCardWidget']
            }
        }
    );
