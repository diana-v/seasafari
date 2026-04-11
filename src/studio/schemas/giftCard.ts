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
            name: 'bullets',
            of: [{ type: 'localeString' }],
            title: 'Bullets',
            type: 'array',
        }),
        defineField({
            name: 'image',
            options: {
                hotspot: true,
            },
            title: 'image',
            type: 'image',
        }),
        defineField({
            name: 'options',
            of: [
                {
                    fields: [
                        defineField({ name: 'label', title: 'Label', type: 'localeString' }),
                        defineField({ name: 'value', title: 'Value', type: 'number' }),
                    ],
                    preview: {
                        select: {
                            title: `label.${baseLanguage?.id}`,
                        },
                    },
                    type: 'object',
                },
            ],
            title: 'Options',
            type: 'array',
        }),
    ],
    name: 'giftCard',
    preview: {
        select: {
            media: 'image',
            subtitle: `description.${baseLanguage?.id}`,
            title: `title.${baseLanguage?.id}`,
        },
    },
    title: 'Gift Card',
    type: 'document',
});
