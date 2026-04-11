import { createClient } from '@sanity/client';
import { OAuth2Client } from 'google-auth-library';
import { Metadata } from 'next';
import * as React from 'react';

import HomeClientContainer from '@/containers/HomeClient/HomeClientContainer';
import { fetchAboutSectionData } from '@/schemas/about';
import { fetchBlogsSectionData } from '@/schemas/blogs';
import { fetchContactSectionData } from '@/schemas/contact';
import { fetchFooterSectionData } from '@/schemas/footer';
import { fetchGallerySectionData } from '@/schemas/gallery';
import { fetchGiftCardSectionData } from '@/schemas/giftCard';
import { fetchGiftCardWidgetSectionData } from '@/schemas/giftCardWidget';
import { fetchHomeSectionData } from '@/schemas/home';
import { fetchNavigationData } from '@/schemas/navigation';
import { fetchOffersSectionData } from '@/schemas/offers';
import { fetchPartnersSectionData } from '@/schemas/partners';
import { fetchReviewsSectionData } from '@/schemas/reviews';

const client = createClient({
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
    dataset: process.env.SANITY_STUDIO_DATASET,
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    useCdn: false,
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
            images: home?.image ? [{ url: home.image }] : [],
            siteName: 'Sea-Safari',
            title,
            type: 'website',
            url: 'https://www.seasafari.lt',
        },
        title: "Sea-Safari",
        twitter: {
            card: 'summary',
            description,
            images: home?.image ? [home.image] : [],
            title,
        },
    };
}

export default async function HomePage({ params }: PageParams) {
    const { locale } = await params;

    const [
        navigation, home, about, blogs, gallery, giftCard,
        partners, offers, reviews, contact, footer, giftCardWidget
    ] = await Promise.all([
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

    let reviewsData = null;

    try {
        const auth = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

        auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
        const { token } = await auth.getAccessToken();

        const response = await fetch(
            `https://mybusiness.googleapis.com/v4/accounts/${process.env.GOOGLE_BUSINESS_ID}/locations/${process.env.GOOGLE_LOCATION_ID}/reviews`,
            {
                headers: { Authorization: `Bearer ${token}` },
                next: { revalidate: 86_400 }
            }
        );

        if (response.ok) reviewsData = await response.json();
    } catch (error) {
        console.error('Google Reviews Fetch Failed:', error);
    }

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
            reviews={reviews}
            reviewsData={reviewsData}
        />
    );
}
