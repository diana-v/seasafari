import { defineField, defineType } from 'sanity';

import { baseLanguage } from '../constants';

export default defineType({
    name: 'blogs',
    title: 'Blogs',
    type: 'document',
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
    preview: {
        select: {
            title: `title.${baseLanguage?.id}`,
        },
    },
});
