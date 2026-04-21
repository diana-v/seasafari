import { SanityClient } from '@sanity/client';

export interface PartnerLogo {
    image: string;
}

export interface PartnersSectionResponse {
    description?: string;
    logos: PartnerLogo[];
    title: string;
}

export const fetchPartnersSectionData = (
    client: SanityClient,
    locale = 'lt',
    defaultLocale = 'lt'
): Promise<PartnersSectionResponse> =>
    client.fetch(
        `
    *[_type == "partners"]{
        "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
        "description": coalesce(description.[$locale], description.[$defaultLocale]),
        "logos": logos[] {
            "image": image.asset->url,
        },
    }[0]
`,
        { defaultLocale, locale },
        {
            next: {
                revalidate: 3600,
                tags: ['partners']
            }
        }
    );
