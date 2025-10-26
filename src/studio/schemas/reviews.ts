import { defineField, defineType } from 'sanity';

import { baseLanguage } from '../constants';

export default defineType({
    name: 'reviews',
    title: 'Reviews',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'localeString',
        }),
        defineField({
            name: 'cards',
            title: 'Cards',
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
                        defineField({ name: 'name', title: 'Name', type: 'localeString' }),
                        defineField({ name: 'review', title: 'Review', type: 'localeString' }),
                    ],
                    preview: {
                        select: {
                            title: `name.${baseLanguage?.id}`,
                            subtitle: `review.${baseLanguage?.id}`,
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
