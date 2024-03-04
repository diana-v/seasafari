import { defineField, defineType } from 'sanity';

import { baseLanguage } from '../constants';

export default defineType({
    name: 'navigation',
    title: 'Navigation',
    type: 'document',
    fields: [
        defineField({
            name: 'sections',
            title: 'Sections',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [defineField({ name: 'title', title: 'Title', type: 'localeString' })],
                    preview: {
                        select: {
                            title: `title.${baseLanguage?.id}`,
                        },
                    },
                },
            ],
        }),
        defineField({
            name: 'logo',
            title: 'Logo',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
    ],
    preview: {
        select: {
            title: `sectionTitle.${baseLanguage?.id}`,
        },
    },
});
