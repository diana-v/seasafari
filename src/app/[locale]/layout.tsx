import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';

import '../../styles/globals.css';
import Script from 'next/script';

import ClientInitContainer from '@/containers/ClientInit/ClientInitContainer';

const inter = Inter({
    display: 'swap',
    subsets: ['latin'],
    variable: '--font-inter',
});

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
    }
};

export async function generateStaticParams() {
    return [{ locale: 'en' }, { locale: 'lt' }, { locale: 'ru' }];
}

export const dynamicParams = false;

export default async function RootLayout({
     children,
     params,
 }: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    const supportedLocales = ['en', 'lt', 'ru'];

    if (!supportedLocales.includes(locale)) {
        notFound();
    }

    return (
        <html className={inter.variable} data-locale={locale}>
            <body className="modal">
                <ClientInitContainer />

                <Script
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.loadFacebookPixel = function() {
                                if(window.fbq) return; 
                                !function(f,b,e,v,n,t,s)
                                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                                n.queue=[];t=b.createElement(e);t.async=!0;
                                t.src=v;s=b.getElementsByTagName(e)[0];
                                s.parentNode.insertBefore(t,s)}(window, document,'script',
                                'https://connect.facebook.net/en_US/fbevents.js');
                                fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
                                fbq('track', 'PageView');
                            }
                        `,
                    }}
                    id="fb-pixel-definition"
                    strategy="afterInteractive"
                />
                <noscript>
                    <img
                        alt=""
                        height="1"
                        src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`}
                        style={{ display: 'none' }}
                        width="1"
                    />
                </noscript>

                <div id="app-root">
                    {children}
                </div>

                <div id="modal" />
            </body>
        </html>
    );
}
