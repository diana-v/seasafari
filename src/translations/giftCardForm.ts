export type LocaleType = 'en' | 'lt' | 'ru';

export const languages = {
    en: {
        selectAmount: 'Select amount',
        emailDescription: 'Contact information (for gift card delivery)',
        emailLabel: 'Email:',
        emailPlaceholder: 'email@email.com',
        agreeWith: 'I agree with',
        privacyPolicy: 'Privacy Policy',
        purchaseDisclaimer:
            'The gift card will be sent to the email address provided in the form, so please ensure that you have provided the correct email address. You can save or print the e-coupon immediately after purchase.',
        submitButton: 'Pay',
        poweredBy: 'Payment system powered by',
        errorMessage: 'Ooops, something went wrong... Please try again later',
        yup: {
            required: 'Required',
            email: 'Invalid email',
        },
    },
    lt: {
        selectAmount: 'Pasirinkite sumą',
        emailDescription: 'Kontaktinė informacija (dovanų kupono pristatymui)',
        emailLabel: 'El. Paštas:',
        emailPlaceholder: 'pastas@pastas.lt',
        agreeWith: 'Sutinku su',
        privacyPolicy: 'Privatumo Politika',
        purchaseDisclaimer:
            'Dovanų kuponas bus išsiųstas formoje nurodytu el. pašto adresu, tad įsitikinkite, kad el. pašto adresą nurodėte teisingai. E.kuponą galite išsaugoti arba atsispausdinti iškart po pirkimo.',
        submitButton: 'Mokėti',
        poweredBy: 'Mokėjimo sistemą teikia',
        errorMessage: 'Oi, kažkas nutiko... Bandykite vėliau',
        yup: {
            required: 'Privaloma',
            email: 'Neteisingas el. paštas',
        },
    },
    ru: {
        selectAmount: 'Выберите сумму',
        emailDescription: 'Контактная информация (для доставки подарочной карты)',
        emailLabel: 'Эл. почта:',
        emailPlaceholder: 'email@email.com',
        agreeWith: 'Я согласен с',
        privacyPolicy: 'Политикой конфиденциальности',
        purchaseDisclaimer:
            'Подарочный купон будет отправлен на указанный в форме регистрации адрес электронной почты, поэтому убедитесь, что вы указали правильный адрес электронной почты. Вы можете сохранить электронный купон или распечатать его сразу после покупки.',
        submitButton: 'Платить',
        poweredBy: 'Платежная система на базе',
        errorMessage: 'Упс, что-то пошло не так... Пожалуйста, попробуйте позже',
        yup: {
            required: 'Обязательно',
            email: 'Неверный адрес эл. почты',
        },
    },
};
