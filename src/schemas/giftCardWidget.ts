import { SanityClient } from '@sanity/client';

export const fetchGiftCardWidgetSectionData = (client: SanityClient, locale?: string, defaultLocale?: string) =>
    client.fetch(
        `
    *[_type == "giftCardWidget"]{
        "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
        "image": image.asset->url,
        link,
    }[0]
`,
        { locale, defaultLocale }
    );
