import { useRouter } from 'next/router';
import * as React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { createClient } from '@sanity/client';
import Link from 'next/link';
import { eq } from 'drizzle-orm';
import Cookies from 'cookies';

import { db } from '@/server/db';
import { orders } from '@/server/db/schema';
import { NavigationContainer, NavigationProps } from '@/containers/Navigation/NavigationContainer';
import { FooterContainer, FooterProps } from '@/containers/Footer/FooterContainer';
import { fetchNavigationData } from '@/schemas/navigation';
import { fetchFooterSectionData } from '@/schemas/footer';
import { IconComponent } from '@/components/Icon/IconComponent';
import { languages, LocaleType } from '@/translations/success';
import { generatePdfDoc } from '@/templates/payment-success';

interface PageProps {
    navigation?: NavigationProps;
    footer?: FooterProps;
    paymentRef: string;
    paymentEmail: string;
    pdfBase64: string;
}
const PaymentSuccessPage: NextPage<PageProps> = ({ navigation, footer, paymentRef, paymentEmail, pdfBase64 }) => {
    const { locale, defaultLocale } = useRouter();
    const localisedString = languages[(locale ?? defaultLocale) as LocaleType];

    const handlePrint = React.useCallback(() => {
        const pdfBlob = new Blob([new Uint8Array(Buffer.from(pdfBase64, 'base64'))], { type: 'application/pdf' });

        window.open(URL.createObjectURL(pdfBlob), '_blank');
    }, []);

    return (
        <>
            <NavigationContainer logo={navigation?.logo} phone={navigation?.phone} isSimple />
            <div className="xl:container mx-auto min-h-[calc(100vh-130px)] flex flex-col">
                <button type="button" className="self-end m-8" onClick={handlePrint}>
                    <IconComponent name="print" className="w-8 h-8" />
                </button>
                <div className="max-w-lg mx-auto text-center flex flex-grow flex-col gap-4 items-center justify-around mb-4">
                    <div className="flex flex-col gap-4 items-center">
                        <IconComponent
                            name="checkCircle"
                            className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 text-green-600 mb-8"
                        />
                        <h1 className="text-green-600">{localisedString.thankYou}</h1>
                        <h4 className="text-gray-900 font-bold">{localisedString.paymentSuccess}</h4>
                        <p className="text-gray-900">
                            {localisedString.giftCardRef}
                            <span className="!text-black font-bold m-0">{paymentRef} </span>
                            {localisedString.giftCardEmail}
                            <span className="!text-black font-bold m-0">{paymentEmail}</span>
                        </p>
                        <Link href="/" className="underline underline-offset-4">
                            {localisedString.link}
                        </Link>
                    </div>
                    <p className="text-gray-400">
                        {localisedString.disclaimerQuestion}
                        <Link href="/#kontaktai" className="underline underline-offset-4">
                            {localisedString.disclaimerSubmitForm}
                        </Link>
                        {localisedString.disclaimerOr}{' '}
                        <Link
                            className="underline underline-offset-4"
                            href={`mailto:${process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL}`}
                        >
                            {localisedString.disclaimerSendEmail}
                        </Link>
                    </p>
                </div>
            </div>
            <FooterContainer common={footer?.common} faq={footer?.faq} />
        </>
    );
};

const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
    useCdn: false,
});

export const getServerSideProps: GetServerSideProps = async ({ req, res, query, locale, defaultLocale }) => {
    const { ref } = query;
    const cookies = new Cookies(req, res);

    const secureRef = cookies.get('paymentRef');

    if (!secureRef || secureRef !== ref) {
        console.warn(`Unauthorized attempt to view order ${ref} with cookie ${secureRef}`);

        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const existingOrder = await db
        .select()
        .from(orders)
        .where(eq(orders.orderRef, ref as string));

    if (!existingOrder) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const navigation = await fetchNavigationData(client, locale, defaultLocale);
    const footer = await fetchFooterSectionData(client, locale, defaultLocale);

    const pdfStream = await generatePdfDoc({
        orderRef: ref as string,
        validTo: new Date(existingOrder[0].validTo),
        validFrom: new Date(existingOrder[0].validFrom),
        locale: locale ?? '',
        count: (existingOrder[0].orderAmount / 25).toString(),
    });

    const chunks: Buffer[] = [];

    for await (const chunk of pdfStream) {
        if (Buffer.isBuffer(chunk)) {
            chunks.push(chunk);
        } else {
            chunks.push(Buffer.from(chunk));
        }
    }
    const pdfBuffer = Buffer.concat(chunks);
    const pdfBase64 = pdfBuffer.toString('base64');

    return {
        props: {
            navigation,
            footer,
            paymentRef: ref,
            paymentEmail: existingOrder[0].orderEmail,
            pdfBase64,
        },
    };
};

export default PaymentSuccessPage;
