import { createClient } from '@sanity/client';
import { Metadata } from 'next';
import * as React from 'react';
import { Suspense } from 'react';

import HomeClientContainer from '@/containers/HomeClient/HomeClientContainer';
import ReviewsServer from '@/containers/ReviewsServer/ReviewsServerContainer';
import { AboutSectionResponse, fetchAboutSectionData } from '@/schemas/about';
import { fetchAllHomeSectionData } from '@/schemas/all';
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

export const revalidate = 86_400; // 1 day

export const dynamic = 'force-static';

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
    const { locale } = await params;
    const data = await fetchAllHomeSectionData(client, locale, 'lt');
    const home = data.home;

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

    const { about, blogs, contact, footer, gallery, giftCard,
        giftCardWidget, home, navigation, offers, partners, reviews
    } = await fetchAllHomeSectionData(client, locale, 'lt')

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
