import { SanityClient } from '@sanity/client';

export const fetchFooterSectionData = (client: SanityClient, locale?: string, defaultLocale?: string) =>
    client.fetch(
        `
    *[_type == "footer"] {
      "common": *[_type == "common"] {
        "logo": logo.asset->url,
        phone,
        email,
        "address": coalesce(address.[$locale], address.[$defaultLocale], "Missing translation"),
        "companyDetails": companyDetails {
          name,
          "companyCode": coalesce(companyCode.[$locale], companyCode.[$defaultLocale], "Missing translation"),
          "address": coalesce(address.[$locale], address.[$defaultLocale], "Missing translation")
        },
        "socialLinks": socialLinks[] {
          "platform": coalesce(platform.[$locale], platform.[$defaultLocale], "Missing translation"),
          "link": coalesce(link.[$locale], link.[$defaultLocale], "Missing translation"),
          "icon": icon.asset->url
        },
        "privacyPolicy": privacyPolicy {
          "slug": slug.current,
        },
        "purchaseRules": purchaseRules {
          "slug": slug.current,
        }
      }[0],
      "faq": *[_type == "faq"] {
        "title": coalesce(title.[$locale], title.[$defaultLocale]),
      }[0],
    }[0]
`,
        { locale, defaultLocale }
    );
