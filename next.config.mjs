import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
    dest: 'public',
    disable: process.env.NODE_ENV !== "production",
});

const nextConfig = {
    reactStrictMode: true,
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
