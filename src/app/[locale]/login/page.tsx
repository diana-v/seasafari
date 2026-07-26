import { redirect } from 'next/navigation';
import * as React from 'react';
import { Suspense } from 'react';

import { NavigationContainer } from '@/containers/Navigation/NavigationContainer';
import LoginForm from '@/forms/LoginForm';
import { fetchNavigationData } from '@/schemas/navigation';
import { checkAdminAuth } from '@/utils/checkAdminAuth';

interface PageParams {
    params: Promise<{ locale: string }>;
}

export default function LoginPage({ params }: PageParams) {
    return (
        <Suspense>
            <LoginPageContent params={params} />
        </Suspense>
    );
}

async function LoginPageContent({ params }: PageParams) {
    const { locale } = await params;
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
