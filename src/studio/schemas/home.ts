import { defineField, defineType } from 'sanity';

import { baseLanguage } from '../constants';

export default defineType({
    name: 'home',
    title: 'Home',
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
            name: 'videoWebm',
            title: 'Video webm',
            type: 'file',
        }),
        defineField({
            name: 'videoMp4',
            title: 'Video mp4',
            type: 'file',
        }),
    ],
    preview: {
        select: {
            title: `sectionTitle.${baseLanguage?.id}`,
        },
    },
});
