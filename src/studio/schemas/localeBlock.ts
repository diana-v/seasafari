import { defineType } from 'sanity';

import { supportedLanguages } from '../constants';

export default defineType({
    title: 'Localized Block',
    name: 'localeBlock',
    type: 'object',
    fieldsets: [
        {
            title: 'Translations',
            name: 'translations',
            options: { collapsible: true },
        },
    ],
    fields: supportedLanguages.map((lang) => ({
        title: lang.title,
        name: lang.id,
        type: 'blockContent',
        fieldset: lang.isDefault ? undefined : 'translations',
    })),
});
