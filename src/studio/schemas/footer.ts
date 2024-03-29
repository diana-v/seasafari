import { defineField, defineType } from 'sanity';

import { baseLanguage } from '../constants';

export default defineType({
    name: 'footer',
    title: 'Footer',
    type: 'document',
    fields: [
        defineField({ name: 'label', title: 'Label', type: 'localeString' }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: `label.${baseLanguage?.id}`, maxLength: 96 },
        }),
        defineField({ name: 'content', title: 'Content', type: 'localeBlock' }),
    ],
    preview: {
        select: {
            title: `label.${baseLanguage?.id}`,
            subtitle: `slug.${baseLanguage?.id}`,
        },
    },
});
