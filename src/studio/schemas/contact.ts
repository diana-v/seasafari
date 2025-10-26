import { defineField, defineType } from 'sanity';

import { baseLanguage } from '../constants';

export default defineType({
    name: 'contact',
    title: 'Contact',
    type: 'document',
    fields: [
        defineField({ name: 'title', title: 'Title', type: 'localeString' }),
        defineField({ name: 'description', title: 'Description', type: 'localeBlock' }),
        defineField({ name: 'formTitle', title: 'Form Title', type: 'localeString' }),
    ],
    preview: {
        select: {
            title: `title.${baseLanguage?.id}`,
            subtitle: `description.${baseLanguage?.id}`,
        },
    },
});
