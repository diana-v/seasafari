import { defineField, defineType } from 'sanity';

import { baseLanguage } from '../constants';

export default defineType({
    name: 'safety',
    title: 'Safety',
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
            name: 'cards',
            title: 'Cards',
            type: 'array',
            of: [
                {
                    name: 'card',
                    title: 'card',
                    type: 'object',
                    fields: [
                        defineField({ name: 'icon', title: 'Icon', type: 'image' }),
                        defineField({ name: 'title', title: 'Title', type: 'localeString' }),
                        defineField({ name: 'image', title: 'Image', type: 'image' }),
                    ],
                    preview: {
                        select: {
                            title: `title.${baseLanguage?.id}`,
                            media: 'icon',
                        },
                    },
                },
            ],
        }),
        defineField({ name: 'disclaimer', title: 'Disclaimer', type: 'localeString' }),
    ],
    preview: {
        select: {
            title: `sectionTitle.${baseLanguage?.id}`,
        },
    },
});
