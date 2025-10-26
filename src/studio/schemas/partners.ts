import { defineField, defineType } from 'sanity';

import { baseLanguage } from '../constants';

export default defineType({
    name: 'partners',
    title: 'Partners',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'localeString',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'localeBlock',
        }),
        defineField({
            name: 'logos',
            title: 'Logos',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'image',
                            title: 'image',
                            type: 'image',
                            options: {
                                hotspot: true,
                            },
                        }),
                    ],
                    preview: {
                        select: {
                            media: 'image',
                        },
                    },
                },
            ],
        }),
    ],
    preview: {
        select: {
            title: `title.${baseLanguage?.id}`,
        },
    },
});
