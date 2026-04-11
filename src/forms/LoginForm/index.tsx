'use client';

import cn from 'clsx';
import { Field, Form, Formik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import * as Yup from 'yup';

import { AlertComponent, AlertType } from '@/components/Alert/AlertComponent';
import { languages, LocaleType } from '@/translations/loginFrom';

interface IAlert {
    message: string;
    type: AlertType;
}

interface Values {
    password: string;
    username: string;
}

const LoginForm = () => {
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;
    const defaultLocale = 'lt';
    const localisedString = languages[(locale ?? defaultLocale) as LocaleType];
    const [alert, setAlert] = React.useState<IAlert>({ message: '', type: AlertType.Success });
    const initialValues: Values = { password: '', username: '' };
    const loginSchema = Yup.object().shape({
        password: Yup.string().required(localisedString?.yup?.required),
        username: Yup.string().required(localisedString?.yup?.required),
    });

    const handleSubmit = React.useCallback(async ({ password, username }: Values) => {
        await fetch('/api/admin-login', {
            body: JSON.stringify({
                password,
                username,
            }),
            method: 'POST',
        }).then((res) => {
            if (res.status === 500) {
                setAlert({
                    message: localisedString.errorMessage,
                    type: AlertType.Error,
                });

                return;
            }

            if (res.status === 200) {
                router.refresh();

                return;
            }

            return;
        });
    }, []);

    return (
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={loginSchema}>
            {({ dirty, errors, isSubmitting, touched }) => (
                <Form className="container flex flex-col gap-4 max-w-lg mx-auto py-16">
                    <div>
                        <label htmlFor="username">
                            <p>{localisedString.usernameLabel}</p>
                        </label>
                        <Field
                            className={cn("rounded border w-full p-2 bg-transparent text-sm md:text-base disabled:text-grey-300 disabled:border-grey-100 disabled:cursor-not-allowed focus-visible:outline-none", { "text-red-900 border-red-900": errors.username })}
                            disabled={isSubmitting}
                            name="username"
                            type="text"
                        />
                        {errors.username && touched.username && (
                            <p className="m-0 text-red-700 text-xs">{errors.username}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="password">
                            <p>{localisedString.passwordLabel}</p>
                        </label>
                        <Field
                            className={cn("rounded border w-full p-2 bg-transparent text-sm md:text-base disabled:text-grey-300 disabled:border-grey-100 disabled:cursor-not-allowed focus-visible:outline-none", { "text-red-900 border-red-900": errors.password })}
                            disabled={isSubmitting}
                            name="password"
                            type="password"
                        />
                        {errors.password && touched.password && (
                            <p className="m-0 text-red-700 text-xs">{errors.password}</p>
                        )}
                    </div>
                    <button
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-900 rounded-full text-white hover:shadow-xl transition-shadow duration-200 w-full cursor-pointer"
                        disabled={isSubmitting || !dirty}
                        type="submit"
                    >
                        {isSubmitting ? localisedString.loggingIn : localisedString.login}
                    </button>
                    {alert.message && <AlertComponent color={alert.type} message={alert.message} />}
                </Form>
            )}
        </Formik>
    );
};

export default LoginForm;
