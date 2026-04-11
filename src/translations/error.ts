export type LocaleType = 'en' | 'lt' | 'ru';

export const languages = {
    en: {
        disclaimerOr: 'or reach out at ',
        disclaimerQuestion: 'Do you have any questions or need support? ',
        disclaimerSendEmail: process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL,
        disclaimerSubmitForm: 'Submit a contact form ',
        errorMessage: 'There was an error processing your request. Please try again later.',
        link: 'Back to Home',
    },
    lt: {
        disclaimerOr: 'arba susisiekite su mumis adresu ',
        disclaimerQuestion: 'Turite klausimų ar reikia pagalbos? ',
        disclaimerSendEmail: process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL,
        disclaimerSubmitForm: 'Užpildykite kontaktinę formą ',
        errorMessage: 'Apdorojant jūsų užklausą įvyko klaida. Prašome bandyti vėliau.',
        link: 'Grįžti į pagrindinį puslapį',
    },
    ru: {
        disclaimerOr: 'или свяжитесь с нами по ',
        disclaimerQuestion: 'Не получили электронное письмо или есть другие вопросы? ',
        disclaimerSendEmail: process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL,
        disclaimerSubmitForm: 'Отправьте контактную форму ',
        errorMessage: 'При обработке вашего запроса произошла ошибка. Пожалуйста, попробуйте позже.',
        link: 'Вернуться на главную',
    },
};
