import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
    return (
        // TODO set this from params when update to next 15
        <Html lang={(global as any).__NEXT_DATA__?.locale}>
            <Head>
                {process.env.NODE_ENV === 'production' && (
                    <Script
                        id="usercentrics-cmp"
                        src="https://web.cmp.usercentrics.eu/ui/loader.js"
                        data-ruleset-id="R1yY6ppcoIpJzU"
                        async
                    />
                )}
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="theme-color" content="#FFFFFF" />
                <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon-180x180.png" />
                <link rel="icon" type="image/png" sizes="96x96" href="/icons/favicon-96x96.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
                <link rel="manifest" href="/manifest.json" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <body className="modal">
                <Main />
                {/* Here we will mount our modal portal */}
                <div id="modal" />
                <NextScript />
            </body>
        </Html>
    );
}
