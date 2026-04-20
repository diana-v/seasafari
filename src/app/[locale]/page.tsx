import { createClient } from '@sanity/client';
import { Metadata } from 'next';
import * as React from 'react';
import { Suspense } from 'react';

import HomeClientContainer from '@/containers/HomeClient/HomeClientContainer';
import ReviewsServer from '@/containers/ReviewsServer/ReviewsServerContainer';
import { AboutSectionResponse, fetchAboutSectionData } from '@/schemas/about';
import { BlogsSectionResponse, fetchBlogsSectionData } from '@/schemas/blogs';
import { ContactSectionResponse, fetchContactSectionData } from '@/schemas/contact';
import { fetchFooterSectionData, FooterSectionResponse } from '@/schemas/footer';
import { fetchGallerySectionData, GallerySectionResponse } from '@/schemas/gallery';
import { fetchGiftCardSectionData, GiftCardSectionResponse } from '@/schemas/giftCard';
import { fetchGiftCardWidgetSectionData, GiftCardWidgetResponse } from '@/schemas/giftCardWidget';
import { fetchHomeSectionData, HomeSectionResponse } from '@/schemas/home';
import { fetchNavigationData, NavigationSectionResponse } from '@/schemas/navigation';
import { fetchOffersSectionData, OffersSectionResponse } from '@/schemas/offers';
import { fetchPartnersSectionData, PartnersSectionResponse } from '@/schemas/partners';
import { fetchReviewsSectionData, ReviewsSectionResponse } from '@/schemas/reviews';

const client = createClient({
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
    dataset: process.env.SANITY_STUDIO_DATASET,
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    useCdn: true,
});

interface PageParams {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
    const { locale } = await params;
    const home = await fetchHomeSectionData(client, locale, 'lt');

    const title = "Sea-Safari Lietuva | Nepamirštami įspūdžiai Jums";
    const description = "Plaukdami su „Sea Safari“ jūs priartėsite prie gamtos ir patirsite nepamirštamus įspūdžius. Mes siūlome du R.I.B. laivus, varomus 300 AG ir 600 AG varikliais.";

    return {
        description,
        openGraph: {
            description,
            images: home?.image ? [{ url: home?.image }] : [],
            siteName: 'Sea-Safari',
            title,
            type: 'website',
            url: 'https://www.seasafari.lt',
        },
        title: "Sea-Safari",
        twitter: {
            card: 'summary',
            description,
            images: home?.image ? [home?.image] : [],
            title,
        },
    };
}

export default async function HomePage({ params }: PageParams) {
    const { locale } = await params;

    const results = await Promise.allSettled([
        fetchNavigationData(client, locale, 'lt'),
        fetchHomeSectionData(client, locale, 'lt'),
        fetchAboutSectionData(client, locale, 'lt'),
        fetchBlogsSectionData(client, locale, 'lt'),
        fetchGallerySectionData(client, locale, 'lt'),
        fetchGiftCardSectionData(client, locale, 'lt'),
        fetchPartnersSectionData(client, locale, 'lt'),
        fetchOffersSectionData(client, locale, 'lt'),
        fetchReviewsSectionData(client, locale, 'lt'),
        fetchContactSectionData(client, locale, 'lt'),
        fetchFooterSectionData(client, locale, 'lt'),
        fetchGiftCardWidgetSectionData(client, locale, 'lt'),
    ]);

    const [
        navigation, home, about, blogs, gallery, giftCard,
        partners, offers, reviews, contact, footer, giftCardWidget
    ] = results.map(result =>
        result.status === 'fulfilled' ? result.value : undefined
    ) as [
            NavigationSectionResponse | undefined,
            HomeSectionResponse | undefined,
            AboutSectionResponse | undefined,
            BlogsSectionResponse | undefined,
            GallerySectionResponse | undefined,
            GiftCardSectionResponse | undefined,
            PartnersSectionResponse | undefined,
            OffersSectionResponse | undefined,
            ReviewsSectionResponse | undefined,
            ContactSectionResponse | undefined,
            FooterSectionResponse | undefined,
            GiftCardWidgetResponse | undefined
    ];

    return (
        <HomeClientContainer
            about={about}
            blogs={blogs}
            contact={contact}
            footer={footer}
            gallery={gallery}
            giftCard={giftCard}
            giftCardWidget={giftCardWidget}
            home={home}
            navigation={navigation}
            offers={offers}
            partners={partners}
            reviewsSlot={
                <Suspense
                    fallback={<div className="h-80 animate-pulse bg-gray-100" />}
                    key="reviews-suspense-wrapper"
                >
                    <ReviewsServer title={reviews?.title} />
                </Suspense>
            }
        />
    );
}
