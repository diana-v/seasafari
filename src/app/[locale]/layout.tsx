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
        <div className={inter.variable} data-locale={locale}>
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
        </div>
    );
}
