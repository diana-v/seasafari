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
            name: 'image',
            options: {
                hotspot: true,
            },
            title: 'image',
            type: 'image',
        }),
        defineField({
            name: 'link',
            title: 'Link',
            type: 'string',
        }),
    ],
    name: 'giftCardWidget',
    preview: {
        select: {
            media: 'image',
            subtitle: `link`,
            title: `title.${baseLanguage?.id}`,
        },
    },
    title: 'Gift Card Widget',
    type: 'document',
});
