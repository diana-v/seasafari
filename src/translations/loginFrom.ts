export type LocaleType = 'en' | 'lt' | 'ru';

export const languages = {
    en: {
        errorMessage: 'Ooops, something went wrong... Please try again later',
        loggingIn: 'Logging in...',
        login: 'Login',
        passwordLabel: 'Password:',
        usernameLabel: 'Username:',
        yup: {
            required: 'Required',
        },
    },
    lt: {
        errorMessage: 'Oi, kažkas nutiko... Bandykite vėliau',
        loggingIn: 'Prisijungiama...',
        login: 'Prisijungti',
        passwordLabel: 'Slaptažodis:',
        usernameLabel: 'Vartotojo vardas:',
        yup: {
            required: 'Privaloma',
        },
    },
    ru: {
        errorMessage: 'Упс, что-то пошло не так... Пожалуйста, попробуйте позже',
        loggingIn: 'Вход...',
        login: 'Войти',
        passwordLabel: 'Пароль:',
        usernameLabel: 'Имя пользователя:',
        yup: {
            required: 'Обязательно',
        },
    },
};
