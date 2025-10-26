import { SanityClient } from '@sanity/client';

export const fetchGiftCardSectionData = (client: SanityClient, locale?: string, defaultLocale?: string) =>
    client.fetch(
        `
    *[_type == "giftCard"]{
        "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
        "description": coalesce(description.[$locale], description.[$defaultLocale], "Missing translation"),
        "bullets": bullets[]{
          "text": coalesce(@[$locale], @[$defaultLocale], "Missing translation")
        },
        "image": image.asset->url,
        "options": options[] {
          "label": coalesce(label.[$locale], label.[$defaultLocale], "Missing translation"),
          value,
        }
    }[0]
`,
        { locale, defaultLocale }
    );
