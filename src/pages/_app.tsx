import '@/styles/main.scss';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import Script from 'next/script';
import Image from 'next/image';

export default function App({ Component, pageProps }: AppProps) {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const section = params.get('section');

        if (section) {
            const target = document.querySelector(`#${section}`);

            if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    return (
        <>
            <Script
                type="text/plain"
                data-usercentrics="Facebook Pixel"
                id="meta-pixel"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `!function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
                    fbq('track', 'PageView');`,
                }}
            />
            <noscript>
                <img
                    height="1"
                    width="1"
                    style={{ display: 'none' }}
                    src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`}
                    alt=""
                />
            </noscript>
            <div id="app-root">
                <Component {...pageProps} />
            </div>
        </>
    );
}
