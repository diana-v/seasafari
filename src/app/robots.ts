import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                allow: '/',
                userAgent: [
                    'GPTBot',
                    'ChatGPT-User',
                    'Google-Extended',
                    'PerplexityBot',
                    'Anthropic-ai',
                    'ClaudeBot',
                    'Applebot-Extended',
                ],
            },
            {
                disallow: ['/_next/static/*/[^/]+/*.js'],
                userAgent: '*',
            },
            {
                disallow: '/',
                userAgent: [
                    'SemrushBot',
                    'SEOkicks-Robot',
                    'PRTG Network Monitor',
                    'memoryBot',
                    'BLEXBot',
                    'msnbot',
                    'MJ12bot',
                ],
            },
        ],
        sitemap: 'https://seasafari.lt/sitemap.xml',
    }
}