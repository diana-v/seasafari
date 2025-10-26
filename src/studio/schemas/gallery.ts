import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'gallery',
    title: 'Gallery',
    type: 'document',
    fields: [
        defineField({
            name: 'cards',
            title: 'Cards',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'image', title: 'Image', type: 'image' }),
                        defineField({ name: 'url', title: 'Url', type: 'string' }),
                    ],
                    preview: {
                        select: {
                            media: 'image',
                        },
                    },
                },
            ],
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'Gallery',
            };
        },
    },
});
