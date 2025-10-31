import React from 'react';
import { Formik, Form, Field } from 'formik';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import cn from 'clsx';

import { AlertComponent, AlertType } from '@/components/Alert/AlertComponent';
import { languages, LocaleType } from '@/translations/loginFrom';
import styles from './loginForm.module.scss';

interface Values {
    username: string;
    password: string;
}

interface IAlert {
    message: string;
    type: AlertType;
}

const LoginForm = () => {
    const { locale, defaultLocale, reload } = useRouter();
    const localisedString = languages[(locale ?? defaultLocale) as LocaleType];
    const [alert, setAlert] = React.useState<IAlert>({ message: '', type: AlertType.Success });
    const initialValues: Values = { username: '', password: '' };
    const loginSchema = Yup.object().shape({
        username: Yup.string().required(localisedString?.yup?.required),
        password: Yup.string().required(localisedString?.yup?.required),
    });

    const handleSubmit = React.useCallback(async ({ username, password }: Values) => {
        await fetch('/api/admin-login', {
            body: JSON.stringify({
                username,
                password,
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
                return reload();
            }

            return;
        });
    }, []);

    return (
        <Formik initialValues={initialValues} validationSchema={loginSchema} onSubmit={handleSubmit}>
            {({ isSubmitting, dirty, touched, errors }) => (
                <Form className="container flex flex-col gap-4 max-w-lg mx-auto py-16">
                    <div>
                        <label htmlFor="username">
                            <p>{localisedString.usernameLabel}</p>
                        </label>
                        <Field
                            type="text"
                            name="username"
                            className={cn(styles.field, { [styles.error]: errors.username })}
                            disabled={isSubmitting}
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
                            type="password"
                            name="password"
                            className={cn(styles.field, { [styles.error]: errors.password })}
                            disabled={isSubmitting}
                        />
                        {errors.password && touched.password && (
                            <p className="m-0 text-red-700 text-xs">{errors.password}</p>
                        )}
                    </div>
                    <button
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-900 rounded-full text-white hover:shadow-xl transition-shadow duration-200 w-full cursor-pointer"
                        type="submit"
                        disabled={isSubmitting || !dirty}
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
