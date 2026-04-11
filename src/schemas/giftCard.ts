import { TypedObject } from '@portabletext/types';
import { SanityClient } from '@sanity/client';

export interface GiftCardBullet {
    text: string;
}

export interface GiftCardOption {
    label: string;
    value: number;
}

export interface GiftCardSectionResponse {
    bullets: GiftCardBullet[];
    description: TypedObject | TypedObject[];
    image: string;
    options: GiftCardOption[];
    title: string;
}

export const fetchGiftCardSectionData = (
    client: SanityClient,
    locale = 'lt',
    defaultLocale = 'lt'
): Promise<GiftCardSectionResponse> =>
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
        { defaultLocale, locale },
        {
            next: {
                revalidate: 3600,
                tags: ['giftCard']
            }
        }
    );
