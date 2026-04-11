'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';

import { IconComponent } from '@/components/Icon/IconComponent';
import { languages, LocaleType } from '@/translations/pending';

const MAX_RETRIES = 15;
const POLL_INTERVAL = 4000;

export default function PaymentPendingClient({ locale }: { locale: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const localisedString = languages[locale as LocaleType] || languages['lt'];

    const attempts = React.useRef(0);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
        const orderRef = searchParams.get('ref') ||
            searchParams.get('order_id') ||
            searchParams.get('payment_intent');

        if (!orderRef) return;

        const checkStatus = async () => {
            try {
                const res = await fetch(`/api/check-status?ref=${orderRef}`);
                const data = await res.json();

                if (res.ok && data.paid) {
                    router.push(`/${locale}/success?ref=${orderRef}`);

                    return;
                }

                if (data.status === 'failed' || data.status === 'declined') {
                    router.push(`/${locale}/failed`);

                    return;
                }

                if (attempts.current < MAX_RETRIES) {
                    attempts.current += 1;
                    timeoutRef.current = setTimeout(checkStatus, POLL_INTERVAL);
                } else {
                    router.push(`/${locale}/failed`);
                }
            } catch (error) {
                console.error("Polling error:", error);
                if (attempts.current < MAX_RETRIES) {
                    attempts.current += 1;
                    timeoutRef.current = setTimeout(checkStatus, POLL_INTERVAL);
                }
            }
        };

        checkStatus();

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [searchParams, router, locale]);

    return (
        <main className="xl:container mx-auto flex-grow min-h-[calc(100vh-130px)] flex flex-col justify-center items-center px-4">
            <div className="mb-8 animate-spin text-gray-400">
                <IconComponent className="w-16 h-16" name="spinner" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {localisedString.paymentPending}
            </h1>
            <p className="text-gray-600 text-center max-w-md">
                {localisedString.paymentPendingDescription}
            </p>
        </main>
    );
}
