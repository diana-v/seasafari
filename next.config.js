const withPWA = require("next-pwa")({
    dest: 'public',
    disable: process.env.NODE_ENV !== "production",
});

/** @type {import('next').NextConfig} */
module.exports = withPWA({
    reactStrictMode: true,
    images: {
        remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }]
    },
    i18n: {
        locales: ['lt', 'en', 'ru'],
        defaultLocale: 'lt',
        localeDetection: false,
    },
    async redirects() {
        return [
            {
                source: '/studio',
                destination: '/studio/structure',
                permanent: true
            }
        ];
    },

    webpack: (config) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
        };

        config.module.rules.push({
                test: /\.svg$/,
                use: ['@svgr/webpack', 'url-loader'],
        })

        return config
    },
});
