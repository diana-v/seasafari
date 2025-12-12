import * as React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useRouter } from 'next/router';

import { IconComponent } from '@/components/Icon/IconComponent';
import { CardComponent, CardType } from '@/components/Card/CardComponent';
import { languages, LocaleType } from '@/translations/common';

export interface GoogleReview {
    reviewId: string;
    reviewer: {
        profilePhotoUrl: string;
        displayName: string;
    };
    starRating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE';
    comment?: string;
    createTime: string;
    updateTime: string;
    name: string;
}

export interface GoogleReviewsResponse {
    reviews?: GoogleReview[];
    averageRating?: number;
    totalReviewCount?: number;
}

export interface ReviewsProps {
    title?: string;
    reviewsData?: GoogleReviewsResponse;
}

export const ReviewsLayout: React.FC<ReviewsProps> = ({ title, reviewsData }) => {
    const { locale, defaultLocale } = useRouter();
    const localisedString = languages[(locale ?? defaultLocale) as LocaleType];

    if (!reviewsData?.reviews?.length) {
        return null;
    }

    const STAR_RATING_MAP: Record<string, number> = {
        FIVE: 5,
        FOUR: 4,
        THREE: 3,
        TWO: 2,
        ONE: 1,
    };

    return (
        <div className="pt-16 lg:pt-24">
            <div className="xl:container mx-auto px-4 flex flex-col items-center gap-4 lg:gap-8">
                <div className="text-center max-w-3xl">{title && <h2>{title}</h2>}</div>

                <div className="relative w-full">
                    <div className="hidden md:block absolute left-0 top-0 bottom-0 z-10 w-24 lg:w-64 bg-gradient-to-r from-white to-transparent pointer-events-none" />
                    <div className="hidden md:block absolute right-0 top-0 bottom-0 z-10 w-24 lg:w-64 bg-gradient-to-l from-white to-transparent pointer-events-none" />
                    <Swiper
                        modules={[Navigation, Pagination]}
                        loop={true}
                        centeredSlides={true}
                        spaceBetween={32}
                        grabCursor={true}
                        navigation={{
                            nextEl: '.swiper-reviews-button-next-custom',
                            prevEl: '.swiper-reviews-button-prev-custom',
                        }}
                        pagination={{
                            el: '.swiper-reviews-pagination-custom',
                            clickable: true,
                        }}
                        breakpoints={{
                            320: { slidesPerView: 1, spaceBetween: 20 },
                            768: { slidesPerView: 2, spaceBetween: 30 },
                            1024: { slidesPerView: 3, spaceBetween: 32 },
                        }}
                        className="!pb-2"
                    >
                        {reviewsData?.reviews
                            ?.filter(
                                (review) =>
                                    (review.starRating === 'FIVE' || review.starRating === 'FOUR') && !!review.comment
                            )
                            .map((review, index) => (
                                <SwiperSlide key={index} className="flex !h-80">
                                    {({ isActive }) => (
                                        <CardComponent
                                            type={CardType.Review}
                                            isActive={isActive}
                                            image={review.reviewer.profilePhotoUrl}
                                            title={review.reviewer.displayName}
                                            description={review.comment?.split('(Translated by Google)')[0].trim()}
                                            date={new Date(review.updateTime).toISOString().split('T')[0]}
                                            rating={STAR_RATING_MAP[review.starRating]}
                                        />
                                    )}
                                </SwiperSlide>
                            ))}
                    </Swiper>
                    <button
                        className="swiper-reviews-button-prev-custom absolute top-1/2 -translate-y-1/2 left-0 z-20 w-10 h-10 rounded-full items-center justify-center text-blue-800 disabled:opacity-50 hidden md:flex"
                        aria-label={localisedString.previous}
                    >
                        <IconComponent name="arrow" className="w-5 h-5 rotate-180" />
                    </button>
                    <button
                        className="swiper-reviews-button-next-custom absolute top-1/2 -translate-y-1/2 right-0 z-20 w-10 h-10 rounded-full items-center justify-center text-blue-800 disabled:opacity-50 hidden md:flex"
                        aria-label={localisedString.next}
                    >
                        <IconComponent name="arrow" className="w-5 h-5" />
                    </button>
                </div>
                <div className="swiper-reviews-pagination-custom flex justify-center gap-2 md:hidden [&_.swiper-pagination-bullet]:!bg-blue-800/50 [&_.swiper-pagination-bullet-active]:!bg-blue-800" />
            </div>
        </div>
    );
};
