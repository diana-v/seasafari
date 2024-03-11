import { SanityClient } from '@sanity/client';

export const fetchContactSectionData = (client: SanityClient, locale?: string, defaultLocale?: string) =>
    client.fetch(
        `
    *[_type == "contact"]{
        "sectionTitle": coalesce(sectionTitle.[$locale], sectionTitle.[$defaultLocale], "Missing translation"),
        "backgroundImage": backgroundImage.asset->url,
        "title": coalesce(title.[$locale], title.[$defaultLocale]),
        "description": coalesce(description.[$locale], description.[$defaultLocale]),
        "socialLinks": socialLinks[] {
            "platform": coalesce(platform.[$locale], platform.[$defaultLocale], "Missing translation"),
            "link": coalesce(link.[$locale], link.[$defaultLocale], "Missing translation"),
            "icon": icon.asset->url
        },
        "address": address {
            "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
            "value": coalesce(value.[$locale], value.[$defaultLocale], "Missing translation")
        },
        "email": email {
            "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
            value
        },
        "phone": phone {
            "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
            "value": coalesce(value.[$locale], value.[$defaultLocale], "Missing translation")
        },
    }[0]
`,
        { locale, defaultLocale }
    );
