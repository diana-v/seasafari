export type LocaleType = 'en' | 'lt' | 'ru';

export const languages = {
    en: {
        logout: 'Logout',
        search: 'Search:',
        searchHelp: '*You can search by email or reference',
        reference: 'Reference',
        amount: 'Amount',
        email: 'Email',
        validFrom: 'Valid from',
        validTo: 'Valid to',
        completed: 'Completed',
        noOrdersFound: 'No Orders found based on search criteria',
        sortError: 'Error filtering orders',
        updateError: 'Error updating order',
    },
    lt: {
        logout: 'Atsijungti',
        search: 'Paieška:',
        searchHelp: '*Galite ieškoti pagal el. paštą arba kupono kodą',
        reference: 'Kodas',
        amount: 'Suma',
        email: 'El. paštas',
        validFrom: 'Galioja nuo',
        validTo: 'Galioja iki',
        completed: 'Užbaigta',
        noOrdersFound: 'Pagal paieškos kriterijus užsakymų nerasta',
        sortError: 'Klaida filtruojant užsakymus',
        updateError: 'Klaida atnaujinant užsakymą',
    },
    ru: {
        logout: 'Выход',
        search: 'Поиск:',
        searchHelp: '*Вы можете искать по электронной почте или ссылке',
        reference: 'Ссылка',
        amount: 'Сумма',
        email: 'Эл. почта',
        validFrom: 'Действует с',
        validTo: 'Действует до',
        completed: 'Завершено',
        noOrdersFound: 'По заданным критериям заказов не найдено',
        sortError: 'Ошибка фильтрации заказов',
        updateError: 'Ошибка при обновлении заказа',
    },
};
