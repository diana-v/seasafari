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
            name: 'description',
            title: 'Description',
            type: 'localeBlock',
        }),
        defineField({
            name: 'benefits',
            of: [
                {
                    fields: [
                        defineField({ name: 'title', title: 'Title', type: 'localeString' }),
                        defineField({ name: 'description', title: 'Description', type: 'localeBlock' }),
                        defineField({ name: 'image', title: 'Image', type: 'image' }),
                    ],
                    preview: {
                        select: {
                            media: 'image',
                            subtitle: `description.${baseLanguage?.id}`,
                            title: `title.${baseLanguage?.id}`,
                        },
                    },
                    type: 'object',
                },
            ],
            title: 'Benefits',
            type: 'array',
        }),
    ],
    name: 'about',
    preview: {
        select: {
            media: 'image',
            subtitle: `description.${baseLanguage?.id}`,
            title: `title.${baseLanguage?.id}`,
        },
    },
    title: 'About',
    type: 'document',
});
