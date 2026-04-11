import { defineField, defineType } from 'sanity';

import { baseLanguage } from '../constants';

export default defineType({
    fields: [
        defineField({
            name: 'logo',
            options: {
                hotspot: true,
            },
            title: 'Logo',
            type: 'image',
        }),
        defineField({ name: 'phone', title: 'Phone', type: 'string' }),
        defineField({ name: 'email', title: 'Email', type: 'string' }),
        defineField({ name: 'address', title: 'Address', type: 'localeString' }),
        defineField({
            fields: [
                defineField({ name: 'name', title: 'Name', type: 'string' }),
                defineField({ name: 'companyCode', title: 'Company Code', type: 'localeString' }),
                defineField({ name: 'address', title: 'Address', type: 'localeString' }),
            ],
            name: 'companyDetails',
            title: 'Company Details',
            type: 'object',
        }),
        defineField({
            name: 'socialLinks',
            of: [
                {
                    fields: [
                        defineField({ name: 'platform', title: 'Platform', type: 'string' }),
                        defineField({ name: 'icon', title: 'Icon', type: 'file' }),
                        defineField({ name: 'link', title: 'Link', type: 'string' }),
                    ],
                    preview: {
                        select: {
                            media: 'icon',
                            subtitle: `link`,
                            title: `platform`,
                        },
                    },
                    type: 'object',
                },
            ],
            title: 'Social Links',
            type: 'array',
        }),
        defineField({
            fields: [
                defineField({
                    name: 'slug',
                    options: { maxLength: 96, source: `label.${baseLanguage?.id}` },
                    title: 'Slug',
                    type: 'slug',
                }),
                defineField({ name: 'content', title: 'Content', type: 'localeBlock' }),
            ],
            name: 'privacyPolicy',
            title: 'Privacy Policy',
            type: 'object',
        }),
        defineField({
            fields: [
                defineField({
                    name: 'slug',
                    options: { maxLength: 96, source: `label.${baseLanguage?.id}` },
                    title: 'Slug',
                    type: 'slug',
                }),
                defineField({ name: 'content', title: 'Content', type: 'localeBlock' }),
            ],
            name: 'purchaseRules',
            title: 'Purchase Rules',
            type: 'object',
        }),
    ],
    name: 'common',
    preview: {
        prepare({ logo }) {
            return {
                media: logo,
                title: 'Common',
            };
        },
        select: {
            logo: 'logo',
        },
    },
    title: 'Common',
    type: 'document',
});
