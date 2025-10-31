import LtTemplate from '@/templates/lt-template';
import RuTemplate from '@/templates/ru-template';
import EnTemplate from '@/templates/en-template';

export const getTemplate = (
    locale: string,
    ref: string,
    email: string,
    amount: string,
    validFrom: Date,
    validTo: Date
): string => {
    const formattedValidFrom = validFrom.toISOString().split('T')[0];
    const formattedValidTo = validTo.toISOString().split('T')[0];

    switch (locale) {
        case 'lt': {
            return LtTemplate(ref, email, amount, formattedValidFrom, formattedValidTo);
        }
        case 'ru': {
            return RuTemplate(ref, email, amount, formattedValidFrom, formattedValidTo);
        }
        default: {
            return EnTemplate(ref, email, amount, formattedValidFrom, formattedValidTo);
        }
    }
};
