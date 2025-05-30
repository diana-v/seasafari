import Head from 'next/head';
import { createClient } from '@sanity/client';
import { GetServerSideProps, NextPage } from 'next';

import { ContactLayout, ContactProps } from '@/layouts/ContactLayout/ContactLayout';
import { fetchContactSectionData } from '@/schemas/contact';
import { fetchAboutSectionData } from '@/schemas/about';
import { AboutLayout, AboutProps } from '@/layouts/AboutLayout/AboutLayout';
import { fetchHomeSectionData } from '@/schemas/home';
import { HomeLayout, HomeProps } from '@/layouts/HomeLayout/HomeLayout';
import { fetchReviewsSectionData } from '@/schemas/reviews';
import { ReviewsLayout, ReviewsProps } from '@/layouts/ReviewsLayout/ReviewsLayout';
import { fetchSafetySectionData } from '@/schemas/safety';
import { SafetyLayout, SafetyProps } from '@/layouts/SafetyLayout/SafetyLayout';
import { OffersLayout, OffersProps } from '@/layouts/OffersLayout/OffersLayout';
import { fetchOffersSectionData } from '@/schemas/offers';
import { NavigationContainer, NavigationProps } from '@/containers/Navigation/NavigationContainer';
import { fetchHeaderData } from '@/schemas/navigation';
import { FAQLayout, FAQProps } from '@/layouts/FAQLayout/FAQLayout';
import { fetchFAQSectionData } from '@/schemas/faq';
import { fetchGallerySectionData } from '@/schemas/gallery';
import { GalleryLayout, GalleryProps } from '@/layouts/GalleryLayout/GalleryLayout';
import { FooterContainer, FooterProps } from '@/containers/Footer/FooterContainer';
import { fetchFooterSectionData } from '@/schemas/footer';
import { BlogsLayout, BlogsProps } from '@/layouts/BlogsLayout/BlogsLayout';
import { fetchBlogsSectionData } from '@/schemas/blogs';

interface PageProps {
    navigation?: NavigationProps;
    home?: HomeProps;
    about?: AboutProps;
    offers?: OffersProps;
    safety?: SafetyProps;
    gallery?: GalleryProps;
    blogs?: BlogsProps;
    faq?: FAQProps;
    reviews?: ReviewsProps;
    contact?: ContactProps;
    footer?: FooterProps;
    isAuthenticated: boolean;
}

const Home: NextPage<PageProps> = ({
    navigation,
    home,
    about,
    offers,
    safety,
    blogs,
    faq,
    gallery,
    reviews,
    contact,
    footer,
}) => {
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
            <NavigationContainer logo={navigation?.logo} sections={navigation?.sections} />
            <HomeLayout
                sectionTitle={home?.sectionTitle}
                title={home?.title}
                videoMp4={home?.videoMp4}
                videoWebm={home?.videoWebm}
                image={home?.image}
                heroMedia={home?.heroMedia}
            />
            <AboutLayout sectionTitle={about?.sectionTitle} description={about?.description} image={about?.image} />
            <OffersLayout
                sectionTitle={offers?.sectionTitle}
                title={offers?.title}
                description={offers?.description}
                cards={offers?.cards}
            />
            <SafetyLayout
                sectionTitle={safety?.sectionTitle}
                title={safety?.title}
                description={safety?.description}
                cards={safety?.cards}
                disclaimer={safety?.disclaimer}
            />
            <GalleryLayout
                sectionTitle={gallery?.sectionTitle}
                title={gallery?.title}
                description={gallery?.description}
                cards={gallery?.cards}
            />
            <BlogsLayout
                sectionTitle={blogs?.sectionTitle}
                title={blogs?.title}
                description={blogs?.description}
                cards={blogs?.cards}
            />
            <FAQLayout
                sectionTitle={faq?.sectionTitle}
                title={faq?.title}
                description={faq?.description}
                faq={faq?.faq}
            />
            <ReviewsLayout sectionTitle={reviews?.sectionTitle} title={reviews?.title} cards={reviews?.cards} />
            <ContactLayout
                sectionTitle={contact?.sectionTitle}
                title={contact?.title}
                description={contact?.description}
                backgroundImage={contact?.backgroundImage}
            />
            <FooterContainer items={footer?.items} contact={footer?.contact} />
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
    const navigation = await fetchHeaderData(client, locale, defaultLocale);
    const home = await fetchHomeSectionData(client, locale, defaultLocale);
    const about = await fetchAboutSectionData(client, locale, defaultLocale);
    const offers = await fetchOffersSectionData(client, locale, defaultLocale);
    const safety = await fetchSafetySectionData(client, locale, defaultLocale);
    const gallery = await fetchGallerySectionData(client, locale, defaultLocale);
    const blogs = await fetchBlogsSectionData(client, locale, defaultLocale);
    const faq = await fetchFAQSectionData(client, locale, defaultLocale);
    const reviews = await fetchReviewsSectionData(client, locale, defaultLocale);
    const contact = await fetchContactSectionData(client, locale, defaultLocale);
    const footer = await fetchFooterSectionData(client, locale, defaultLocale);

    return {
        props: {
            navigation,
            home,
            about,
            offers,
            safety,
            gallery,
            blogs,
            faq,
            reviews,
            contact,
            footer,
        },
    };
};

export default Home;
