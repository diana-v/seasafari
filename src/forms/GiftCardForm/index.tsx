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
import { IconComponent } from '@/components/Icon/IconComponent';

interface Values {
    value?: number;
    email?: string;
    agreeToTerms?: boolean;
}

interface IAlert {
    message: string;
    type: AlertType;
}

export type OptionType = {
    label: string;
    value: number;
};

export interface GiftCardFormProps {
    options?: OptionType[];
}

export const GiftCardForm: React.FC<GiftCardFormProps> = ({ options }) => {
    const { locale, defaultLocale } = useRouter();
    const localisedString = languages[(locale ?? defaultLocale) as LocaleType];
    const [alert, setAlert] = React.useState<IAlert>({ message: '', type: AlertType.Success });

    if (!options?.length) {
        return null;
    }

    const initialValues: Values = { value: options[0].value, email: '', agreeToTerms: false };
    const giftCardSchema = Yup.object().shape({
        value: Yup.number(),
        email: Yup.string().email(localisedString?.yup?.email).required(localisedString?.yup?.required),
        agreeToTerms: Yup.boolean().required(localisedString?.yup?.required).isTrue(),
    });

    const handleSubmit = React.useCallback(
        async ({ value, email }: Values) => {
            await fetch('/api/make-payment', {
                body: JSON.stringify({
                    amount: value?.toString(),
                    reference: `SEA-${nanoid(8)}`,
                    email: email,
                    locale: locale,
                    count: options.find((opt) => opt.value === value)?.label.split('-')[0] ?? '',
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
        },
        [locale, options]
    );

    return (
        <div className="flex flex-col gap-2 w-full h-full">
            <Formik
                initialValues={initialValues}
                validationSchema={giftCardSchema}
                validateOnMount
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors, touched }) => (
                    <Form className="flex flex-col gap-4 h-full">
                        <div className="flex-grow">
                            <div className="flex flex-col gap-4 divide-y-2">
                                <div className="py-4">
                                    <label htmlFor="value">{localisedString.selectAmount}</label>
                                    <Field
                                        as="select"
                                        id="value"
                                        name="value"
                                        className={cn(styles.field, 'w-full')}
                                        disabled={isSubmitting}
                                    >
                                        {options.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Field>
                                </div>

                                <div className={cn('py-4 w-full flex-grow', styles.question)}>
                                    <p className="font-bold mb-4">{localisedString.emailDescription}</p>
                                    <label htmlFor="email">
                                        <p>{localisedString.emailLabel}</p>
                                    </label>
                                    <div className="mb-4">
                                        <Field
                                            className={cn(styles.field, {
                                                [styles.error]: touched.email && errors.email,
                                            })}
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
                        </div>

                        <div className="mt-auto">
                            <label className="flex flex-wrap gap-x-2">
                                <Field type="checkbox" name="agreeToTerms" />
                                {localisedString.agreeWith}{' '}
                                <Link
                                    target="_blank"
                                    className="underline underline-offset-4"
                                    aria-label={localisedString.privacyPolicy}
                                    href="/c/privatumo-politika"
                                >
                                    {localisedString.privacyPolicy}{' '}
                                </Link>
                            </label>
                            <button
                                className="flex w-full justify-center text-white bg-orange-500 rounded-full items-center gap-2 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                                type="submit"
                                disabled={isSubmitting}
                                aria-label="Submit form"
                            >
                                <IconComponent name="securePayment" className="w-5 h-5" />
                                <p>{localisedString.submitButton}</p>
                            </button>

                            <div className="text-center mt-4">
                                <div className="flex items-center justify-center gap-2">
                                    <p>{localisedString.poweredBy}</p>
                                    <IconComponent name="makeCommerce" className="w-24" />
                                </div>
                            </div>
                        </div>

                        {alert.message && <AlertComponent color={alert.type} message={alert.message} />}
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default GiftCardForm;
