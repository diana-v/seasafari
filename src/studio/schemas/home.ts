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
            name: 'subtitle',
            title: 'Subtitle',
            type: 'localeString',
        }),
        defineField({
            fields: [
                defineField({
                    name: 'label',
                    title: 'Label',
                    type: 'localeString',
                }),
                defineField({
                    name: 'link',
                    title: 'Link',
                    type: 'localeString',
                }),
            ],
            name: 'cta',
            title: 'CTA',
            type: 'object',
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
            fields: [
                defineField({
                    name: 'desktopContent',
                    options: {
                        direction: 'horizontal',
                        layout: 'radio',
                        list: [
                            { title: 'Image', value: 'image' },
                            { title: 'Video', value: 'video' },
                        ],
                    },
                    title: 'Desktop Content Type',
                    type: 'string',
                }),
                defineField({
                    name: 'mobileContent',
                    options: {
                        direction: 'horizontal',
                        layout: 'radio',
                        list: [
                            { title: 'Image', value: 'image' },
                            { title: 'Video', value: 'video' },
                        ],
                    },
                    title: 'Mobile Content Type',
                    type: 'string',
                }),
            ],
            name: 'heroMedia',
            title: 'Hero Media',
            type: 'object',
        }),
    ],
    name: 'home',
    preview: {
        select: {
            subtitle: `subtitle.${baseLanguage?.id}`,
            title: `title.${baseLanguage?.id}`,
        },
    },
    title: 'Home',
    type: 'document',
});
