import { Inter } from 'next/font/google';
import Script from 'next/script';

import ClientInitContainer from '@/containers/ClientInit/ClientInitContainer';

import '../../styles/globals.css';

const inter = Inter({
    display: 'swap',
    subsets: ['latin'],
    variable: '--font-inter',
});

export default async function RootLayout({
     children,
     params,
 }: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <html className={inter.variable} lang={locale}>
            <head>
                <meta content="default" name="apple-mobile-web-app-status-bar-style" />
                <meta content="yes" name="mobile-web-app-capable" />
                <meta content="#FFFFFF" name="theme-color" />
                <link href="/icons/favicon.ico" rel="icon" sizes="any" />
                <link href="/icons/apple-touch-icon-180x180.png" rel="apple-touch-icon" sizes="180x180" />
                <link href="/icons/favicon-96x96.png" rel="icon" sizes="96x96" type="image/png" />
                <link href="/icons/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
                <link href="/icons/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
                <link href="/manifest.json" rel="manifest" />
            </head>
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
