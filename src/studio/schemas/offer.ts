import { defineField, defineType } from 'sanity';

import { baseLanguage } from '../constants';

export default defineType({
    name: 'offer',
    title: 'Offer',
    type: 'document',
    fields: [
        defineField({ name: 'image', title: 'Image', type: 'image' }),
        defineField({ name: 'imageCompressed', title: 'Image Compressed', type: 'image' }),
        defineField({ name: 'title', title: 'Title', type: 'localeString' }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: `title.${baseLanguage?.id}`, maxLength: 96 },
        }),
        defineField({ name: 'longDescription', title: 'Long Description', type: 'localeBlock' }),
        defineField({ name: 'description', title: 'Description', type: 'localeString' }),
        defineField({
            name: 'cards',
            title: 'Cards',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'icon', title: 'Icon', type: 'image' }),
                        defineField({ name: 'title', title: 'Title', type: 'localeString' }),
                    ],
                    preview: {
                        select: {
                            title: `title.${baseLanguage?.id}`,
                            media: 'icon',
                        },
                    },
                },
            ],
        }),
        defineField({ name: 'phoneReservationLink', title: 'Phone Reservation Link', type: 'localeString' }),
        defineField({ name: 'phoneReservationLabel', title: 'Phone Reservation Label', type: 'localeString' }),
        defineField({ name: 'orderRank', title: 'Order rank', type: 'string', hidden: true }),
        defineField({ name: 'isGiftcard', title: 'Giftcard', type: 'boolean' }),
        defineField({
            name: 'giftcardInfo',
            title: 'Giftcard Info',
            hidden: ({ document }) => !document?.isGiftcard,
            type: 'localeBlock',
        }),
        defineField({
            name: 'chips',
            title: 'Chips',
            hidden: ({ document }) => !document?.isGiftcard,
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'label', title: 'Label', type: 'localeString' }),
                        defineField({ name: 'value', title: 'Value', type: 'number' }),
                    ],
                    preview: {
                        select: {
                            title: `label.${baseLanguage?.id}`,
                        },
                    },
                },
            ],
        }),
    ],
    preview: {
        select: {
            title: `title.${baseLanguage?.id}`,
            subtitle: `description.${baseLanguage?.id}`,
            media: 'imageCompressed',
        },
    },
});
