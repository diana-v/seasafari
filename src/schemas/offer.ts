import { SanityClient } from '@sanity/client';

export const fetchOfferSectionData = (
    client: SanityClient,
    offerId?: string | string[],
    locale?: string,
    defaultLocale?: string
) =>
    client.fetch(
        `
    *[_type == "offer" && _id == $offerId]{
        "image": image.asset->url,
        "imageCompressed": imageCompressed.asset->url,
        "title": coalesce(title.[$locale], title.[$defaultLocale]),
        "longDescription": coalesce(longDescription.[$locale], longDescription.[$defaultLocale]),
        "description": coalesce(description.[$locale], description.[$defaultLocale]),
        "cards": cards[] {
            "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
            "icon": icon.asset->url,
        },
        "phoneReservationLink": coalesce(phoneReservationLink.[$locale], phoneReservationLink.[$defaultLocale], "Missing translation"),
        "phoneReservationLabel": coalesce(phoneReservationLabel.[$locale], phoneReservationLabel.[$defaultLocale], "Missing translation"),
    }[0]
`,
        { locale, defaultLocale, offerId }
    );
