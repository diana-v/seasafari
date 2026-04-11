import { defineField, defineType } from 'sanity';

import { baseLanguage } from '../constants';

export default defineType({
    fields: [
        defineField({ name: 'title', title: 'Title', type: 'localeString' }),
        defineField({ name: 'description', title: 'Description', type: 'localeBlock' }),
        defineField({
            name: 'frequentlyAskedQuestions',
            of: [
                {
                    fields: [
                        defineField({ name: 'title', title: 'Question', type: 'localeString' }),
                        defineField({ name: 'content', title: 'Answer', type: 'localeBlock' }),
                    ],
                    name: 'questions',
                    preview: {
                        select: {
                            subtitle: `content.${baseLanguage?.id}`,
                            title: `title.${baseLanguage?.id}`,
                        },
                    },
                    title: 'Questions',
                    type: 'object',
                },
            ],
            title: 'Frequently Asked Questions',
            type: 'array',
        }),
    ],
    name: 'faq',
    preview: {
        select: {
            title: `title.${baseLanguage?.id}`,
        },
    },
    title: 'Faq',
    type: 'document',
});
