import { defineArrayMember, defineType } from 'sanity';

export default defineType({
    name: 'blockContent',
    of: [
        defineArrayMember({
            lists: [{ title: 'Bullet', value: 'bullet' }],
            marks: {
                annotations: [
                    {
                        fields: [
                            {
                                name: 'href',
                                title: 'URL',
                                type: 'url',
                            },
                        ],
                        name: 'link',
                        title: 'URL',
                        type: 'object',
                    },
                ],
                decorators: [
                    { title: 'Strong', value: 'strong' },
                    { title: 'Emphasis', value: 'em' },
                ],
            },
            styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'H1', value: 'h1' },
                { title: 'H2', value: 'h2' },
                { title: 'H3', value: 'h3' },
                { title: 'H4', value: 'h4' },
                { title: 'Quote', value: 'blockquote' },
            ],
            title: 'Block',
            type: 'block',
        }),
        defineArrayMember({
            fields: [
                {
                    name: 'position',
                    options: {
                        layout: 'radio',
                        list: [
                            { title: 'Left', value: 'left' },
                            { title: 'Right', value: 'right' },
                            { title: 'Center', value: 'center' },
                        ],
                    },
                    title: 'Position',
                    type: 'string',
                },
                {
                    name: 'alt',
                    title: 'Alt Text',
                    type: 'string',
                },
            ],
            options: { hotspot: true },
            type: 'image',
        }),
        defineArrayMember({
            fields: [
                {
                    name: 'position',
                    options: {
                        layout: 'radio',
                        list: [
                            { title: 'Left', value: 'left' },
                            { title: 'Right', value: 'right' },
                            { title: 'Center', value: 'center' },
                        ],
                    },
                    title: 'Position',
                    type: 'string',
                },
                {
                    name: 'alt',
                    title: 'Alt Text',
                    type: 'string',
                },
            ],
            options: {
                accept: 'video/mp4',
            },
            title: 'Video',
            type: 'file',
        }),
    ],
    title: 'Block Content',
    type: 'array',
});
