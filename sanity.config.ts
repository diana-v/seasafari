import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import {documentInternationalization} from '@sanity/document-internationalization'

import { schemaTypes } from './src/studio/schemas';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig([
    {
        name: 'production-workspace',
        title: isProduction ? process.env.NEXT_PUBLIC_SANITY_TITLE : import.meta.env.SANITY_STUDIO_TITLE,

        projectId: isProduction ? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID : import.meta.env.SANITY_STUDIO_PROJECT_ID,
        dataset: isProduction ? process.env.NEXT_PUBLIC_SANITY_DATASET : import.meta.env.SANITY_STUDIO_DATASET,
        basePath: '/studio/production',

        plugins: [
            structureTool(),
            visionTool(),
            documentInternationalization({
                supportedLanguages: [
                    {id: 'lt', title: 'Lithuanian'},
                    {id: 'en', title: 'English'},
                    {id: 'ru', title: 'Russian'}
                ],
                schemaTypes: ['home', 'about', 'contact', 'offer', 'offers', 'gallery', 'faq', 'reviews', 'navigation', 'safety', 'blockContent', 'localeBlock', 'localeString'],
            })
        ],

        schema: {
            types: schemaTypes,
        }
    },
    {
        name: 'staging-workspace',
        title: isProduction ? process.env.NEXT_PUBLIC_SANITY_TITLE : import.meta.env.SANITY_STUDIO_TITLE,
        projectId: isProduction ? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID : import.meta.env.SANITY_STUDIO_PROJECT_ID,
        dataset: isProduction ? process.env.NEXT_PUBLIC_SANITY_DATASET : import.meta.env.SANITY_STUDIO_DATASET,
        basePath: '/studio/staging',
        plugins: [
            structureTool(),
            visionTool(),
            documentInternationalization({
                supportedLanguages: [
                    {id: 'lt', title: 'Lithuanian'},
                    {id: 'en', title: 'English'},
                    {id: 'ru', title: 'Russian'}
                ],
                schemaTypes: ['home', 'about', 'contact', 'offer', 'offers', 'gallery', 'faq', 'reviews', 'navigation', 'safety', 'blockContent', 'localeBlock', 'localeString'],
            })
        ],
        schema: {
            types: schemaTypes,
        },
    }
]);
