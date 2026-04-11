import { defineType } from 'sanity';

import { supportedLanguages } from '../constants';

export default defineType({
    fields: supportedLanguages.map((locale) => ({
        fieldset: locale.isDefault ? undefined : 'translations',
        name: locale.id,
        title: locale.title,
        type: 'string',
    })),
    fieldsets: [
        {
            name: 'translations',
            options: { collapsible: true },
            title: 'Translations',
        },
    ],
    name: 'localeString',
    title: 'Localized string',
    type: 'object',
});
