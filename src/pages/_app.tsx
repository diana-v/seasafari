import '@/styles/main.scss';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const section = params.get('section');

        if (section) {
            const target = document.querySelector(`#${section}`);

            if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    return <Component {...pageProps} />;
}
