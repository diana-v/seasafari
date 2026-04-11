import { defineField, defineType } from 'sanity';

import { baseLanguage } from '../constants';

export default defineType({
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'localeString',
        }),
    ],
    name: 'reviews',
    preview: {
        select: {
            title: `title.${baseLanguage?.id}`,
        },
    },
    title: 'Reviews',
    type: 'document',
});
