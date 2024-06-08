import * as React from 'react';
import { GetServerSideProps } from 'next';
import { createClient } from '@sanity/client';
import Cookies from 'cookies';

import { NavigationContainer, NavigationProps } from '@/containers/Navigation/NavigationContainer';
import { fetchHeaderData } from '@/schemas/navigation';
import LoginForm from '@/forms/LoginForm';

interface PageProps {
    navigation: NavigationProps;
}

export const Login = ({ navigation }: PageProps) => {
    return (
        <>
            <NavigationContainer logo={navigation.logo} sections={navigation.sections} />
            <LoginForm />
        </>
    );
};

const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
    useCdn: false,
});

export const getServerSideProps: GetServerSideProps = async ({ locale, defaultLocale, req, res }) => {
    const cookies = new Cookies(req, res);
    const isAuthenticated = cookies.get('auth');

    if (isAuthenticated) {
        return {
            redirect: {
                destination: '/admin',
                permanent: false,
            },
        };
    }

    const navigation = await fetchHeaderData(client, locale, defaultLocale);

    return {
        props: {
            navigation,
        },
    };
};

export default Login;
