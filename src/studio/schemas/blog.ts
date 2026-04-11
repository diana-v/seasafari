import { defineField, defineType } from 'sanity';

import { baseLanguage } from '../constants';

export default defineType({
    fields: [
        defineField({
            name: 'slug',
            options: { maxLength: 96, source: `title.${baseLanguage?.id}` },
            title: 'Slug',
            type: 'slug',
        }),
        defineField({ name: 'image', title: 'Image', type: 'image' }),
        defineField({ name: 'title', title: 'Title', type: 'localeString' }),
        defineField({ name: 'description', title: 'Description', type: 'localeString' }),
        defineField({ name: 'content', title: 'Content', type: 'localeBlock' }),
        defineField({ name: 'backgroundColor', title: 'Background Color', type: 'string' }),
        defineField({ hidden: true, name: 'orderRank', title: 'Order rank', type: 'string' }),
    ],
    name: 'blog',
    preview: {
        select: {
            media: 'image',
            subtitle: `description.${baseLanguage?.id}`,
            title: `title.${baseLanguage?.id}`,
        },
    },
    title: 'Blog',
    type: 'document',
});
