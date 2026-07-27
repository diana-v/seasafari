import { notFound, redirect } from 'next/navigation';
import * as React from 'react';
import { Suspense } from 'react';

import { NavigationContainer } from '@/containers/Navigation/NavigationContainer';
import LoginForm from '@/forms/LoginForm';
import { fetchNavigationData } from '@/schemas/navigation';
import { checkAdminAuth } from '@/utils/checkAdminAuth';

interface PageParams {
    params: Promise<{ locale: string }>;
}

export const dynamic = 'force-dynamic';

const supportedLocales = new Set(['en', 'lt', 'ru']);

export default async function LoginPage({ params }: PageParams) {
    const { locale } = await params;

    if (!supportedLocales.has(locale)) notFound();

    const isAuthenticated = await checkAdminAuth();

    if (isAuthenticated) {
        redirect(`/${locale}/admin`);
    }

    const navigation = await fetchNavigationData(locale, 'lt');

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
