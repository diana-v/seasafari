'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';

import { Widget } from '@/components/Widget/WidgetComponent';
import { FooterContainer } from '@/containers/Footer/FooterContainer';
import { NavigationContainer } from '@/containers/Navigation/NavigationContainer';
import { AboutLayout } from '@/layouts/AboutLayout/AboutLayout';
import { BlogsLayout } from '@/layouts/BlogsLayout/BlogsLayout';
import { ContactLayout } from '@/layouts/ContactLayout/ContactLayout';
import { GalleryLayout } from '@/layouts/GalleryLayout/GalleryLayout';
import { GiftCardLayout } from '@/layouts/GiftCardLayout/GiftCardLayout';
import { HomeLayout } from '@/layouts/HomeLayout/HomeLayout';
import { OffersLayout } from '@/layouts/OffersLayout/OffersLayout';
import { PartnersLayout } from '@/layouts/PartnersLayout/PartnersLayout';
import { GoogleReviewsResponse, ReviewsLayout } from '@/layouts/ReviewsLayout/ReviewsLayout';
import { AboutSectionResponse } from '@/schemas/about';
import { BlogsSectionResponse } from '@/schemas/blogs';
import { ContactSectionResponse } from '@/schemas/contact';
import { FooterSectionResponse } from '@/schemas/footer';
import { GallerySectionResponse } from '@/schemas/gallery';
import { GiftCardSectionResponse } from '@/schemas/giftCard';
import { GiftCardWidgetResponse } from '@/schemas/giftCardWidget';
import { HomeSectionResponse } from '@/schemas/home';
import { NavigationProps } from '@/schemas/navigation';
import { OffersSectionResponse } from '@/schemas/offers';
import { PartnersSectionResponse } from '@/schemas/partners';
import { ReviewsSectionResponse } from '@/schemas/reviews';

interface HomeClientProps {
    about: AboutSectionResponse;
    blogs: BlogsSectionResponse;
    contact: ContactSectionResponse;
    footer: FooterSectionResponse;
    gallery: GallerySectionResponse;
    giftCard: GiftCardSectionResponse;
    giftCardWidget: GiftCardWidgetResponse;
    home: HomeSectionResponse;
    navigation: NavigationProps;
    offers: OffersSectionResponse;
    partners: PartnersSectionResponse;
    reviews: ReviewsSectionResponse;
    reviewsData: GoogleReviewsResponse;
}

export default function HomeClient({
   about, blogs, contact, footer, gallery, giftCard,
   giftCardWidget, home, navigation, offers, partners, reviews, reviewsData
}: HomeClientProps) {
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
            <div className="h-[100vh]">
                <NavigationContainer logo={navigation?.logo} phone={navigation?.phone} />
                <HomeLayout
                    cta={home?.cta}
                    heroMedia={home?.heroMedia}
                    image={home?.image}
                    subtitle={home?.subtitle}
                    title={home?.title}
                    videoMp4={home?.videoMp4}
                    videoWebm={home?.videoWebm}
                />
            </div>

            <AboutLayout
                benefits={about?.benefits}
                description={about?.description}
                image={about?.image}
                title={about?.title}
            />
            <BlogsLayout cards={blogs?.cards} description={blogs?.description} title={blogs?.title} />
            <GalleryLayout cards={gallery?.cards} />
            <GiftCardLayout
                bullets={giftCard?.bullets}
                description={giftCard?.description}
                image={giftCard?.image}
                options={giftCard?.options}
                title={giftCard?.title}
            />
            <PartnersLayout logos={partners?.logos} title={partners?.title} />
            <OffersLayout cards={offers?.cards} description={offers?.description} title={offers?.title} />
            <ReviewsLayout reviewsData={reviewsData} title={reviews?.title} />
            <ContactLayout
                description={contact?.description}
                formTitle={contact?.formTitle}
                phone={contact?.phone}
                title={contact?.title}
            />
            <FooterContainer common={footer?.common} faq={footer?.faq} />

            {giftCardWidget?.title && (
                <Widget
                    image={giftCardWidget.image}
                    isVisible={isWidgetVisible}
                    link={giftCardWidget.link}
                    title={giftCardWidget.title}
                />
            )}
        </>
    );
}
