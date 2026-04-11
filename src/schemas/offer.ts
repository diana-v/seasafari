import { TypedObject } from '@portabletext/types';
import { SanityClient } from '@sanity/client';

export interface OfferCard {
    icon: string;
    title: string;
}

export interface OfferChip {
    label: string;
    value: string;
}

export interface OfferSectionResponse {
    cards?: OfferCard[];
    chips?: OfferChip[];
    description?: string;
    giftcardInfo?: TypedObject | TypedObject[];
    image: string;
    imageCompressed?: string;
    isGiftcard?: boolean;
    longDescription?: TypedObject | TypedObject[];
    phoneReservationLabel: string;
    phoneReservationLink: string;
    slug: string;
    title: string;
}

export const fetchOfferSectionData = (
    client: SanityClient,
    offerId: string | string[],
    locale = 'lt',
    defaultLocale = 'lt'
): Promise<OfferSectionResponse> =>
    client.fetch(
        `
    *[_type == "offer" && slug.current == $offerId]{
        "slug": slug.current,
        "image": image.asset->url,
        "imageCompressed": imageCompressed.asset->url,
        "title": coalesce(title.[$locale], title.[$defaultLocale]),
        "longDescription": coalesce(longDescription.[$locale], longDescription.[$defaultLocale]),
        "description": coalesce(description.[$locale], description.[$defaultLocale]),
        "cards": cards[] {
            "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
            "icon": icon.asset->url,
        },
        isGiftcard,
        "chips": chips[] {
            "label": coalesce(label.[$locale], label.[$defaultLocale]),
            value,
        },
        "giftcardInfo": coalesce(giftcardInfo.[$locale], giftcardInfo.[$defaultLocale]),
        "phoneReservationLink": coalesce(phoneReservationLink.[$locale], phoneReservationLink.[$defaultLocale], "Missing translation"),
        "phoneReservationLabel": coalesce(phoneReservationLabel.[$locale], phoneReservationLabel.[$defaultLocale], "Missing translation"),
    }[0]
`,
        { defaultLocale, locale, offerId },
        {
            next: {
                revalidate: 60,
                tags: ['offer', typeof offerId === 'string' ? offerId : 'detail']
            }
        }
    );
