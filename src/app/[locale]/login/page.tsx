import { createClient } from '@sanity/client';
import { redirect } from 'next/navigation';
import * as React from 'react';
import { Suspense } from 'react';

import { NavigationContainer } from '@/containers/Navigation/NavigationContainer';
import LoginForm from '@/forms/LoginForm';
import { fetchNavigationData } from '@/schemas/navigation';
import { checkAdminAuth } from '@/utils/checkAdminAuth';

const client = createClient({
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
    dataset: process.env.SANITY_STUDIO_DATASET,
    maxRetries: 3,
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    retryDelay: (attempt) => attempt * 1000,
    useCdn: true,
});

interface PageParams {
    params: Promise<{ locale: string }>;
}

export default async function LoginPage({ params }: PageParams) {
    const { locale } = await params;
    const isAuthenticated = await checkAdminAuth();

    if (isAuthenticated) {
        redirect(`/${locale}/admin`);
    }

    const navigation = await fetchNavigationData(client, locale, 'lt');

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Suspense fallback={<div className="h-24" />}>
                <NavigationContainer
                    isSimple
                    logo={navigation?.logo}
                    phone={navigation?.phone}
                />
            </Suspense>

            <main className="flex-grow flex items-center justify-center p-4">
                <LoginForm />
            </main>
        </div>
    );
}
