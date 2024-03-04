import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="theme-color" content="#FFFFFF" />
                <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-icon-180x180.png" />
                <link rel="icon" type="image/png" sizes="96x96" href="/icons/favicon-96x96.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
                <link rel="manifest" href="/manifest.json" />
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
