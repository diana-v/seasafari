import { SanityClient } from '@sanity/client';

// Not fetched, but used for reference
export const fetchCommonData = (client: SanityClient, locale?: string, defaultLocale?: string) =>
    client.fetch(
        `
    *[_type == "common"]{
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
          "content": coalesce(content.[$locale], content.[$defaultLocale], "Missing translation")
         }
    }[0]
`,
        { locale, defaultLocale }
    );
