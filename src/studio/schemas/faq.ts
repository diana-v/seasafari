import { defineField, defineType } from 'sanity';

import { baseLanguage } from '../constants';

export default defineType({
    name: 'faq',
    title: 'Faq',
    type: 'document',
    fields: [
        defineField({
            name: 'sectionTitle',
            title: 'Section Title',
            type: 'localeString',
        }),
        defineField({ name: 'title', title: 'Title', type: 'localeString' }),
        defineField({ name: 'description', title: 'Description', type: 'localeBlock' }),
        defineField({
            name: 'frequentlyAskedQuestions',
            title: 'Frequently Asked Questions',
            type: 'array',
            of: [
                {
                    name: 'questions',
                    title: 'Questions',
                    type: 'object',
                    fields: [
                        defineField({ name: 'title', title: 'Question', type: 'localeString' }),
                        defineField({ name: 'content', title: 'Answer', type: 'localeBlock' }),
                    ],
                    preview: {
                        select: {
                            title: `title.${baseLanguage?.id}`,
                            subtitle: `content.${baseLanguage?.id}`,
                        },
                    },
                },
            ],
        }),
    ],
    preview: {
        select: {
            title: `sectionTitle.${baseLanguage?.id}`,
        },
    },
});
