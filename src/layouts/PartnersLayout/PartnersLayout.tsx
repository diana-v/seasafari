import * as React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useRouter } from 'next/router';

import { IconComponent } from '@/components/Icon/IconComponent';
import { ImageContainer } from '@/containers/Image/ImageContainer';
import { languages, LocaleType } from '@/translations/common';

export interface PartnersProps {
    title?: string;
    logos?: { image?: string }[];
}

export const PartnersLayout: React.FC<PartnersProps> = ({ title, logos }) => {
    const { locale, defaultLocale } = useRouter();
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
                        modules={[Navigation, Pagination]}
                        loop={true}
                        centeredSlides={true}
                        centerInsufficientSlides={true}
                        spaceBetween={32}
                        grabCursor={true}
                        navigation={{
                            nextEl: '.swiper-partners-button-next-custom',
                            prevEl: '.swiper-partners-button-prev-custom',
                        }}
                        pagination={{
                            el: '.swiper-partners-pagination-custom',
                            clickable: true,
                        }}
                        breakpoints={{
                            320: { slidesPerView: 1, spaceBetween: 20 },
                            768: { slidesPerView: 4, spaceBetween: 30 },
                            1024: { slidesPerView: 6, spaceBetween: 32 },
                        }}
                        className="!pb-2"
                    >
                        {logos?.map((logo, index) => (
                            <SwiperSlide key={index} className="flex items-center justify-center">
                                <ImageContainer
                                    src={logo.image}
                                    width={100}
                                    height={100}
                                    classNames={{
                                        root: 'h-[100px] md:w-[100px]',
                                        image: 'object-contain w-full h-[100px] md:h-[unset] md:w-[unset]',
                                    }}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <button
                        className="swiper-partners-button-prev-custom absolute top-1/2 -translate-y-1/2 left-0 z-20 w-10 h-10 rounded-full items-center justify-center text-blue-800 disabled:opacity-50 hidden md:flex"
                        aria-label={localisedString.previous}
                    >
                        <IconComponent name="arrow" className="w-5 h-5 rotate-180" />
                    </button>
                    <button
                        className="swiper-partners-button-next-custom absolute top-1/2 -translate-y-1/2 right-0 z-20 w-10 h-10 rounded-full items-center justify-center text-blue-800 disabled:opacity-50 hidden md:flex"
                        aria-label={localisedString.next}
                    >
                        <IconComponent name="arrow" className="w-5 h-5" />
                    </button>
                    <div className="swiper-partners-pagination-custom flex justify-center gap-2 md:hidden [&_.swiper-pagination-bullet]:!bg-blue-800/50 [&_.swiper-pagination-bullet-active]:!bg-blue-800" />
                </div>
            </div>
        </div>
    );
};
