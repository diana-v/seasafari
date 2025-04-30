export type LocaleType = 'en' | 'lt' | 'ru';

export const languages = {
    en: {
        thankYou: 'Thank You!',
        paymentSuccess: 'Payment completed successfully',
        giftCardRef: 'A gift card with reference ',
        giftCardEmail: ' was sent to email: ',
        disclaimerQuestion: "Didn't receive the email or have any other questions? ",
        disclaimerSubmitForm: 'Submit a contact form ',
        disclaimerOr: 'or reach out at ',
        disclaimerSendEmail: process.env.NEXT_PUBLIC_SENDGRID_EMAIL,
        link: 'Back to Home',
    },
    lt: {
        thankYou: 'Ačiū!',
        paymentSuccess: 'Mokėjimas sėkmingai įvykdytas',
        giftCardRef: 'Dovanų kortelė ',
        giftCardEmail: ' buvo išsiųsta į el. pašto adresą: ',
        disclaimerQuestion: 'Negavote el. pašto ar turite kitų klausimų? ',
        disclaimerSubmitForm: 'Užpildykite kontaktinę formą ',
        disclaimerOr: 'arba susisiekite su mumis adresu ',
        disclaimerSendEmail: process.env.NEXT_PUBLIC_SENDGRID_EMAIL,
        link: 'Grįžti į pagrindinį puslapį',
    },
    ru: {
        thankYou: 'Спасибо!',
        paymentSuccess: 'Оплата прошла успешно',
        giftCardRef: 'Подарочная карта с номером ',
        giftCardEmail: ' была отправлена на электронный адрес: ',
        disclaimerQuestion: 'Не получили электронное письмо или есть другие вопросы? ',
        disclaimerSubmitForm: 'Отправьте контактную форму ',
        disclaimerOr: 'или свяжитесь с нами по ',
        disclaimerSendEmail: process.env.NEXT_PUBLIC_SENDGRID_EMAIL,
        link: 'Вернуться на главную',
    },
};
