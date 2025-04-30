import { useRouter } from 'next/router';
import * as React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { createClient } from '@sanity/client';
import Link from 'next/link';
import Cookies from 'cookies';

import { NavigationContainer, NavigationProps } from '@/containers/Navigation/NavigationContainer';
import { FooterContainer, FooterProps } from '@/containers/Footer/FooterContainer';
import { fetchHeaderData } from '@/schemas/navigation';
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
            <NavigationContainer logo={navigation?.logo} sections={navigation?.sections} />
            <div className="container mx-auto min-h-[calc(100vh-130px)] flex flex-col">
                <button type="button" className="self-end m-8" onClick={handlePrint}>
                    <IconComponent name="print" className="w-8 h-8" />
                </button>
                <div className="max-w-lg mx-auto text-center flex flex-grow flex-col gap-4 items-center justify-around">
                    <div className="flex flex-col gap-4 items-center">
                        <IconComponent
                            name="check"
                            className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 text-green-600 mb-8"
                        />
                        <h1 className="!mb-0 text-green-600">{localisedString.thankYou}</h1>
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
                            href={`mailto:${process.env.NEXT_PUBLIC_SENDGRID_EMAIL}`}
                        >
                            {localisedString.disclaimerSendEmail}
                        </Link>
                    </p>
                </div>
            </div>
            <FooterContainer items={footer?.items} contact={footer?.contact} />
        </>
    );
};

const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
    useCdn: false,
});

export const getServerSideProps: GetServerSideProps = async ({ res, req, locale, defaultLocale }) => {
    const cookies = new Cookies(req, res);
    const paymentRef = cookies.get('paymentRef');
    const paymentEmail = cookies.get('paymentEmail');
    const validFrom = cookies.get('validFrom');
    const validTo = cookies.get('validTo');
    const count = cookies.get('count');

    if (!paymentRef || !paymentEmail || !validTo || !validFrom || !count) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    cookies.set('paymentRef', '', { httpOnly: true, maxAge: 0, sameSite: 'strict', path: '/' });
    cookies.set('paymentEmail', '', { httpOnly: true, maxAge: 0, sameSite: 'strict', path: '/' });
    cookies.set('validFrom', '', { httpOnly: true, maxAge: 0, sameSite: 'strict', path: '/' });
    cookies.set('validTo', '', { httpOnly: true, maxAge: 0, sameSite: 'strict', path: '/' });
    cookies.set('count', '', { httpOnly: true, maxAge: 0, sameSite: 'strict', path: '/' });

    const navigation = await fetchHeaderData(client, locale, defaultLocale);
    const footer = await fetchFooterSectionData(client, locale, defaultLocale);

    const pdfStream = await generatePdfDoc({
        orderRef: paymentRef,
        validTo: validTo,
        validFrom: validFrom,
        locale: locale ?? '',
        count: count,
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
            paymentRef,
            paymentEmail,
            pdfBase64,
        },
    };
};

export default PaymentSuccessPage;
