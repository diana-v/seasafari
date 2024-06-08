export type LocaleType = 'en' | 'lt' | 'ru';

export const languages = {
    en: {
        usernameLabel: 'Username:',
        passwordLabel: 'Password:',
        loggingIn: 'Logging in...',
        login: 'Login',
        errorMessage: 'Ooops, something went wrong... Please try again later',
        yup: {
            required: 'Required',
        },
    },
    lt: {
        usernameLabel: 'Vartotojo vardas:',
        passwordLabel: 'Slaptažodis:',
        loggingIn: 'Prisijungiama...',
        login: 'Prisijungti',
        errorMessage: 'Oi, kažkas nutiko... Bandykite vėliau',
        yup: {
            required: 'Privaloma',
        },
    },
    ru: {
        usernameLabel: 'Имя пользователя:',
        passwordLabel: 'Пароль:',
        loggingIn: 'Вход...',
        login: 'Войти',
        errorMessage: 'Упс, что-то пошло не так... Пожалуйста, попробуйте позже',
        yup: {
            required: 'Обязательно',
        },
    },
};
