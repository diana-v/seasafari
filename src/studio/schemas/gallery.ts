import { defineField, defineType } from 'sanity';

export default defineType({
    fields: [
        defineField({
            name: 'cards',
            of: [
                {
                    fields: [
                        defineField({ name: 'image', title: 'Image', type: 'image' }),
                        defineField({ name: 'url', title: 'Url', type: 'string' }),
                    ],
                    preview: {
                        select: {
                            media: 'image',
                        },
                    },
                    type: 'object',
                },
            ],
            title: 'Cards',
            type: 'array',
        }),
    ],
    name: 'gallery',
    preview: {
        prepare() {
            return {
                title: 'Gallery',
            };
        },
    },
    title: 'Gallery',
    type: 'document',
});
