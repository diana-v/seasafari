import { defineField, defineType } from 'sanity';

import { baseLanguage } from '../constants';

export default defineType({
    name: 'giftCard',
    title: 'Gift Card',
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
            name: 'bullets',
            title: 'Bullets',
            type: 'array',
            of: [{ type: 'localeString' }],
        }),
        defineField({
            name: 'image',
            title: 'image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'options',
            title: 'Options',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'label', title: 'Label', type: 'localeString' }),
                        defineField({ name: 'value', title: 'Value', type: 'number' }),
                    ],
                    preview: {
                        select: {
                            title: `label.${baseLanguage?.id}`,
                        },
                    },
                },
            ],
        }),
    ],
    preview: {
        select: {
            title: `title.${baseLanguage?.id}`,
            subtitle: `description.${baseLanguage?.id}`,
            media: 'image',
        },
    },
});
