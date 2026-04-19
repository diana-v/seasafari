'use client';

import { useParams } from 'next/navigation';
import * as React from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';

import { CardComponent, CardType } from '@/components/Card/CardComponent';
import { IconComponent } from '@/components/Icon/IconComponent';
import { languages, LocaleType } from '@/translations/common';

export interface GoogleReview {
    comment?: string;
    createTime: string;
    name: string;
    reviewer: {
        displayName: string;
        profilePhotoUrl: string;
    };
    reviewId: string;
    starRating: 'FIVE' | 'FOUR' | 'ONE' | 'THREE' | 'TWO';
    updateTime: string;
}

export interface GoogleReviewsResponse {
    averageRating?: number;
    reviews?: GoogleReview[];
    totalReviewCount?: number;
}

export interface ReviewsProps {
    reviewsData?: GoogleReviewsResponse;
    title?: string;
}

export const ReviewsLayout: React.FC<ReviewsProps> = ({ reviewsData, title }) => {
    const params = useParams();
    const locale = params.locale as string;
    const defaultLocale = 'lt';
    const localisedString = languages[(locale ?? defaultLocale) as LocaleType];

    if (!reviewsData?.reviews?.length) {
        return null;
    }

    const STAR_RATING_MAP: Record<string, number> = {
        FIVE: 5,
        FOUR: 4,
        ONE: 1,
        THREE: 3,
        TWO: 2,
    };

    return (
        <div className="pt-16 lg:pt-24 isolation-isolate">
            <div className="xl:container mx-auto px-4 flex flex-col items-center gap-4 lg:gap-8">
                <div className="text-center max-w-3xl">{title && <h2>{title}</h2>}</div>

                <div className="relative w-full">
                    <div className="hidden md:block absolute left-0 top-0 bottom-0 z-10 w-24 lg:w-64 bg-gradient-to-r from-white to-transparent pointer-events-none" />
                    <div className="hidden md:block absolute right-0 top-0 bottom-0 z-10 w-24 lg:w-64 bg-gradient-to-l from-white to-transparent pointer-events-none" />
                    <Swiper
                        breakpoints={{
                            320: { slidesPerView: 1, spaceBetween: 20 },
                            768: { slidesPerView: 2, spaceBetween: 30 },
                            1024: { slidesPerView: 3, spaceBetween: 32 },
                        }}
                        centeredSlides={true}
                        className="!pb-2"
                        grabCursor={true}
                        loop={true}
                        modules={[Navigation, Pagination]}
                        navigation={{
                            nextEl: '.swiper-reviews-button-next-custom',
                            prevEl: '.swiper-reviews-button-prev-custom',
                        }}
                        pagination={{
                            clickable: true,
                            el: '.swiper-reviews-pagination-custom',
                        }}
                        spaceBetween={32}
                    >
                        {reviewsData?.reviews
                            ?.filter(
                                (review) =>
                                    (review.starRating === 'FIVE' || review.starRating === 'FOUR') && !!review.comment
                            )
                            .map((review, index) => (
                                <SwiperSlide className="flex !h-80" key={index}>
                                    {({ isActive }) => (
                                        <CardComponent
                                            date={new Date(review.updateTime).toISOString().split('T')[0]}
                                            description={review.comment?.split('(Translated by Google)')[0].trim()}
                                            image={review.reviewer.profilePhotoUrl}
                                            isActive={isActive}
                                            rating={STAR_RATING_MAP[review.starRating]}
                                            title={review.reviewer.displayName}
                                            type={CardType.Review}
                                        />
                                    )}
                                </SwiperSlide>
                            ))}
                    </Swiper>
                    <button
                        aria-label={localisedString.previous}
                        className="swiper-reviews-button-prev-custom absolute top-1/2 -translate-y-1/2 left-0 z-20 w-10 h-10 rounded-full items-center justify-center text-blue-800 disabled:opacity-50 hidden md:flex"
                    >
                        <IconComponent className="w-5 h-5 rotate-180" name="arrow" />
                    </button>
                    <button
                        aria-label={localisedString.next}
                        className="swiper-reviews-button-next-custom absolute top-1/2 -translate-y-1/2 right-0 z-20 w-10 h-10 rounded-full items-center justify-center text-blue-800 disabled:opacity-50 hidden md:flex"
                    >
                        <IconComponent className="w-5 h-5" name="arrow" />
                    </button>
                </div>
                <div className="swiper-reviews-pagination-custom flex justify-center gap-2 md:hidden [&_.swiper-pagination-bullet]:!bg-blue-800/50 [&_.swiper-pagination-bullet-active]:!bg-blue-800" />
            </div>
        </div>
    );
};
