import { createClient } from '@sanity/client';
import { eq } from 'drizzle-orm';
import { cookies as nextCookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import * as React from 'react';

import { IconComponent } from '@/components/Icon/IconComponent';
import { ClearPaymentContainer } from '@/containers/ClearPayment/ClearPaymentContainer';
import { FooterContainer } from '@/containers/Footer/FooterContainer';
import { NavigationContainer } from '@/containers/Navigation/NavigationContainer';
import { fetchFooterSectionData } from '@/schemas/footer';
import { fetchNavigationData } from '@/schemas/navigation';
import { db } from '@/server/db';
import { orders } from '@/server/db/schema';
import { generatePdfDoc } from '@/templates/payment-success';
import { languages, LocaleType } from '@/translations/success';

import PrintButton from './PrintButton';

const client = createClient({
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
    dataset: process.env.SANITY_STUDIO_DATASET,
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    useCdn: false,
});

interface PageProps {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ ref?: string }>;
}

export const dynamic = 'force-dynamic';

export default async function PaymentSuccessPage({ params, searchParams }: PageProps) {
    const { locale } = await params;
    const { ref } = await searchParams;

    const cookieStore = await nextCookies();
    const secureRef = cookieStore.get('paymentRef')?.value;

    if (!ref || !secureRef || secureRef !== ref) {
        // eslint-disable-next-line no-console
        console.warn(`Unauthorized attempt to view order ${ref} with cookie ${secureRef}`);
        redirect(`/${locale}`);
    }

    const existingOrder = await db
        .instance
        .select()
        .from(orders)
        .where(eq(orders.orderRef, ref));

    if (!existingOrder || existingOrder.length === 0) {
        redirect(`/${locale}`);
    }

    const order = existingOrder[0];

    const [navigation, footer] = await Promise.all([
        fetchNavigationData(client, locale, 'lt'),
        fetchFooterSectionData(client, locale, 'lt'),
    ]);

    const pdfStream = await generatePdfDoc({
        count: (order.orderAmount / 25).toString(),
        locale: locale,
        orderRef: ref,
        validFrom: new Date(order.validFrom),
        validTo: new Date(order.validTo),
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

    const localisedString = languages[locale as LocaleType] || languages['lt'];

    return (
        <div className="flex flex-col min-h-screen">
            <ClearPaymentContainer />
            <NavigationContainer isSimple logo={navigation?.logo} phone={navigation?.phone} />
            <div className="xl:container mx-auto min-h-[calc(100vh-130px)] flex flex-col">
                <div className="self-end m-8">
                    <PrintButton pdfBase64={pdfBase64} />
                </div>
                <div className="max-w-lg mx-auto text-center flex flex-grow flex-col gap-4 items-center justify-around mb-4">
                    <div className="flex flex-col gap-4 items-center">
                        <IconComponent
                            className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 text-green-600 mb-8"
                            name="checkCircle"
                        />
                        <h1 className="text-green-600 font-bold text-4xl">{localisedString.thankYou}</h1>
                        <h4 className="text-gray-900 font-bold">{localisedString.paymentSuccess}</h4>
                        <p className="text-gray-900">
                            {localisedString.giftCardRef}
                            <span className="!text-black font-bold m-0 mx-1">{ref}</span>
                            {localisedString.giftCardEmail}
                            <span className="!text-black font-bold m-0 mx-1">{order.orderEmail}</span>
                        </p>
                        <Link className="underline underline-offset-4" href={`/${locale}`}>
                            {localisedString.link}
                        </Link>
                    </div>
                    <p className="text-gray-400">
                        {localisedString.disclaimerQuestion}
                        <Link className="underline underline-offset-4" href={`/${locale}/#kontaktai`}>
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
        </div>
    );
}
