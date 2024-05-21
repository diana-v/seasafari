import { defineField, defineType } from 'sanity';

import { baseLanguage } from '../constants';

export default defineType({
    name: 'contact',
    title: 'Contact',
    type: 'document',
    fields: [
        defineField({
            name: 'sectionTitle',
            title: 'Section Title',
            type: 'localeString',
        }),
        defineField({ name: 'title', title: 'Title', type: 'localeString' }),
        defineField({ name: 'description', title: 'Description', type: 'localeBlock' }),
        defineField({
            name: 'socialLinks',
            title: 'Social Links',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'platform', title: 'Platform', type: 'localeString' }),
                        defineField({ name: 'icon', title: 'Icon', type: 'file' }),
                        defineField({ name: 'link', title: 'Link', type: 'localeString' }),
                    ],
                    preview: {
                        select: {
                            title: `platform.${baseLanguage?.id}`,
                            subtitle: `link.${baseLanguage?.id}`,
                            media: 'icon',
                        },
                    },
                },
            ],
        }),
        defineField({
            name: 'address',
            type: 'object',
            fields: [
                defineField({ name: 'title', title: 'Title', type: 'localeString' }),
                defineField({ name: 'value', title: 'Value', type: 'localeString' }),
            ],
        }),
        defineField({
            name: 'email',
            type: 'object',
            fields: [
                defineField({ name: 'title', title: 'Title', type: 'localeString' }),
                defineField({ name: 'value', title: 'Value', type: 'email' }),
            ],
        }),
        defineField({
            name: 'phone',
            type: 'object',
            fields: [
                defineField({ name: 'title', title: 'Title', type: 'localeString' }),
                defineField({ name: 'value', title: 'Value', type: 'localeString' }),
            ],
        }),
        defineField({
            name: 'companyDetails',
            type: 'object',
            fields: [
                defineField({ name: 'title', title: 'Title', type: 'localeString' }),
                defineField({ name: 'name', title: 'Name', type: 'localeString' }),
                defineField({ name: 'companyCode', title: 'Company Code', type: 'localeString' }),
                defineField({ name: 'address', title: 'Address', type: 'localeString' }),
            ],
        }),
        defineField({ name: 'backgroundImage', title: 'Background Image', type: 'image' }),
    ],
    preview: {
        select: {
            title: `sectionTitle.${baseLanguage?.id}`,
        },
    },
});
