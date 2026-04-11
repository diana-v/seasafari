import { createClient } from '@sanity/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import * as React from 'react';

import { NavigationContainer } from '@/containers/Navigation/NavigationContainer';
import LoginForm from '@/forms/LoginForm';
import { fetchNavigationData } from '@/schemas/navigation';

const client = createClient({
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
    dataset: process.env.SANITY_STUDIO_DATASET,
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    useCdn: false,
});

interface PageParams {
    params: Promise<{ locale: string }>;
}

export default async function LoginPage({ params }: PageParams) {
    const { locale } = await params;

    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.has('auth');

    if (isAuthenticated) {
        redirect(`/${locale}/admin`);
    }

    const navigation = await fetchNavigationData(client, locale, 'lt');

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <NavigationContainer
                isSimple
                logo={navigation?.logo}
                phone={navigation?.phone}
            />

            <main className="flex-grow flex items-center justify-center p-4">
                <LoginForm />
            </main>
        </div>
    );
}
