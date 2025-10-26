import * as React from 'react';
import { createClient } from '@sanity/client';
import { GetServerSideProps, NextPage } from 'next';
import { TypedObject } from '@portabletext/types';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { fetchOfferSectionData } from '@/schemas/offer';
import { RichTextComponent } from '@/components/RichText/RichTextComponent';
import { ImageContainer } from '@/containers/Image/ImageContainer';
import { NavigationContainer, NavigationProps } from '@/containers/Navigation/NavigationContainer';
import { fetchNavigationData } from '@/schemas/navigation';
import { FooterContainer, FooterProps } from '@/containers/Footer/FooterContainer';
import { fetchFooterSectionData } from '@/schemas/footer';
import { IconComponent } from '@/components/Icon/IconComponent';
import { languages, LocaleType } from '@/translations/offer';

type CardsType = {
    title?: string;
    icon?: string;
};

export interface OfferProps {
    slug?: string;
    image?: string;
    title?: string;
    description?: string;
    longDescription?: TypedObject | TypedObject[];
    cards?: CardsType[];
    phoneReservationLink?: string;
    phoneReservationLabel?: string;
}

interface PageProps {
    navigation?: NavigationProps;
    offer?: OfferProps;
    footer?: FooterProps;
}

const Offer: NextPage<PageProps> = ({ navigation, offer, footer }) => {
    const { locale, defaultLocale } = useRouter();
    const localisedString = languages[(locale ?? defaultLocale) as LocaleType];

    return (
        <div id={offer?.slug ?? ''} className="flex-grow bg-grey-50 min-h-screen">
            <Head>
                <title>{`${offer?.title ?? ''} | SeaSafari`}</title>
                <meta name="description" content={offer?.description} />
            </Head>
            <NavigationContainer logo={navigation?.logo} phone={navigation?.phone} isSimple />

            <div className="xl:container max-w-7xl min-h-[calc(100vh-130px)] mx-auto px-4 py-8 md:py-16 lg:py-24 flex flex-col flex-wrap gap-2 md:gap-4 lg:gap-6">
                <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-8">
                    <div className="w-full lg:w-8/12">
                        <div className="flex flex-col h-full">
                            {offer?.title && (
                                <div className="max-w-5xl mb-4 lg:mb-6">
                                    <h2>{offer.title}</h2>
                                </div>
                            )}

                            {offer?.longDescription && <RichTextComponent content={offer.longDescription} />}

                            {offer?.phoneReservationLink && offer?.phoneReservationLabel && (
                                <div className="w-full flex justify-center">
                                    <a
                                        href={`tel:${offer?.phoneReservationLink}`}
                                        className="flex w-full justify-center text-white bg-blue-900 rounded-full items-center gap-2 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                                    >
                                        {offer.phoneReservationLabel}
                                        <IconComponent name="arrowRightUp" className="w-3 h-2.5 text-white" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full lg:w-4/12 h-64 lg:h-auto">
                        {offer && offer.image && (
                            <ImageContainer
                                loading="eager"
                                src={offer.image}
                                fill
                                classNames={{
                                    root: 'h-full',
                                    image: 'rounded-3xl object-cover',
                                }}
                            />
                        )}
                    </div>
                </div>
                {offer?.cards && (
                    <div className="flex flex-col gap-2 md:gap-4 mt-6 md:mt-8 lg:mt-10">
                        <h3>{localisedString.importantInformation}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {offer?.cards?.map((card, index) => (
                                <div key={index} className="flex gap-4 items-center">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 p-2 flex items-center justify-center shadow-md">
                                        <ImageContainer
                                            src={card.icon}
                                            height={40}
                                            width={40}
                                            classNames={{ image: 'w-6 h-6' }}
                                        />
                                    </div>
                                    <p>{card.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <FooterContainer common={footer?.common} faq={footer?.faq} />
        </div>
    );
};

const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
    useCdn: false,
});

export const getServerSideProps: GetServerSideProps = async ({ params, locale, defaultLocale }) => {
    const offerId = params?.offerId;
    const navigation = await fetchNavigationData(client, locale, defaultLocale);
    const offer = await fetchOfferSectionData(client, offerId, locale, defaultLocale);
    const footer = await fetchFooterSectionData(client, locale, defaultLocale);

    return {
        props: {
            navigation,
            offer,
            footer,
        },
    };
};

export default Offer;
