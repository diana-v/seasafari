import { SanityClient } from '@sanity/client';

export const fetchFAQSectionData = (client: SanityClient, locale?: string, defaultLocale?: string) =>
    client.fetch(
        `
    *[_type == "faq"]{
        "sectionTitle": coalesce(sectionTitle.[$locale], sectionTitle.[$defaultLocale], "Missing translation"),
        "title": coalesce(title.[$locale], title.[$defaultLocale]),
        "description": coalesce(description.[$locale], description.[$defaultLocale]),
        "faq": frequentlyAskedQuestions[] {
            "title": coalesce(question.[$locale], question.[$defaultLocale], "Missing translation"),
            "content": coalesce(answer.[$locale], answer.[$defaultLocale], "Missing translation"),
        },
    }[0]
`,
        { locale, defaultLocale }
    );
