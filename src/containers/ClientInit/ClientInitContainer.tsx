'use client';

import { useEffect } from 'react';

import { updateCookieBannerConfig } from '@/containers/CookieConsent/CookieConsentContainer';

export default function ClientInit() {
    useEffect(() => {
        const params = new URLSearchParams(globalThis.location.search);
        const section = params.get('section');

        if (section) {
            const target = document.querySelector(`#${section}`);

            if (target) target.scrollIntoView({ behavior: 'smooth' });
        }

        updateCookieBannerConfig({
            background: { showBackground: true },
            cookieTypes: [
                {
                    description: {
                        en: 'Essential for the website to function correctly.',
                        lt: 'Būtini sklandžiam svetainės veikimui.',
                        ru: 'Необходимы для правильной работы сайта.',
                    },
                    id: 'necessary',
                    name: { en: 'Necessary Cookies', lt: 'Būtinieji slapukai', ru: 'Необходимые файлы cookie' },
                    required: true,
                },
                {
                    description: {
                        en: 'Helps us understand how you use our website.',
                        lt: 'Padeda mums suprasti, kaip naudojatės svetaine.',
                        ru: 'Помогает нам понять, как вы используете сайт.',
                    },
                    id: 'analytics',
                    name: { en: 'Analytics', lt: 'Analitika', ru: 'Аналитика' },
                    required: false,
                },
                {
                    description: {
                        en: 'Used to show you relevant ads.',
                        lt: 'Naudojami rodyti Jums aktualias reklamas.',
                        ru: 'Используются для показа релевантной рекламы.',
                    },
                    id: 'marketing',
                    name: { en: 'Advertising', lt: 'Rinkodara', ru: 'Реклама' },
                    onAccept: function () {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        if (typeof (globalThis as any).loadFacebookPixel === 'function') {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (globalThis as any).loadFacebookPixel();
                        }
                    },
                    required: false,
                },
            ],
            position: { banner: 'bottomRight' },
            text: {
                en: {
                    banner: {
                        acceptAllButtonText: 'Accept all',
                        description: '<p>We use cookies to improve your user experience and analyze website traffic.</p>',
                        preferencesButtonText: 'Preferences',
                        rejectNonEssentialButtonText: 'Reject non-essential',
                    },
                    preferences: {
                        description: '<p>We respect your privacy. You can choose not to allow some types of cookies here.</p>',
                        saveButtonText: 'Save settings',
                        title: 'Cookie Preferences',
                    }
                },
                lt: {
                    banner: {
                        acceptAllButtonText: 'Priimti visus',
                        description: '<p>Siekdami pagerinti Jūsų naršymo patirtį ir analizuoti srautą, svetainėje naudojame slapukus.</p>',
                        preferencesButtonText: 'Nustatymai',
                        rejectNonEssentialButtonText: 'Atmesti nebūtinus',
                    },
                    preferences: {
                        description: '<p>Mes gerbiame Jūsų privatumą. Čia galite pasirinkti, kuriuos slapukus leidžiate naudoti.</p>',
                        saveButtonText: 'Išsaugoti pasirinkimus',
                        title: 'Slapukų nustatymai',
                    }
                },
                ru: {
                    banner: {
                        acceptAllButtonText: 'Принять все',
                        description: '<p>Мы используем файлы cookie для улучшения пользовательского опыта и анализа трафика.</p>',
                        preferencesButtonText: 'Настройки',
                        rejectNonEssentialButtonText: 'Отклонить лишние',
                    },
                    preferences: {
                        description: '<p>Мы уважаем вашу конфиденциальность. Здесь вы можете выбрать, какие файлы cookie разрешить.</p>',
                        saveButtonText: 'Сохранить настройки',
                        title: 'Настройки cookie',
                    }
                }
            },
        });
    }, []);

    return null;
}
