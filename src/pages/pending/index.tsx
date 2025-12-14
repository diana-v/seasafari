import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import { createClient } from '@sanity/client';
import { useEffect, useRef } from 'react';

import { NavigationContainer, NavigationProps } from '@/containers/Navigation/NavigationContainer';
import { FooterContainer, FooterProps } from '@/containers/Footer/FooterContainer';
import { fetchNavigationData } from '@/schemas/navigation';
import { fetchFooterSectionData } from '@/schemas/footer';
import { IconComponent } from '@/components/Icon/IconComponent';
import { languages, LocaleType } from '@/translations/pending';

interface PageProps {
    navigation?: NavigationProps;
    footer?: FooterProps;
}

const MAX_RETRIES = 15;
const POLL_INTERVAL = 4000; // 4 seconds

const PaymentPendingPage = ({ navigation, footer }: PageProps) => {
    const { defaultLocale, isReady, locale, push, query } = useRouter();
    const localisedString = languages[(locale ?? defaultLocale) as LocaleType];

    const attempts = useRef(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const orderRef = query.ref || query.order_id || query.payment_intent;

        if (!isReady || !orderRef) return;

        const checkStatus = async () => {
            try {
                const res = await fetch(`/api/check-status?ref=${orderRef}`);
                const data = await res.json();

                if (res.status === 200 && data.paid) {
                    push(`/success?ref=${orderRef}`);

                    return;
                }

                if (data.status === 'failed' || data.status === 'declined') {
                    push('/failed');

                    return;
                }

                if (attempts.current < MAX_RETRIES) {
                    attempts.current += 1;
                    timeoutRef.current = setTimeout(checkStatus, POLL_INTERVAL);
                } else {
                    push('/failed');

                    return;
                }
            } catch {
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
    }, [isReady, query]);

    return (
        <>
            <NavigationContainer logo={navigation?.logo} phone={navigation?.phone} isSimple />
            <div className="xl:container mx-auto min-h-[calc(100vh-130px)] flex flex-col justify-center items-center">
                <div className="mb-8 animate-spin text-gray-400">
                    <IconComponent name="spinner" className="w-16 h-16" />
                </div>
                <h2>{localisedString.paymentPending}</h2>
                <p className="text-gray-900">{localisedString.paymentPendingDescription}</p>
            </div>
            <FooterContainer common={footer?.common} faq={footer?.faq} />
        </>
    );
};

const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
    useCdn: true,
});

export const getStaticProps: GetStaticProps = async ({ locale, defaultLocale }) => {
    const navigation = await fetchNavigationData(client, locale, defaultLocale);
    const footer = await fetchFooterSectionData(client, locale, defaultLocale);

    return { props: { navigation, footer } };
};

export default PaymentPendingPage;
