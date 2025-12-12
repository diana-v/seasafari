import { defineField, defineType } from 'sanity';

import { baseLanguage } from '../constants';

export default defineType({
    name: 'reviews',
    title: 'Reviews',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'localeString',
        }),
    ],
    preview: {
        select: {
            title: `title.${baseLanguage?.id}`,
        },
    },
});
