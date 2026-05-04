import { createClient } from '@sanity/client';
import { Metadata } from 'next';
import * as React from 'react';

import { IconComponent } from '@/components/Icon/IconComponent';
import { RichTextComponent } from '@/components/RichText/RichTextComponent';
import { FooterContainer } from '@/containers/Footer/FooterContainer';
import { ImageContainer } from '@/containers/Image/ImageContainer';
import { NavigationContainer } from '@/containers/Navigation/NavigationContainer';
import { fetchFooterSectionData } from '@/schemas/footer';
import { fetchNavigationData } from '@/schemas/navigation';
import { fetchOfferSectionData } from '@/schemas/offer';
import { languages, LocaleType } from '@/translations/offer';

const client = createClient({
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
    dataset: process.env.SANITY_STUDIO_DATASET,
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    useCdn: true,
});

interface PageParams {
    params: Promise<{
        locale: string;
        offerId: string;
    }>;
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
    const { locale, offerId } = await params;
    const offer = await fetchOfferSectionData(client, offerId, locale, 'lt');

    return {
        description: offer?.description,
        openGraph: {
            description: offer?.description,
            images: offer?.image ? [offer.image] : [],
            siteName: 'SeaSafari',
            title: offer?.title,
            type: 'article',
            url: `https://www.seasafari.lt/${offer?.slug ?? ''}`,
        },
        title: `${offer?.title ?? ''} | SeaSafari`,
        twitter: {
            card: 'summary_large_image',
            description: offer?.description,
            images: offer?.image ? [offer.image] : [],
            title: offer?.title,
        },
    };
}

export default async function OfferPage({ params }: PageParams) {
    const { locale, offerId } = await params;

    const [navigation, offer, footer] = await Promise.all([
        fetchNavigationData(client, locale, 'lt'),
        fetchOfferSectionData(client, offerId, locale, 'lt'),
        fetchFooterSectionData(client, locale, 'lt'),
    ]);

    const localisedString = languages[locale as LocaleType] || languages['lt'];

    return (
        <div className="flex-grow bg-gray-50 min-h-screen" id={offer?.slug ?? ''}>
            <NavigationContainer
                isSimple
                logo={navigation?.logo}
                phone={navigation?.phone}
            />

            <div className="xl:container max-w-7xl min-h-[calc(100vh-130px)] mx-auto px-4 py-8 md:py-16 lg:py-24 flex flex-col flex-wrap gap-2 md:gap-4 lg:gap-6">
                <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-8">
                    <div className="w-full lg:w-8/12">
                        <div className="flex flex-col h-full">
                            {offer?.title && (
                                <div className="max-w-5xl mb-4 lg:mb-6">
                                    <h2 className="text-xl md:text-2xl lg:text-4xl font-bold">{offer.title}</h2>
                                </div>
                            )}

                            {offer?.longDescription && (
                                <RichTextComponent content={offer.longDescription} />
                            )}

                            {offer?.phoneReservationLink && offer?.phoneReservationLabel && (
                                <div className="w-full flex justify-center">
                                    <a
                                        className="flex w-full justify-center text-white bg-blue-900 rounded-full items-center gap-2 px-6 py-3 mt-4 hover:bg-blue-800 transition-colors"
                                        href={`tel:${offer?.phoneReservationLink}`}
                                    >
                                        {offer.phoneReservationLabel}
                                        <IconComponent className="w-3 h-2.5 text-white" name="arrowRightUp" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full lg:w-4/12 h-64 lg:h-auto relative">
                        {offer?.image && (
                            <ImageContainer
                                classNames={{
                                    image: 'rounded-3xl object-cover',
                                    root: 'h-full',
                                }}
                                fill
                                height={256}
                                loading="eager"
                                src={offer.image}
                                width={1024}
                            />
                        )}
                    </div>
                </div>

                {offer?.cards && (
                    <div className="flex flex-col gap-2 md:gap-4 mt-6 md:mt-8 lg:mt-10">
                        <h3 className="text-lg md:text-xl lg:text-2xl font-bold">
                            {localisedString.importantInformation}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {offer.cards.map((card, index) => (
                                <div className="flex gap-4 items-center" key={index}>
                                    <div className="w-10 h-10 rounded-full bg-blue-100 p-2 flex items-center justify-center shadow-md">
                                        {card.icon && (
                                            <ImageContainer
                                                classNames={{ image: 'w-6 h-6' }}
                                                hasPlaceholder={false}
                                                height={40}
                                                src={card.icon}
                                                width={40}
                                            />
                                        )}
                                    </div>
                                    <p className="text-sm md:text-base">{card.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <FooterContainer common={footer?.common} faq={footer?.faq} />
        </div>
    );
}
