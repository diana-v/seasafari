import '@/styles/main.scss';
import '@/containers/CookieConsent/cookieConsentContainer.scss';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import Script from 'next/script';

import { updateCookieBannerConfig } from '@/containers/CookieConsent/CookieConsentContainer';

declare global {
    interface Window {
        loadFacebookPixel?: () => void;
        fbq?: any;
    }
}

export default function App({ Component, pageProps }: AppProps) {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const section = params.get('section');

        if (section) {
            const target = document.querySelector(`#${section}`);

            if (target) target.scrollIntoView({ behavior: 'smooth' });
        }

        updateCookieBannerConfig({
            text: {
                en: {
                    banner: {
                        description:
                            '<p>We use cookies to improve your user experience and analyze website traffic.</p>',
                        acceptAllButtonText: 'Accept all',
                        rejectNonEssentialButtonText: 'Reject non-essential',
                        preferencesButtonText: 'Preferences',
                    },
                    preferences: {
                        title: 'Cookie Preferences',
                        description:
                            '<p>We respect your privacy. You can choose not to allow some types of cookies here.</p>',
                        saveButtonText: 'Save settings',
                    },
                },
                lt: {
                    banner: {
                        description:
                            '<p>Siekdami pagerinti Jūsų naršymo patirtį ir analizuoti srautą, svetainėje naudojame slapukus.</p>',
                        acceptAllButtonText: 'Priimti visus',
                        rejectNonEssentialButtonText: 'Atmesti nebūtinus',
                        preferencesButtonText: 'Nustatymai',
                    },
                    preferences: {
                        title: 'Slapukų nustatymai',
                        description:
                            '<p>Mes gerbiame Jūsų privatumą. Čia galite pasirinkti, kuriuos slapukus leidžiate naudoti.</p>',
                        saveButtonText: 'Išsaugoti pasirinkimus',
                    },
                },
                ru: {
                    banner: {
                        description:
                            '<p>Мы используем файлы cookie для улучшения пользовательского опыта и анализа трафика.</p>',
                        acceptAllButtonText: 'Принять все',
                        rejectNonEssentialButtonText: 'Отклонить лишние',
                        preferencesButtonText: 'Настройки',
                    },
                    preferences: {
                        title: 'Настройки cookie',
                        description:
                            '<p>Мы уважаем вашу конфиденциальность. Здесь вы можете выбрать, какие файлы cookie разрешить.</p>',
                        saveButtonText: 'Сохранить настройки',
                    },
                },
            },
            background: { showBackground: true },
            cookieTypes: [
                {
                    id: 'necessary',
                    required: true,
                    name: {
                        en: 'Necessary Cookies',
                        lt: 'Būtinieji slapukai',
                        ru: 'Необходимые файлы cookie',
                    },
                    description: {
                        en: 'Essential for the website to function correctly.',
                        lt: 'Būtini sklandžiam svetainės veikimui.',
                        ru: 'Необходимы для правильной работы сайта.',
                    },
                },
                {
                    id: 'analytics',
                    required: false,
                    name: { en: 'Analytics', lt: 'Analitika', ru: 'Аналитика' },
                    description: {
                        en: 'Helps us understand how you use our website.',
                        lt: 'Padeda mums suprasti, kaip naudojatės svetaine.',
                        ru: 'Помогает нам понять, как вы используете сайт.',
                    },
                    onAccept: () => {
                        /* Load GA if needed */
                    },
                },
                {
                    id: 'marketing',
                    required: false,
                    name: { en: 'Advertising', lt: 'Rinkodara', ru: 'Реклама' },
                    description: {
                        en: 'Used to show you relevant ads.',
                        lt: 'Naudojami rodyti Jums aktualias reklamas.',
                        ru: 'Используются для показа релевантной рекламы.',
                    },
                    onAccept: function () {
                        if (typeof window.loadFacebookPixel === 'function') {
                            window.loadFacebookPixel();
                        }
                    },
                },
            ],
            position: { banner: 'bottomRight' },
        });
    }, []);

    return (
        <>
            <Script
                id="fb-pixel-definition"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.loadFacebookPixel = function() {
                            if(window.fbq) return; 
                            console.log('Consent granted: Loading Facebook Pixel');
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
