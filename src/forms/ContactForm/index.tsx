'use client';

import cn from 'clsx';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import * as React from 'react';
import * as Yup from 'yup';

import { AlertComponent, AlertType } from '@/components/Alert/AlertComponent';
import { IconComponent } from '@/components/Icon/IconComponent';
import { languages, LocaleType } from '@/translations/contactForm';

interface IAlert {
    message: string;
    type: AlertType;
}

interface Values {
    from: string;
    message: string;
    name: string;
}

const ContactForm = () => {
    const params = useParams();
    const locale = params.locale as string;
    const defaultLocale = 'lt';
    const localisedString = languages[(locale ?? defaultLocale) as LocaleType];
    const [alert, setAlert] = React.useState<IAlert>({ message: '', type: AlertType.Success });
    const initialValues: Values = { from: '', message: '', name: '' };
    const contactSchema = Yup.object().shape({
        from: Yup.string().email(localisedString?.yup?.email).required(localisedString?.yup?.required),
        message: Yup.string()
            .min(2, localisedString?.yup?.minLength)
            .max(900, localisedString?.yup?.maxLength)
            .required(localisedString?.yup?.required),
        name: Yup.string().required(localisedString?.yup?.required),
    });

    const handleSubmit = React.useCallback(
        async ({ from, message, name }: Values, { resetForm }: FormikHelpers<Values>) => {
            await fetch('/api/send-email', {
                body: JSON.stringify({
                    from: process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL,
                    subject: `Seasafari užklausa - ${name}`,
                    text: `Vardas: ${name}\n\n El. Paštas: ${from}\n\n Žinutė: ${message}`,
                    to: process.env.NEXT_PUBLIC_RESEND_TO_EMAIL,
                }),
                method: 'POST',
            }).then((res) => {
                if (res.status === 500) {
                    setAlert({
                        message: localisedString.errorMessage,
                        type: AlertType.Error,
                    });
                }

                if (res.status === 200) {
                    setAlert({ message: localisedString.successMessage, type: AlertType.Success });
                }

                return setTimeout(() => {
                    resetForm();
                    setAlert({ message: '', type: AlertType.Success });
                }, 5000);
            });
        },
        []
    );

    return (
        <div className="flex flex-col gap-2 w-full">
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={contactSchema}>
                {({ dirty, errors, isSubmitting, touched }) => (
                    <Form className="flex flex-col flex-grow gap-4">
                        <div className="flex flex-wrap gap-4">
                            <div className='md:basis-1/3 w-full flex-grow flex flex-col'>
                                <label htmlFor="name">
                                    <p>{localisedString.nameLabel}</p>
                                </label>
                                <div>
                                    <Field
                                        className={cn("rounded border w-full p-2 bg-transparent text-sm md:text-base disabled:text-grey-300 disabled:border-grey-100 disabled:cursor-not-allowed focus-visible:outline-none", { "text-red-900 border-red-900": errors.name })}
                                        disabled={isSubmitting}
                                        id="name"
                                        name="name"
                                        placeholder={localisedString.namePlaceholder}
                                    />
                                    {errors.name && touched.name && (
                                        <p className="m-0 text-red-700 text-xs">{errors.name}</p>
                                    )}
                                </div>
                            </div>
                            <div className='md:basis-1/3 w-full flex-grow flex flex-col'>
                                <label htmlFor="from">
                                    <p>{localisedString.emailLabel}</p>
                                </label>
                                <div>
                                    <Field
                                        className={cn("rounded border w-full p-2 bg-transparent text-sm md:text-base disabled:text-grey-300 disabled:border-grey-100 disabled:cursor-not-allowed focus-visible:outline-none", { "text-red-900 border-red-900": errors.from })}
                                        disabled={isSubmitting}
                                        id="from"
                                        name="from"
                                        placeholder={localisedString.emailPlaceholder}
                                    />
                                    {errors.from && touched.from && (
                                        <p className="m-0 text-red-700 text-xs">{errors.from}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="message">
                                <p>{localisedString.enquiryLabel}</p>
                            </label>
                            <div>
                                <Field
                                    className={cn('resize-none rounded border w-full p-2 bg-transparent text-sm md:text-base disabled:text-grey-300 disabled:border-grey-100 disabled:cursor-not-allowed focus-visible:outline-none', { "text-red-900 border-red-900": errors.message })}
                                    component="textarea"
                                    disabled={isSubmitting}
                                    id="message"
                                    name="message"
                                    placeholder={localisedString.enquiryPlaceholder}
                                    rows="4"
                                />
                                {errors.message && touched.message && (
                                    <p className="m-0 text-red-900 text-xs">{errors.message}</p>
                                )}
                            </div>
                        </div>

                        <button
                            aria-label="Submit form"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-900 rounded-full text-white hover:shadow-xl transition-shadow duration-200 w-full cursor-pointer"
                            disabled={isSubmitting || !dirty}
                            type="submit"
                        >
                            {localisedString.submitButton}
                            <IconComponent className="h-2.5 w-3" name="arrowRightUp" />
                        </button>
                        {alert.message && <AlertComponent color={alert.type} message={alert.message} />}
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ContactForm;
