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
        defineField({
            name: 'image',
            title: 'Image',
            type: 'file',
        }),
        defineField({
            name: 'heroMedia',
            title: 'Hero Media',
            type: 'object',
            fields: [
                defineField({
                    name: 'desktopContent',
                    title: 'Desktop Content Type',
                    type: 'string',
                    options: {
                        list: [
                            { title: 'Image', value: 'image' },
                            { title: 'Video', value: 'video' },
                        ],
                        layout: 'radio',
                        direction: 'horizontal',
                    },
                }),
                defineField({
                    name: 'mobileContent',
                    title: 'Mobile Content Type',
                    type: 'string',
                    options: {
                        list: [
                            { title: 'Image', value: 'image' },
                            { title: 'Video', value: 'video' },
                        ],
                        layout: 'radio',
                        direction: 'horizontal',
                    },
                }),
            ],
        }),
    ],
    preview: {
        select: {
            title: `sectionTitle.${baseLanguage?.id}`,
        },
    },
});
