import { defineField, defineType } from 'sanity';

import { baseLanguage } from '../constants';

export default defineType({
    name: 'offers',
    title: 'Offers',
    type: 'document',
    fields: [
        defineField({
            name: 'sectionTitle',
            title: 'Section Title',
            type: 'localeString',
        }),
        defineField({
            name: 'title',
            title: 'Title',
            type: 'localeString',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'localeBlock',
        }),
    ],
    preview: {
        select: {
            title: `sectionTitle.${baseLanguage?.id}`,
        },
    },
});
