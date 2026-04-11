import { defineField, defineType } from 'sanity';

import { baseLanguage } from '../constants';

export default defineType({
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
            of: [
                {
                    fields: [
                        defineField({
                            name: 'image',
                            options: {
                                hotspot: true,
                            },
                            title: 'image',
                            type: 'image',
                        }),
                    ],
                    preview: {
                        select: {
                            media: 'image',
                        },
                    },
                    type: 'object',
                },
            ],
            title: 'Logos',
            type: 'array',
        }),
    ],
    name: 'partners',
    preview: {
        select: {
            title: `title.${baseLanguage?.id}`,
        },
    },
    title: 'Partners',
    type: 'document',
});
