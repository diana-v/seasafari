export const supportedLanguages = [
    { id: 'lt', isDefault: true, title: 'Lithuanian' },
    { id: 'en', title: 'English' },
    { id: 'ru', title: 'Russian' },
];

export const baseLanguage = supportedLanguages.find((l) => l.isDefault);
