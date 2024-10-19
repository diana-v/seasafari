import { useRouter } from 'next/router';
import { languages, LocaleType } from '@/translations/error';
import { GetServerSideProps, NextPage } from 'next';
import { NavigationContainer, NavigationProps } from '@/containers/Navigation/NavigationContainer';
import { FooterContainer, FooterProps } from '@/containers/Footer/FooterContainer';
import Link from 'next/link';
import { createClient } from '@sanity/client';
import { fetchHeaderData } from '@/schemas/navigation';
import { fetchFooterSectionData } from '@/schemas/footer';

interface PageProps {
    navigation?: NavigationProps;
    footer?: FooterProps;
    errorCode?: string;
}

const PaymentErrorPage: NextPage<PageProps> = ({ navigation, footer, errorCode }) => {
    const { locale, defaultLocale } = useRouter();
    const localisedString = languages[(locale ?? defaultLocale) as LocaleType];

    return (
        <>
            <NavigationContainer logo={navigation?.logo} sections={navigation?.sections} />
            <div className="container mx-auto min-h-[calc(100vh-130px)] flex flex-col">
                <div className="max-w-lg mx-auto text-center flex flex-grow flex-col gap-4 items-center justify-around">
                    <div className="flex flex-col flex-grow gap-4 items-center justify-center relative">
                        {errorCode && (
                            <div
                                className="absolute flex items-center justify-center text-gray-100 text-[12rem] md:text-[28rem] lg:text-[36rem] font-bold overflow-hidden">
                                {errorCode}
                            </div>
                        )}
                        <h4 className="text-gray-900 font-bold z-10">{localisedString.errorMessage}</h4>
                        <Link href="/" className="underline underline-offset-4 z-10">
                            {localisedString.link}
                        </Link>
                    </div>
                    <p className="text-gray-400 z-10">
                        {localisedString.disclaimerQuestion}
                        <Link href="/#kontaktai" className="underline underline-offset-4">
                            {localisedString.disclaimerSubmitForm}
                        </Link>
                        {localisedString.disclaimerOr}
                        <Link className="underline underline-offset-4" href="mailto:seasafari.lietuva@gmail.com">
                            {localisedString.disclaimerSendEmail}
                        </Link>
                    </p>
                </div>
            </div>
            <FooterContainer items={footer?.items} contact={footer?.contact}/>
        </>
    );
};

const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
    useCdn: false,
});

export const getServerSideProps: GetServerSideProps = async ({ locale, defaultLocale, query }) => {
    const errorCode = query.errorCode ?? null;
    const navigation = await fetchHeaderData(client, locale, defaultLocale);
    const footer = await fetchFooterSectionData(client, locale, defaultLocale);

    return {
        props: {
            navigation,
            footer,
            errorCode,
        },
    };
}

export default PaymentErrorPage;
