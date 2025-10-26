import { defineField, defineType } from 'sanity';

import { baseLanguage } from '../constants';

export default defineType({
    name: 'about',
    title: 'About',
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
            name: 'description',
            type: 'localeBlock',
            title: 'Description',
        }),
        defineField({
            name: 'benefits',
            type: 'array',
            title: 'Benefits',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'title', title: 'Title', type: 'localeString' }),
                        defineField({ name: 'description', title: 'Description', type: 'localeBlock' }),
                        defineField({ name: 'image', title: 'Image', type: 'image' }),
                    ],
                    preview: {
                        select: {
                            title: `title.${baseLanguage?.id}`,
                            subtitle: `description.${baseLanguage?.id}`,
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
            subtitle: `description.${baseLanguage?.id}`,
            media: 'image',
        },
    },
});
