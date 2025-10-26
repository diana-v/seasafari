import { defineField, defineType } from 'sanity';

import { baseLanguage } from '../constants';

export default defineType({
    name: 'common',
    title: 'Common',
    type: 'document',
    fields: [
        defineField({
            name: 'logo',
            title: 'Logo',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({ name: 'phone', title: 'Phone', type: 'string' }),
        defineField({ name: 'email', title: 'Email', type: 'string' }),
        defineField({ name: 'address', title: 'Address', type: 'localeString' }),
        defineField({
            name: 'companyDetails',
            title: 'Company Details',
            type: 'object',
            fields: [
                defineField({ name: 'name', title: 'Name', type: 'string' }),
                defineField({ name: 'companyCode', title: 'Company Code', type: 'localeString' }),
                defineField({ name: 'address', title: 'Address', type: 'localeString' }),
            ],
        }),
        defineField({
            name: 'socialLinks',
            title: 'Social Links',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'platform', title: 'Platform', type: 'string' }),
                        defineField({ name: 'icon', title: 'Icon', type: 'file' }),
                        defineField({ name: 'link', title: 'Link', type: 'string' }),
                    ],
                    preview: {
                        select: {
                            title: `platform`,
                            subtitle: `link`,
                            media: 'icon',
                        },
                    },
                },
            ],
        }),
        defineField({
            name: 'privacyPolicy',
            title: 'Privacy Policy',
            type: 'object',
            fields: [
                defineField({
                    name: 'slug',
                    title: 'Slug',
                    type: 'slug',
                    options: { source: `label.${baseLanguage?.id}`, maxLength: 96 },
                }),
                defineField({ name: 'content', title: 'Content', type: 'localeBlock' }),
            ],
        }),
        defineField({
            name: 'purchaseRules',
            title: 'Purchase Rules',
            type: 'object',
            fields: [
                defineField({
                    name: 'slug',
                    title: 'Slug',
                    type: 'slug',
                    options: { source: `label.${baseLanguage?.id}`, maxLength: 96 },
                }),
                defineField({ name: 'content', title: 'Content', type: 'localeBlock' }),
            ],
        }),
    ],
    preview: {
        select: {
            logo: 'logo',
        },
        prepare({ logo }) {
            return {
                title: 'Common',
                media: logo,
            };
        },
    },
});
