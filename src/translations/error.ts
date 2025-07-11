export type LocaleType = 'en' | 'lt' | 'ru';

export const languages = {
    en: {
        errorMessage: 'There was an error processing your request. Please try again later.',
        disclaimerQuestion: 'Do you have any questions or need support? ',
        disclaimerSubmitForm: 'Submit a contact form ',
        disclaimerOr: 'or reach out at ',
        disclaimerSendEmail: process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL,
        link: 'Back to Home',
    },
    lt: {
        errorMessage: 'Apdorojant jūsų užklausą įvyko klaida. Prašome bandyti vėliau.',
        disclaimerQuestion: 'Turite klausimų ar reikia pagalbos? ',
        disclaimerSubmitForm: 'Užpildykite kontaktinę formą ',
        disclaimerOr: 'arba susisiekite su mumis adresu ',
        disclaimerSendEmail: process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL,
        link: 'Grįžti į pagrindinį puslapį',
    },
    ru: {
        errorMessage: 'При обработке вашего запроса произошла ошибка. Пожалуйста, попробуйте позже.',
        disclaimerQuestion: 'Не получили электронное письмо или есть другие вопросы? ',
        disclaimerSubmitForm: 'Отправьте контактную форму ',
        disclaimerOr: 'или свяжитесь с нами по ',
        disclaimerSendEmail: process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL,
        link: 'Вернуться на главную',
    },
};
