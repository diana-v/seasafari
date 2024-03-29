import { SanityClient } from '@sanity/client';

export const fetchFooterSectionData = (client: SanityClient, locale?: string, defaultLocale?: string) =>
    client.fetch(
        `
    *[_type == "footer"] {
      "items": *[ _type == "footer" ] {
        "label": coalesce(label[$locale], label[$defaultLocale], "Missing translation"),
        "slug": slug.current,
        "content": coalesce(content[$locale], content[$defaultLocale], "Missing translation")
      }
    }[0]
`,
        { locale, defaultLocale }
    );
