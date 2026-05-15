'use client';

import cn from 'clsx';
import { Field, Form, Formik } from 'formik';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import * as React from 'react';
import * as Yup from 'yup';

import { AlertComponent, AlertType } from '@/components/Alert/AlertComponent';
import { IconComponent } from '@/components/Icon/IconComponent';
import { languages, LocaleType } from '@/translations/giftCardForm';

export interface GiftCardFormProps {
    options?: OptionType[];
}

export interface OptionType {
    label: string;
    value: number;
}

interface IAlert {
    message: string;
    type: AlertType;
}

interface Values {
    agreeToTerms?: boolean;
    email?: string;
    value?: number;
}

export const GiftCardForm: React.FC<GiftCardFormProps> = ({ options }) => {
    const params = useParams();
    const locale = params.locale as string;
    const defaultLocale = 'lt';
    const localisedString = languages[(locale ?? defaultLocale) as LocaleType] || languages['lt'];
    const [alert, setAlert] = React.useState<IAlert>({ message: '', type: AlertType.Success });

    const giftCardSchema = Yup.object().shape({
        agreeToTerms: Yup.boolean().required(localisedString?.yup?.required).isTrue(),
        email: Yup.string().email(localisedString?.yup?.email).required(localisedString?.yup?.required),
        value: Yup.number(),
    });

    const handleSubmit = React.useCallback(
        async ({ email, value }: Values) => {
            await fetch('/api/make-payment', {
                body: JSON.stringify({
                    amount: value?.toString(),
                    email: email,
                    locale: locale,
                    reference: `SEA-${nanoid(8)}`,
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

                    globalThis.location.assign(redirectUrl);
                }

                return;
            });
        },
        [locale, options]
    );

    if (!options?.length) {
        return null;
    }

    const initialValues: Values = { agreeToTerms: false, email: '', value: options[0].value };

    return (
        <div className="flex flex-col gap-2 w-full h-full">
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validateOnMount
                validationSchema={giftCardSchema}
            >
                {({ errors, isSubmitting, touched }) => (
                    <Form className="flex flex-col gap-4 h-full">
                        <div className="flex-grow">
                            <div className="flex flex-col gap-4 divide-y-2 divide-gray-200">
                                <div className="py-4">
                                    <label htmlFor="value">{localisedString.selectAmount}</label>
                                    <Field
                                        as="select"
                                        className={cn('rounded border w-full p-2 bg-transparent text-sm md:text-base disabled:text-grey-300 disabled:border-grey-100 disabled:cursor-not-allowed focus-visible:outline-none w-full')}
                                        disabled={isSubmitting}
                                        id="value"
                                        name="value"
                                    >
                                        {options.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Field>
                                </div>

                                <div className='py-4 w-full flex-grow flex flex-col'>
                                    <p className="font-bold mb-4">{localisedString.emailDescription}</p>
                                    <label htmlFor="email">
                                        <p>{localisedString.emailLabel}</p>
                                    </label>
                                    <div className="mb-4">
                                        <Field
                                            className={cn("rounded border w-full p-2 bg-transparent text-sm md:text-base disabled:text-grey-300 disabled:border-grey-100 disabled:cursor-not-allowed focus-visible:outline-none", {
                                                "text-red-900 border-red-900": touched.email && errors.email,
                                            })}
                                            data-testid="gift-card-email-input"
                                            disabled={isSubmitting}
                                            id="email"
                                            name="email"
                                            placeholder={localisedString.emailPlaceholder}
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
                            <label className="flex flex-wrap items-center gap-x-2">
                                <Field data-testid="gift-card-terms-checkbox" name="agreeToTerms" type="checkbox" />
                                {localisedString.agreeWith}{' '}
                                <Link
                                    aria-label={localisedString.privacyPolicy}
                                    className="underline underline-offset-4"
                                    href="/c/privatumo-politika"
                                    prefetch={false}
                                    target="_blank"
                                >
                                    {localisedString.privacyPolicy}{' '}
                                </Link>
                            </label>
                            <button
                                aria-label="Submit form"
                                className="flex w-full justify-center text-white bg-orange-500 rounded-full items-center gap-2 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                                data-testid="gift-card-submit-button"
                                disabled={isSubmitting}
                                type="submit"
                            >
                                <IconComponent className="w-5 h-5" name="securePayment" />
                                <p>{localisedString.submitButton}</p>
                            </button>

                            <div className="text-center mt-4">
                                <div className="flex items-center justify-center gap-2">
                                    <p>{localisedString.poweredBy}</p>
                                    <IconComponent className="w-24" name="makeCommerce" />
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
