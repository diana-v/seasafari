import Head from 'next/head';
import { createClient } from '@sanity/client';
import { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';
import { JWT } from 'google-auth-library';
import { useEffect, useState } from 'react';

import { ContactLayout, ContactProps } from '@/layouts/ContactLayout/ContactLayout';
import { fetchContactSectionData } from '@/schemas/contact';
import { fetchAboutSectionData } from '@/schemas/about';
import { AboutLayout, AboutProps } from '@/layouts/AboutLayout/AboutLayout';
import { fetchHomeSectionData } from '@/schemas/home';
import { HomeLayout, HomeProps } from '@/layouts/HomeLayout/HomeLayout';
import { fetchReviewsSectionData } from '@/schemas/reviews';
import { ReviewsLayout, ReviewsProps } from '@/layouts/ReviewsLayout/ReviewsLayout';
import { OffersLayout, OffersProps } from '@/layouts/OffersLayout/OffersLayout';
import { fetchOffersSectionData } from '@/schemas/offers';
import { NavigationContainer, NavigationProps } from '@/containers/Navigation/NavigationContainer';
import { fetchNavigationData } from '@/schemas/navigation';
import { fetchGallerySectionData } from '@/schemas/gallery';
import { GalleryLayout, GalleryProps } from '@/layouts/GalleryLayout/GalleryLayout';
import { FooterContainer, FooterProps } from '@/containers/Footer/FooterContainer';
import { fetchFooterSectionData } from '@/schemas/footer';
import { BlogsLayout, BlogsProps } from '@/layouts/BlogsLayout/BlogsLayout';
import { fetchBlogsSectionData } from '@/schemas/blogs';
import { Widget, WidgetProps } from '@/components/Widget/WidgetComponent';
import { fetchGiftCardWidgetSectionData } from '@/schemas/giftCardWidget';
import { GiftCardLayout, GiftcardProps } from '@/layouts/GiftCardLayout/GiftCardLayout';
import { fetchGiftCardSectionData } from '@/schemas/giftCard';
import { PartnersLayout, PartnersProps } from '@/layouts/PartnersLayout/PartnersLayout';
import { fetchPartnersSectionData } from '@/schemas/partners';

interface PageProps {
    navigation?: NavigationProps;
    home?: HomeProps;
    about?: AboutProps;
    partners?: PartnersProps;
    offers?: OffersProps;
    gallery?: GalleryProps;
    blogs?: BlogsProps;
    reviews?: ReviewsProps;
    reviewsData?: any;
    contact?: ContactProps;
    footer?: FooterProps;
    giftCard?: GiftcardProps;
    giftCardWidget?: WidgetProps;
    isAuthenticated: boolean;
}

const Home: NextPage<PageProps> = ({
    navigation,
    home,
    about,
    blogs,
    gallery,
    giftCard,
    partners,
    offers,
    reviews,
    // reviewsData,
    contact,
    footer,
    giftCardWidget,
}) => {
    const [isWidgetVisible, setIsWidgetVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollThreshold = window.innerHeight * 0.7;

            if (window.scrollY > scrollThreshold) {
                setIsWidgetVisible(true);

                window.removeEventListener('scroll', handleScroll);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Head>
                <title>Sea-Safari</title>
                <meta property="og:title" content="Sea-Safari Lietuva | Nepamirštami įspūdžiai Jums" key="title" />
                <meta
                    name="description"
                    content="Plaukdami su „Sea Safari“ jūs priartėsite prie gamtos ir patirsite nepamirštamus įspūdžius. Mes siūlome du R.I.B. laivus, varomus 300 AG ir 600 AG varikliais, kurių maksimalus greitis siekia net iki 60 mazgų. Patirkite naujus pojūčius su Sea Safari Lietuva!"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta property="og:title" content="Sea-Safari Lietuva | Nepamirštami įspūdžiai Jums" />
                <meta property="og:site_name" content="Sea-Safari" />
                <meta property="og:url" content="seasafari.lt" />
                <meta
                    property="og:description"
                    content="Plaukdami su „Sea Safari“ jūs priartėsite prie gamtos ir patirsite nepamirštamus įspūdžius. Mes siūlome du R.I.B. laivus, varomus 300 AG ir 600 AG varikliais, kurių maksimalus greitis siekia net iki 60 mazgų. Patirkite naujus pojūčius su Sea Safari Lietuva!"
                />
                <meta property="og:type" content="website" />
                <meta
                    property="og:image"
                    content="https://cdn.sanity.io/images/9s9wwf86/production/ffc3ca964587227a6969b43f96f6fa266cfecd97-1771x1257.jpg"
                />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="Sea-Safari Lietuva | Nepamirštami įspūdžiai Jums" />
                <meta
                    name="twitter:description"
                    content="Plaukdami su „Sea Safari“ jūs priartėsite prie gamtos ir patirsite nepamirštamus įspūdžius. Mes siūlome du R.I.B. laivus, varomus 300 AG ir 600 AG varikliais, kurių maksimalus greitis siekia net iki 60 mazgų. Patirkite naujus pojūčius su Sea Safari Lietuva!"
                />
                <meta
                    name="twitter:image"
                    content="https://cdn.sanity.io/images/9s9wwf86/production/ffc3ca964587227a6969b43f96f6fa266cfecd97-1771x1257.jpg"
                />
            </Head>
            <div className="h-[100vh]">
                <NavigationContainer logo={navigation?.logo} phone={navigation?.phone} />
                <HomeLayout
                    title={home?.title}
                    subtitle={home?.subtitle}
                    cta={home?.cta}
                    videoMp4={home?.videoMp4}
                    videoWebm={home?.videoWebm}
                    image={home?.image}
                    heroMedia={home?.heroMedia}
                />
            </div>

            <AboutLayout
                title={about?.title}
                description={about?.description}
                image={about?.image}
                benefits={about?.benefits}
            />
            <BlogsLayout title={blogs?.title} description={blogs?.description} cards={blogs?.cards} />
            <GalleryLayout cards={gallery?.cards} />
            <GiftCardLayout
                title={giftCard?.title}
                description={giftCard?.description}
                bullets={giftCard?.bullets}
                image={giftCard?.image}
                options={giftCard?.options}
            />
            <PartnersLayout title={partners?.title} logos={partners?.logos} />
            <OffersLayout title={offers?.title} description={offers?.description} cards={offers?.cards} />
            {/*<ReviewsLayout title={reviews?.title} cards={reviews?.cards} reviewsData={reviewsData} />*/}
            <ReviewsLayout title={reviews?.title} cards={reviews?.cards} />
            <ContactLayout
                title={contact?.title}
                description={contact?.description}
                phone={contact?.phone}
                formTitle={contact?.formTitle}
            />
            <FooterContainer common={footer?.common} faq={footer?.faq} />
            {giftCardWidget && giftCardWidget.title && (
                <Widget
                    isVisible={isWidgetVisible}
                    link={giftCardWidget.link}
                    title={giftCardWidget.title}
                    image={giftCardWidget.image}
                />
            )}
        </>
    );
};

const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
    useCdn: false,
});

export const getServerSideProps: GetServerSideProps = async ({ locale, defaultLocale }) => {
    const navigation = await fetchNavigationData(client, locale, defaultLocale);
    const home = await fetchHomeSectionData(client, locale, defaultLocale);
    const about = await fetchAboutSectionData(client, locale, defaultLocale);
    const blogs = await fetchBlogsSectionData(client, locale, defaultLocale);
    const gallery = await fetchGallerySectionData(client, locale, defaultLocale);
    const giftCard = await fetchGiftCardSectionData(client, locale, defaultLocale);
    const partners = await fetchPartnersSectionData(client, locale, defaultLocale);
    const offers = await fetchOffersSectionData(client, locale, defaultLocale);
    const reviews = await fetchReviewsSectionData(client, locale, defaultLocale);
    const contact = await fetchContactSectionData(client, locale, defaultLocale);
    const footer = await fetchFooterSectionData(client, locale, defaultLocale);
    const giftCardWidget = await fetchGiftCardWidgetSectionData(client, locale, defaultLocale);

    // const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS ?? '{}');
    //
    // const auth = new JWT({
    //     email: serviceAccount.client_email,
    //     key: serviceAccount.private_key,
    //     scopes: ['https://www.googleapis.com/auth/business.manage'],
    // });
    //
    // const accessToken = await auth.getAccessToken();
    //
    // const reviewsData = await fetch(
    //     `https://mybusiness.googleapis.com/v4/accounts/${process.env.GOOGLE_BUSINESS_ID}/locations/${process.env.GOOGLE_LOCATION_ID}/reviews`,
    //     {
    //         headers: {
    //             Authorization: `Bearer ${accessToken}`,
    //         },
    //     }
    // ).then((res) => res.json());

    return {
        props: {
            navigation,
            home,
            about,
            blogs,
            gallery,
            giftCard,
            partners,
            offers,
            reviews,
            // reviewsData,
            contact,
            footer,
            giftCardWidget,
        },
    };
};

export default Home;
