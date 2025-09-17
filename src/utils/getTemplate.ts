import LtTemplate from '@/templates/lt-template';
import RuTemplate from '@/templates/ru-template';
import EnTemplate from '@/templates/en-template';

export const getTemplate = (
    locale: string,
    ref: string,
    email: string,
    amount: string,
    validFrom: string,
    validTo: string
): string => {
    switch (locale) {
        case 'lt': {
            return LtTemplate(ref, email, amount, validFrom, validTo);
        }
        case 'ru': {
            return RuTemplate(ref, email, amount, validFrom, validTo);
        }
        default: {
            return EnTemplate(ref, email, amount, validFrom, validTo);
        }
    }
};
