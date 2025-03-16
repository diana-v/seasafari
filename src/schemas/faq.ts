import { SanityClient } from '@sanity/client';

export const fetchFAQSectionData = (client: SanityClient, locale?: string, defaultLocale?: string) =>
    client.fetch(
        `
    *[_type == "faq"]{
        "sectionTitle": coalesce(sectionTitle.[$locale], sectionTitle.[$defaultLocale], "Missing translation"),
        "title": coalesce(title.[$locale], title.[$defaultLocale]),
        "description": coalesce(description.[$locale], description.[$defaultLocale]),
        "faq": frequentlyAskedQuestions[] {
            "title": coalesce(title.[$locale], title.[$defaultLocale], "Missing translation"),
            "content": coalesce(content.[$locale], content.[$defaultLocale], "Missing translation"),
        },
    }[0]
`,
        { locale, defaultLocale }
    );
