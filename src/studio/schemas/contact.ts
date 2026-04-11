import { defineField, defineType } from 'sanity';

import { baseLanguage } from '../constants';

export default defineType({
    fields: [
        defineField({ name: 'title', title: 'Title', type: 'localeString' }),
        defineField({ name: 'description', title: 'Description', type: 'localeBlock' }),
        defineField({ name: 'formTitle', title: 'Form Title', type: 'localeString' }),
    ],
    name: 'contact',
    preview: {
        select: {
            subtitle: `description.${baseLanguage?.id}`,
            title: `title.${baseLanguage?.id}`,
        },
    },
    title: 'Contact',
    type: 'document',
});
