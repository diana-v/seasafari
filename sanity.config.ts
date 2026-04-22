import { documentInternationalization } from '@sanity/document-internationalization';
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import { schemaTypes } from './src/studio/schemas';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig([
    {
        basePath: '/studio/production',
        dataset: 'production',

        name: 'production-workspace',
        plugins: [
            structureTool({
                structure: (S, context) => {
                    return S.list()
                        .title('Content')
                        .items([
                            S.documentTypeListItem('home'),
                            S.documentTypeListItem('giftCard'),
                            S.documentTypeListItem('giftCardWidget'),
                            S.documentTypeListItem('about'),
                            S.documentTypeListItem('contact'),
                            orderableDocumentListDeskItem({ context, S, title: 'Offer', type: 'offer' }),
                            S.documentTypeListItem('offers'),
                            S.documentTypeListItem('gallery'),
                            orderableDocumentListDeskItem({ context, S, title: 'Blog', type: 'blog' }),
                            S.documentTypeListItem('blogs'),
                            S.documentTypeListItem('faq'),
                            S.documentTypeListItem('reviews'),
                            S.documentTypeListItem('common'),
                            S.documentTypeListItem('partners'),
                        ]);
                },
            }),
            visionTool(),
            documentInternationalization({
                schemaTypes: [
                    'home',
                    'giftCard',
                    'giftCardWidget',
                    'about',
                    'contact',
                    'offer',
                    'offers',
                    'gallery',
                    'blog',
                    'blogs',
                    'faq',
                    'reviews',
                    'blockContent',
                    'localeBlock',
                    'localeString',
                    'common',
                    'partners',
                ],
                supportedLanguages: [
                    { id: 'lt', title: 'Lithuanian' },
                    { id: 'en', title: 'English' },
                    { id: 'ru', title: 'Russian' },
                ],
            }),
        ],
        projectId: isProduction ? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID : import.meta.env.SANITY_STUDIO_PROJECT_ID,

        schema: {
            types: schemaTypes,
        },

        title: 'production',
    },
    {
        basePath: '/studio/staging',
        dataset: 'staging',
        name: 'staging-workspace',
        plugins: [
            structureTool({
                structure: (S, context) => {
                    return S.list()
                        .title('Content')
                        .items([
                            S.documentTypeListItem('home'),
                            S.documentTypeListItem('giftCard'),
                            S.documentTypeListItem('giftCardWidget'),
                            S.documentTypeListItem('about'),
                            S.documentTypeListItem('contact'),
                            orderableDocumentListDeskItem({ context, S, title: 'Offer', type: 'offer' }),
                            S.documentTypeListItem('offers'),
                            S.documentTypeListItem('gallery'),
                            orderableDocumentListDeskItem({ context, S, title: 'Blog', type: 'blog' }),
                            S.documentTypeListItem('blogs'),
                            S.documentTypeListItem('faq'),
                            S.documentTypeListItem('reviews'),
                            S.documentTypeListItem('common'),
                            S.documentTypeListItem('partners'),
                        ]);
                },
            }),
            visionTool(),
            documentInternationalization({
                schemaTypes: [
                    'home',
                    'giftCard',
                    'giftCardWidget',
                    'about',
                    'contact',
                    'offer',
                    'offers',
                    'gallery',
                    'blogs',
                    'blog',
                    'faq',
                    'reviews',
                    'blockContent',
                    'localeBlock',
                    'localeString',
                    'common',
                    'partners',
                ],
                supportedLanguages: [
                    { id: 'lt', title: 'Lithuanian' },
                    { id: 'en', title: 'English' },
                    { id: 'ru', title: 'Russian' },
                ],
            }),
        ],
        projectId: isProduction ? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID : import.meta.env.SANITY_STUDIO_PROJECT_ID,
        schema: {
            types: schemaTypes,
        },
        title: 'staging',
    },
]);
