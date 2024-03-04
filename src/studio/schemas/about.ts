import { defineField, defineType } from 'sanity';

import { baseLanguage } from '../constants';

export default defineType({
    name: 'about',
    title: 'About',
    type: 'document',
    fields: [
        defineField({
            name: 'sectionTitle',
            title: 'Section Title',
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
    ],
    preview: {
        select: {
            title: `sectionTitle.${baseLanguage?.id}`,
        },
    },
});
