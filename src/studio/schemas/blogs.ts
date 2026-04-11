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
            name: 'description',
            title: 'Description',
            type: 'localeString',
        }),
    ],
    name: 'blogs',
    preview: {
        select: {
            title: `title.${baseLanguage?.id}`,
        },
    },
    title: 'Blogs',
    type: 'document',
});
