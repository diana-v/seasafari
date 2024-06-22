import * as React from 'react';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import cn from 'clsx';
import Link from 'next/link';
import { nanoid } from 'nanoid';

import styles from './giftCard.module.scss';
import { AlertComponent, AlertType } from '@/components/Alert/AlertComponent';
import { languages, LocaleType } from '@/translations/giftCardForm';
import { RadioComponent } from '@/components/Radio/RadioComponent';

interface Values {
    value?: number;
    email?: string;
    agreeToTerms?: boolean;
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

    const initialValues: Values = { value: chips[0].value, email: '', agreeToTerms: false };
    const giftCardSchema = Yup.object().shape({
        value: Yup.number(),
        email: Yup.string().email(localisedString?.yup?.email).required(localisedString?.yup?.required),
        agreeToTerms: Yup.boolean().required(localisedString?.yup?.required).isTrue(),
    });

    const handleSubmit = React.useCallback(async ({ value, email }: Values) => {
        await fetch('/api/make-payment', {
            body: JSON.stringify({
                amount: value?.toString(),
                reference: `SEA-${nanoid(8)}`,
                email: email,
                locale: locale,
                count: chips.find((chip) => chip.value === value)?.label.split('-')[0] ?? '',
            }),
            method: 'POST',
        }).then(async (res) => {
            if (res.status === 500) {
                setAlert({
                    message: localisedString.errorMessage,
                    type: AlertType.Error,
                });
            }

            if (res.status === 200) {
                const redirectUrl = await res.text();

                window.location.assign(redirectUrl);
            }

            return;
        });
    }, []);

    return (
        <div className="flex flex-col gap-2 w-full">
            <Formik
                initialValues={initialValues}
                validationSchema={giftCardSchema}
                validateOnMount
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors, touched, isValid, values, setFieldValue }) => (
                    <Form className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4 divide-y-2">
                            <div className="flex flex-wrap gap-4 py-4">
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
                            <div className={cn('py-4 w-full flex-grow', styles.question)}>
                                <h5 className="font-bold mb-4">{localisedString.emailDescription}</h5>
                                <label htmlFor="email">
                                    <p>{localisedString.emailLabel}</p>
                                </label>
                                <div className="mb-4">
                                    <Field
                                        className={cn(styles.field, { [styles.error]: touched.email && errors.email })}
                                        id="email"
                                        name="email"
                                        placeholder={localisedString.emailPlaceholder}
                                        disabled={isSubmitting}
                                    />
                                    {errors.email && touched.email && (
                                        <p className="m-0 text-red-900 text-xs">{errors.email}</p>
                                    )}
                                </div>
                                <span>{localisedString.purchaseDisclaimer}</span>
                            </div>
                        </div>

                        <label className="flex flex-wrap gap-x-2">
                            <Field type="checkbox" name="agreeToTerms" />
                            {localisedString.agreeWith}{' '}
                            <Link target="_blank" className="underline underline-offset-4" href="/c/privatumo-politika">
                                {localisedString.privacyPolicy}{' '}
                            </Link>
                        </label>
                        <button
                            className={styles.submitButton}
                            type="submit"
                            disabled={isSubmitting || !isValid}
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
