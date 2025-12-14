export type LocaleType = 'en' | 'lt' | 'ru';

export const languages = {
    en: {
        paymentFailed: 'Something went wrong',
        paymentFailedDescription: 'Sorry, something went wrong whilst processing your order.',
        link: 'Back to home',
        havingIssues: 'Having issues? Contact us: ',
    },
    lt: {
        paymentFailed: 'Įvyko klaida',
        paymentFailedDescription: 'Atsiprašome, įvyko klaida apdorojant Jūsų užsakymą.',
        link: 'Grįži į pagrindinį puslapį',
        havingIssues: 'Kyla problemų? Susisiekite su mumis: ',
    },
    ru: {
        paymentFailed: 'Что-то пошло не так',
        paymentFailedDescription: 'Извините, во время обработки вашего заказа произошла ошибка.',
        link: 'Вернуться на главную',
        havingIssues: 'Возникли проблемы? Свяжитесь с нами:',
    },
};
