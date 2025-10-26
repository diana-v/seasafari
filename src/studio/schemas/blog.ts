import { defineField, defineType } from 'sanity';

import { baseLanguage } from '../constants';

export default defineType({
    name: 'blog',
    title: 'Blog',
    type: 'document',
    fields: [
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: `title.${baseLanguage?.id}`, maxLength: 96 },
        }),
        defineField({ name: 'image', title: 'Image', type: 'image' }),
        defineField({ name: 'title', title: 'Title', type: 'localeString' }),
        defineField({ name: 'description', title: 'Description', type: 'localeString' }),
        defineField({ name: 'content', title: 'Content', type: 'localeBlock' }),
        defineField({ name: 'backgroundColor', title: 'Background Color', type: 'string' }),
        defineField({ name: 'orderRank', title: 'Order rank', type: 'string', hidden: true }),
    ],
    preview: {
        select: {
            title: `title.${baseLanguage?.id}`,
            subtitle: `description.${baseLanguage?.id}`,
            media: 'image',
        },
    },
});
