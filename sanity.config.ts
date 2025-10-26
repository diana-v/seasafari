import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { documentInternationalization } from '@sanity/document-internationalization';
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';

import { schemaTypes } from './src/studio/schemas';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig([
    {
        name: 'production-workspace',
        title: 'production',

        projectId: isProduction ? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID : import.meta.env.SANITY_STUDIO_PROJECT_ID,
        dataset: 'production',
        basePath: '/studio/production',

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
                            orderableDocumentListDeskItem({ type: 'offer', title: 'Offer', S, context }),
                            S.documentTypeListItem('offers'),
                            S.documentTypeListItem('gallery'),
                            orderableDocumentListDeskItem({ type: 'blog', title: 'Blog', S, context }),
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
                supportedLanguages: [
                    { id: 'lt', title: 'Lithuanian' },
                    { id: 'en', title: 'English' },
                    { id: 'ru', title: 'Russian' },
                ],
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
            }),
        ],

        schema: {
            types: schemaTypes,
        },
    },
    {
        name: 'staging-workspace',
        title: 'staging',
        projectId: isProduction ? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID : import.meta.env.SANITY_STUDIO_PROJECT_ID,
        dataset: 'staging',
        basePath: '/studio/staging',
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
                            orderableDocumentListDeskItem({ type: 'offer', title: 'Offer', S, context }),
                            S.documentTypeListItem('offers'),
                            S.documentTypeListItem('gallery'),
                            orderableDocumentListDeskItem({ type: 'blog', title: 'Blog', S, context }),
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
                supportedLanguages: [
                    { id: 'lt', title: 'Lithuanian' },
                    { id: 'en', title: 'English' },
                    { id: 'ru', title: 'Russian' },
                ],
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
            }),
        ],
        schema: {
            types: schemaTypes,
        },
    },
]);
