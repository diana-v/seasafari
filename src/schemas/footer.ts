import { SanityClient } from '@sanity/client';

export const fetchFooterSectionData = (client: SanityClient, locale?: string, defaultLocale?: string) =>
    client.fetch(
        `
    *[_type == "footer"] {
      "items": *[ _type == "footer" ] {
        "label": coalesce(label[$locale], label[$defaultLocale], "Missing translation"),
        "slug": slug.current,
        "content": coalesce(content[$locale], content[$defaultLocale], "Missing translation")
      },
      "contact": *[_type == "contact"] {
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
        "companyDetails": companyDetails {
            "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
            "name": coalesce(name.[$locale], name.[$defaultLocale], "Missing translation"),
            "companyCode": coalesce(companyCode.[$locale], companyCode.[$defaultLocale], "Missing translation"),
            "address": coalesce(address.[$locale], address.[$defaultLocale], "Missing translation")
        },
      }[0]
    }[0]
`,
        { locale, defaultLocale }
    );
