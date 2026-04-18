import withPWAInit from "next-pwa";

const domain = process.env.NEXT_PUBLIC_DOMAIN ?? 'http://127.0.0.1:3000';

const withPWA = withPWAInit({
    dest: 'public',
    disable: process.env.NODE_ENV !== "production",
});

const nextConfig = {
    reactStrictMode: true,
    allowedDevOrigins: [
        new URL(domain).host,
        '127.0.0.1'
    ],
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'cdn.sanity.io' },
            { protocol: 'https', hostname: 'lh3.googleusercontent.com' }
        ],
    },
    async redirects() {
        return [
            {
                source: '/studio',
                destination: `/studio/${process.env.NEXT_PUBLIC_SANITY_DATASET}/structure`,
                permanent: true,
            },
        ];
    },
    turbopack: {
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js',
            },
        },
    },
};

export default withPWA(nextConfig);
