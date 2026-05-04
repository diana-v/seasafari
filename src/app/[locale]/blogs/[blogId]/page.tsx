import { createClient } from '@sanity/client';
import { Metadata } from 'next';
import * as React from 'react';
import { Suspense } from 'react';

import { IconComponent } from '@/components/Icon/IconComponent';
import { RichTextComponent } from '@/components/RichText/RichTextComponent';
import { Widget } from '@/components/Widget/WidgetComponent';
import { FooterContainer } from '@/containers/Footer/FooterContainer';
import { ImageContainer } from '@/containers/Image/ImageContainer';
import { NavigationContainer } from '@/containers/Navigation/NavigationContainer';
import { fetchBlogSectionData } from '@/schemas/blog';
import { fetchFooterSectionData } from '@/schemas/footer';
import { fetchGiftCardWidgetSectionData } from '@/schemas/giftCardWidget';
import { fetchNavigationData } from '@/schemas/navigation';
import { fetchBlogsSectionData } from '@/schemas/blogs';

const client = createClient({
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
    dataset: process.env.SANITY_STUDIO_DATASET,
    maxRetries: 3,
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    retryDelay: (attempt) => attempt * 1000,
    useCdn: true,
});

interface PageParams {
    params: Promise<{
        blogId: string;
        locale: string;
    }>;
}

export default async function BlogIdPage({ params }: PageParams) {
    const { blogId, locale } = await params;

    const blog = await fetchBlogSectionData(client, blogId, locale, 'lt')
    const giftCardWidget = await fetchGiftCardWidgetSectionData(client, locale, 'lt')
    const navigation = await fetchNavigationData(client, locale, 'lt')
    const footer = await fetchFooterSectionData(client, locale, 'lt')

    if (!blog) {
        return <div className="text-center py-20">Blog post not found.</div>;
    }

    return (
        <div className="blog flex-grow bg-gray-50 min-h-screen" id={blog.slug}>
            <Suspense fallback={<div className="h-24" />}>
                <NavigationContainer
                    isSimple
                    logo={navigation?.logo}
                    phone={navigation?.phone}
                />
            </Suspense>

            <main className="xl:container max-w-7xl min-h-[calc(100vh-130px)] mx-auto px-4 py-8 md:py-16 lg:py-24 flex flex-col gap-6 md:gap-8 lg:gap-10">
                {blog.image && (
                    <ImageContainer
                        classNames={{
                            image: 'w-full h-[200px] md:h-[300px] lg:h-[450px] object-cover rounded-3xl shadow-md',
                            root: 'h-full',
                        }}
                        height={450}
                        src={blog.image}
                        width={1500}
                    />
                )}

                <header>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">{blog.title}</h1>
                    <div className="text-gray-400 text-sm pb-4 border-b border-gray-100 flex gap-2 items-center">
                        <IconComponent className="w-4 h-4" name="calendar" />
                        {blog._createdAt?.split('T')[0]}
                    </div>
                </header>

                <article className="basis-1 flex-grow w-full prose prose-lg max-w-none">
                    <RichTextComponent content={blog.content} />
                </article>
            </main>

            <FooterContainer common={footer?.common} faq={footer?.faq} />

            {giftCardWidget?.title && (
                <Widget
                    image={giftCardWidget.image}
                    isVisible
                    link={giftCardWidget.link}
                    title={giftCardWidget.title}
                />
            )}
        </div>
    );
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
    const { blogId, locale } = await params;
    const blog = await fetchBlogSectionData(client, blogId, locale, 'lt');

    if (!blog) return { title: 'Blog Not Found | SeaSafari' };

    return {
        description: blog?.description,
        openGraph: {
            description: blog?.description,
            images: blog?.image ? [blog.image] : [],
            siteName: 'SeaSafari',
            title: blog?.title,
            type: 'article',
            url: `https://www.seasafari.lt/${locale}/blogs/${blog?.slug}`,
        },
        title: `${blog?.title} | SeaSafari`,
        twitter: {
            card: 'summary_large_image',
            description: blog?.description,
            images: blog?.image ? [blog.image] : [],
            title: blog?.title,
        },
    };
}
