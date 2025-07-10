import * as React from 'react';
import * as Yup from 'yup';
import cn from 'clsx';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/router';

import styles from './contact.module.scss';
import { AlertComponent, AlertType } from '@/components/Alert/AlertComponent';
import { languages, LocaleType } from '@/translations/contactForm';

interface Values {
    name: string;
    from: string;
    message: string;
}

interface IAlert {
    message: string;
    type: AlertType;
}

const ContactForm = () => {
    const { locale, defaultLocale } = useRouter();
    const localisedString = languages[(locale ?? defaultLocale) as LocaleType];
    const [alert, setAlert] = React.useState<IAlert>({ message: '', type: AlertType.Success });
    const initialValues: Values = { name: '', from: '', message: '' };
    const contactSchema = Yup.object().shape({
        name: Yup.string().required(localisedString?.yup?.required),
        from: Yup.string().email(localisedString?.yup?.email).required(localisedString?.yup?.required),
        message: Yup.string()
            .min(2, localisedString?.yup?.minLength)
            .max(900, localisedString?.yup?.maxLength)
            .required(localisedString?.yup?.required),
    });

    const handleSubmit = React.useCallback(
        async ({ name, from, message }: Values, { resetForm }: FormikHelpers<Values>) => {
            await fetch('/api/send-email', {
                body: JSON.stringify({
                    to: process.env.NEXT_PUBLIC_RESEND_TO_EMAIL,
                    from: process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL,
                    subject: `Seasafari užklausa - ${name}`,
                    text: `Vardas: ${name}\n\n El. Paštas: ${from}\n\n Žinutė: ${message}`,
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
            <Formik initialValues={initialValues} validationSchema={contactSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, dirty, touched, errors }) => (
                    <Form className={styles.form}>
                        <div className="flex flex-wrap gap-4">
                            <div className={cn('md:basis-1/3 w-full flex-grow', styles.question)}>
                                <label htmlFor="name">
                                    <p>{localisedString.nameLabel}</p>
                                </label>
                                <div>
                                    <Field
                                        className={cn(styles.field, { [styles.error]: errors.name })}
                                        id="name"
                                        name="name"
                                        placeholder={localisedString.namePlaceholder}
                                        disabled={isSubmitting}
                                    />
                                    {errors.name && touched.name && (
                                        <p className="m-0 text-red-700 text-xs">{errors.name}</p>
                                    )}
                                </div>
                            </div>
                            <div className={cn('md:basis-1/3 w-full flex-grow', styles.question)}>
                                <label htmlFor="from">
                                    <p>{localisedString.emailLabel}</p>
                                </label>
                                <div>
                                    <Field
                                        className={cn(styles.field, { [styles.error]: errors.from })}
                                        id="from"
                                        name="from"
                                        placeholder={localisedString.emailPlaceholder}
                                        disabled={isSubmitting}
                                    />
                                    {errors.from && touched.from && (
                                        <p className="m-0 text-red-700 text-xs">{errors.from}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={styles.question}>
                            <label htmlFor="message">
                                <p>{localisedString.enquiryLabel}</p>
                            </label>
                            <div>
                                <Field
                                    className={cn('resize-none', styles.field, { [styles.error]: errors.message })}
                                    id="message"
                                    name="message"
                                    component="textarea"
                                    rows="4"
                                    placeholder={localisedString.enquiryPlaceholder}
                                    disabled={isSubmitting}
                                />
                                {errors.message && touched.message && (
                                    <p className="m-0 text-red-900 text-xs">{errors.message}</p>
                                )}
                            </div>
                        </div>

                        <button
                            className={styles.submitButton}
                            type="submit"
                            disabled={isSubmitting || !dirty}
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

export default ContactForm;
