import { Metadata } from 'next';

export const metadata: Metadata = {
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
    },

    icons: {
        apple: '/icons/apple-touch-icon-180x180.png',
        icon: [
            '/icons/favicon-32x32.png',
            '/icons/favicon-16x16.png',
            '/icons/favicon-96x96.png',
        ],
        shortcut: '/favicon.ico',
    },

    manifest: '/manifest.json',

    other: {
        'mobile-web-app-capable': 'yes',
    },

    themeColor: '#FFFFFF',
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
    return (
        <html lang="lt">
            <body>{children}</body>
        </html>
    );
}
