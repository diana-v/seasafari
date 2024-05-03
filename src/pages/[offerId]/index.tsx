import * as React from 'react';
import { createClient } from '@sanity/client';
import { GetServerSideProps, NextPage } from 'next';
import { TypedObject } from '@portabletext/types';
import Head from 'next/head';
import cn from 'clsx';

import { fetchOfferSectionData } from '@/schemas/offer';
import { RichTextComponent } from '@/components/RichText/RichTextComponent';
import { ImageContainer } from '@/containers/Image/ImageContainer';
import { NavigationContainer, NavigationProps } from '@/containers/Navigation/NavigationContainer';
import { fetchHeaderData } from '@/schemas/navigation';
import { FooterContainer, FooterProps } from '@/containers/Footer/FooterContainer';
import { fetchFooterSectionData } from '@/schemas/footer';
import GiftCardForm, { ChipType } from '@/forms/GiftCardForm';

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
    isGiftcard?: boolean;
    chips?: ChipType[];
    giftcardInfo?: TypedObject | TypedObject[];
    phoneReservationLink?: string;
    phoneReservationLabel?: string;
}

interface PageProps {
    navigation: NavigationProps;
    offer: OfferProps;
    footer: FooterProps;
}

const Offer: NextPage<PageProps> = ({ navigation, offer, footer }) => (
    <div id={offer.slug} className="flex-grow bg-grey-50 min-h-screen">
        <Head>
            <title>{`${offer.title} | SeaSafari`}</title>
            <meta name="description" content={offer.description} />
        </Head>
        <NavigationContainer logo={navigation.logo} sections={navigation.sections} />
        <div className="container min-h-[calc(100vh-130px)] mx-auto px-4 py-8 md:py-16 lg:py-24 flex flex-wrap flex-col lg:flex-row gap-6 md:gap-10 lg:gap-16">
            <div className="basis-1 flex-grow w-full">
                {offer.image && (
                    <ImageContainer
                        loading="eager"
                        src={offer.image}
                        width={750}
                        height={550}
                        className={cn('rounded flex-grow h-96 lg:h-auto', {
                            'object-cover': !offer.isGiftcard,
                            'object-contain': offer.isGiftcard,
                        })}
                    />
                )}
            </div>
            <div className="basis-1 flex-grow w-full flex flex-col gap-2">
                <div className="flex flex-col gap-4 bg-white rounded p-8">
                    <div>
                        {offer.title && <h1>{offer.title}</h1>}
                        {offer.longDescription && <RichTextComponent content={offer.longDescription} />}
                    </div>
                    {offer.isGiftcard ? (
                        <>
                            {offer.giftcardInfo && <RichTextComponent content={offer.giftcardInfo} />}
                            {offer.chips && <GiftCardForm chips={offer.chips} />}
                        </>
                    ) : (
                        offer.phoneReservationLink &&
                        offer.phoneReservationLabel && (
                            <a
                                href={`tel:${offer.phoneReservationLink}`}
                                className="bg-red-900 text-white text-center uppercase p-3 rounded shadow-md"
                            >
                                {offer.phoneReservationLabel}
                            </a>
                        )
                    )}
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap bg-white rounded p-8 gap-y-2">
                    {offer.cards?.map((card, index) => (
                        <div key={index} className="flex gap-4 items-center sm:basis-1/2">
                            <ImageContainer src={card.icon} height={40} width={40} className="w-8 h-8" />
                            <p className="m-0">{card.title}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <FooterContainer items={footer.items} />
    </div>
);

const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
    useCdn: false,
});

export const getServerSideProps: GetServerSideProps = async ({ params, locale, defaultLocale }) => {
    const offerId = params?.offerId;
    const navigation = await fetchHeaderData(client, locale, defaultLocale);
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
