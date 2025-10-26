import { defineField, defineType } from 'sanity';

import { baseLanguage } from '../constants';

export default defineType({
    name: 'giftCardWidget',
    title: 'Gift Card Widget',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'localeString',
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
            name: 'link',
            type: 'string',
            title: 'Link',
        }),
    ],
    preview: {
        select: {
            title: `title.${baseLanguage?.id}`,
            subtitle: `link`,
            media: 'image',
        },
    },
});
