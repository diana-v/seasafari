'use client';

import { useParams } from 'next/navigation';
import * as React from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';

import { IconComponent } from '@/components/Icon/IconComponent';
import { ImageContainer } from '@/containers/Image/ImageContainer';
import { languages, LocaleType } from '@/translations/common';

export interface PartnersProps {
    logos?: { image?: string }[];
    title?: string;
}

export const PartnersLayout: React.FC<PartnersProps> = ({ logos, title }) => {
    const params = useParams();
    const locale = params.locale as string;
    const defaultLocale = 'lt';
    const localisedString = languages[(locale ?? defaultLocale) as LocaleType];

    if (!logos?.length) {
        return null;
    }

    return (
        <div className="py-16 lg:py-24">
            <div className="xl:container mx-auto px-4 flex flex-col items-center gap-8 lg:gap-16">
                <div className="text-center max-w-3xl">{title && <h2>{title}</h2>}</div>

                <div className="relative w-full">
                    <div className="hidden md:block absolute left-0 top-0 bottom-0 z-10 w-24 lg:w-64 bg-gradient-to-r from-white to-transparent pointer-events-none" />
                    <div className="hidden md:block absolute right-0 top-0 bottom-0 z-10 w-24 lg:w-64 bg-gradient-to-l from-white to-transparent pointer-events-none" />
                    <Swiper
                        breakpoints={{
                            320: { slidesPerView: 1, spaceBetween: 20 },
                            768: { slidesPerView: 4, spaceBetween: 30 },
                            1024: { slidesPerView: 6, spaceBetween: 32 },
                        }}
                        centeredSlides={true}
                        centerInsufficientSlides={true}
                        className="!pb-2"
                        grabCursor={true}
                        loop={true}
                        modules={[Navigation, Pagination]}
                        navigation={{
                            nextEl: '.swiper-partners-button-next-custom',
                            prevEl: '.swiper-partners-button-prev-custom',
                        }}
                        pagination={{
                            clickable: true,
                            el: '.swiper-partners-pagination-custom',
                        }}
                        spaceBetween={32}
                    >
                        {logos?.map((logo, index) => (
                            <SwiperSlide className="flex items-center justify-center" key={index}>
                                <ImageContainer
                                    classNames={{
                                        image: 'object-contain w-full h-[100px] md:h-full md:w-[unset]',
                                        root: 'h-[100px] md:w-[100px]',
                                    }}
                                    height={100}
                                    src={logo.image}
                                    width={100}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <button
                        aria-label={localisedString.previous}
                        className="swiper-partners-button-prev-custom absolute top-1/2 -translate-y-1/2 left-0 z-20 w-10 h-10 rounded-full items-center justify-center text-blue-800 disabled:opacity-50 hidden md:flex"
                    >
                        <IconComponent className="w-5 h-5 rotate-180" name="arrow" />
                    </button>
                    <button
                        aria-label={localisedString.next}
                        className="swiper-partners-button-next-custom absolute top-1/2 -translate-y-1/2 right-0 z-20 w-10 h-10 rounded-full items-center justify-center text-blue-800 disabled:opacity-50 hidden md:flex"
                    >
                        <IconComponent className="w-5 h-5" name="arrow" />
                    </button>
                    <div className="swiper-partners-pagination-custom flex justify-center gap-2 md:hidden [&_.swiper-pagination-bullet]:!bg-blue-800/50 [&_.swiper-pagination-bullet-active]:!bg-blue-800" />
                </div>
            </div>
        </div>
    );
};
