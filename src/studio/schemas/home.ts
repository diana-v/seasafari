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
            name: 'image',
            title: 'Image',
            type: 'file',
        }),
        defineField({
            description: 'Choose what to show in the hero section. Selecting "Video" will use the locally hosted video file (/videos/1080-video-background.webm + .mp4) — no video upload needed here.',
            fields: [
                defineField({
                    name: 'desktopContent',
                    options: {
                        direction: 'horizontal',
                        layout: 'radio',
                        list: [
                            { title: 'Image', value: 'image' },
                            { title: 'Video (local file)', value: 'video' },
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
                            { title: 'Video (local file)', value: 'video' },
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
