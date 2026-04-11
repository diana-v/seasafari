import { defineField, defineType } from 'sanity';

import { baseLanguage } from '../constants';

export default defineType({
    fields: [
        defineField({ name: 'image', title: 'Image', type: 'image' }),
        defineField({ name: 'imageCompressed', title: 'Image Compressed', type: 'image' }),
        defineField({ name: 'title', title: 'Title', type: 'localeString' }),
        defineField({
            name: 'slug',
            options: { maxLength: 96, source: `title.${baseLanguage?.id}` },
            title: 'Slug',
            type: 'slug',
        }),
        defineField({ name: 'linkTitle', title: 'Link Title', type: 'localeString' }),
        defineField({ name: 'longDescription', title: 'Long Description', type: 'localeBlock' }),
        defineField({ name: 'description', title: 'Description', type: 'localeString' }),
        defineField({
            name: 'cards',
            of: [
                {
                    fields: [
                        defineField({ name: 'icon', title: 'Icon', type: 'image' }),
                        defineField({ name: 'title', title: 'Title', type: 'localeString' }),
                    ],
                    preview: {
                        select: {
                            media: 'icon',
                            title: `title.${baseLanguage?.id}`,
                        },
                    },
                    type: 'object',
                },
            ],
            title: 'Cards',
            type: 'array',
        }),
        defineField({ name: 'phoneReservationLink', title: 'Phone Reservation Link', type: 'localeString' }),
        defineField({ name: 'phoneReservationLabel', title: 'Phone Reservation Label', type: 'localeString' }),
        defineField({ hidden: true, name: 'orderRank', title: 'Order rank', type: 'string' }),
    ],
    name: 'offer',
    preview: {
        select: {
            media: 'imageCompressed',
            subtitle: `description.${baseLanguage?.id}`,
            title: `title.${baseLanguage?.id}`,
        },
    },
    title: 'Offer',
    type: 'document',
});
