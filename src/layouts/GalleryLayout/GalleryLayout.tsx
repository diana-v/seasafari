import * as React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import { IconComponent } from '@/components/Icon/IconComponent';
import { ImageContainer } from '@/containers/Image/ImageContainer';

type CardsType = {
    image?: string;
    url?: string;
};

export interface GalleryProps {
    cards?: CardsType[];
}

export const GalleryLayout: React.FC<GalleryProps> = ({ cards }) => {
    if (!cards?.length) {
        return null;
    }

    return (
        <div className="pt-8 md:pt-16 lg:pt-24 isolation-isolate">
            <div className="mx-auto px-4 flex flex-col items-center gap-6 md:gap-10 lg:gap-16">
                {cards.length > 0 && (
                    <div className="flex-grow w-full">
                        <Swiper
                            navigation={{
                                nextEl: '.next',
                                prevEl: '.prev',
                            }}
                            spaceBetween={20}
                            modules={[Navigation]}
                            className="w-full"
                            slidesPerView={1}
                            breakpoints={{
                                768: {
                                    slidesPerView: 'auto',
                                },
                            }}
                        >
                            {cards.map((card, index) => (
                                <SwiperSlide key={index} className="!h-96 md:!w-auto shadow-md rounded-3xl">
                                    {card.url ? (
                                        <Link href={card.url} target="_blank" aria-label={card.url}>
                                            {card.image && (
                                                <ImageContainer
                                                    src={card.image}
                                                    width={500}
                                                    height={500}
                                                    classNames={{
                                                        root: 'h-full',
                                                        image: 'h-full w-full flex-grow object-cover rounded-3xl',
                                                    }}
                                                />
                                            )}
                                        </Link>
                                    ) : (
                                        card.image && (
                                            <ImageContainer
                                                src={card.image}
                                                width={500}
                                                height={500}
                                                classNames={{
                                                    root: 'h-full',
                                                    image: 'h-full w-full flex-grow rounded-3xl',
                                                }}
                                            />
                                        )
                                    )}
                                </SwiperSlide>
                            ))}
                            <div className="prev absolute left-4 top-0 z-10 flex h-full items-center justify-center sm:left-8 lg:left-10 [&.swiper-button-disabled_>_svg]:opacity-30 [&.swiper-button-disabled_>_svg]:cursor-default">
                                <IconComponent
                                    name="arrow"
                                    className="rotate-180 opacity-70 bg-grey-50 shadow-md rounded-full p-4 lg:p-6 h-12 w-12 lg:h-16 lg:w-16 text-blue-800 cursor-pointer"
                                />
                            </div>

                            <div className="next absolute right-4 top-0 z-10 flex h-full items-center justify-center sm:right-8 lg:right-10 [&.swiper-button-disabled_>_svg]:opacity-30 [&.swiper-button-disabled_>_svg]:cursor-default">
                                <IconComponent
                                    name="arrow"
                                    className="opacity-70 bg-grey-50 shadow-md rounded-full p-4 lg:p-6 h-12 w-12 lg:h-16 lg:w-16 text-blue-800 cursor-pointer"
                                />
                            </div>
                        </Swiper>
                    </div>
                )}
            </div>
        </div>
    );
};
