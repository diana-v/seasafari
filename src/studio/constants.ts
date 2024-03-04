export const supportedLanguages = [
    { id: 'lt', title: 'Lithuanian', isDefault: true },
    { id: 'en', title: 'English' },
    { id: 'ru', title: 'Russian' },
];

export const baseLanguage = supportedLanguages.find((l) => l.isDefault);
