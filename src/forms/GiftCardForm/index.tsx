import * as React from 'react';
import * as Yup from 'yup';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/router';

import styles from './giftCard.module.scss';
import { AlertComponent, AlertType } from '@/components/Alert/AlertComponent';
import { languages, LocaleType } from '@/forms/GiftCardForm/translations';
import { RadioComponent } from '@/components/Radio/RadioComponent';

interface Values {
    value?: number;
}

interface IAlert {
    message: string;
    type: AlertType;
}

export type ChipType = {
    label: string;
    value: number;
};

export interface GiftCardFormProps {
    chips?: ChipType[];
}

export const GiftCardForm: React.FC<GiftCardFormProps> = ({ chips }) => {
    const { locale, defaultLocale } = useRouter();
    const localisedString = languages[(locale ?? defaultLocale) as LocaleType];
    const [alert, setAlert] = React.useState<IAlert>({ message: '', type: AlertType.Success });

    if (!chips) {
        return null;
    }

    const initialValues: Values = { value: chips[0].value };
    const giftCardSchema = Yup.object().shape({
        value: Yup.number(),
    });

    const handleSubmit = React.useCallback(async ({ value }: Values, { resetForm }: FormikHelpers<Values>) => {
        console.log('pay', value);
    }, []);

    return (
        <div className="flex flex-col gap-2 w-full">
            <Formik initialValues={initialValues} validationSchema={giftCardSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, values, setFieldValue }) => (
                    <Form className={styles.form}>
                        <div className="flex flex-wrap gap-4">
                            {chips.map((chip) => (
                                <Field
                                    as={RadioComponent}
                                    key={chip.value}
                                    item={chip}
                                    checked={chip.value === values.value}
                                    onChange={(value: number) => setFieldValue('value', value)}
                                    disabled={isSubmitting}
                                />
                            ))}
                        </div>

                        <button
                            className={styles.submitButton}
                            type="submit"
                            disabled={isSubmitting}
                            aria-label="Submit form"
                        >
                            {localisedString.submitButton}
                        </button>
                        {alert.message && <AlertComponent color={alert.type} message={alert.message} />}
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default GiftCardForm;
