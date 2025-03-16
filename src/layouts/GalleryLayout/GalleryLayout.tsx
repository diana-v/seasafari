import * as React from 'react';
import { TypedObject } from '@portabletext/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid, Navigation } from 'swiper/modules';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import { RichTextComponent } from '@/components/RichText/RichTextComponent';
import { IconComponent } from '@/components/Icon/IconComponent';
import { ImageContainer } from '@/containers/Image/ImageContainer';

type CardsType = {
    image?: string;
    url?: string;
};

export interface GalleryProps {
    sectionTitle?: string;
    title?: string;
    description?: TypedObject | TypedObject[];
    cards?: CardsType[];
}

export const GalleryLayout: React.FC<GalleryProps> = ({ sectionTitle, title, description, cards }) => {
    if (!cards?.length) {
        return null;
    }

    return (
        <div id={sectionTitle?.toLowerCase()} className="bg-grey-50 py-8 md:py-16 lg:py-24">
            <div className="container mx-auto px-4 flex flex-col items-center flex flex-col gap-6 md:gap-10 lg:gap-16">
                {(title || description) && (
                    <div className="max-w-5xl text-center">
                        {title && <h1 className="uppercase">{title}</h1>}
                        {description && <RichTextComponent content={description} />}
                    </div>
                )}
                {cards.length > 0 && (
                    <div className="flex-grow w-full">
                        <Swiper
                            navigation={{
                                nextEl: '.next',
                                prevEl: '.prev',
                            }}
                            grid={{
                                fill: 'row',
                            }}
                            breakpoints={{
                                640: {
                                    slidesPerView: 1,
                                    grid: { rows: 1 },
                                },
                                768: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                    grid: { rows: 1 },
                                },
                                1024: {
                                    slidesPerView: 3,
                                    spaceBetween: 30,
                                    grid: { rows: 2 },
                                },
                            }}
                            wrapperClass="!flex-[unset]"
                            modules={[Grid, Navigation]}
                        >
                            {cards.map((card, index) => (
                                <SwiperSlide key={index} className="!h-96 shadow-md">
                                    {card.url ? (
                                        <Link href={card.url} target="_blank">
                                            {card.image && (
                                                <ImageContainer
                                                    src={card.image}
                                                    width={500}
                                                    height={500}
                                                    className="h-full flex-grow object-cover"
                                                />
                                            )}
                                        </Link>
                                    ) : (
                                        card.image && (
                                            <ImageContainer
                                                src={card.image}
                                                width={500}
                                                height={500}
                                                className="h-full flex-grow object-cover"
                                            />
                                        )
                                    )}
                                </SwiperSlide>
                            ))}
                            <div className="prev absolute left-4 top-0 z-10 flex h-full items-center justify-center sm:left-8 lg:left-10 [&.swiper-button-disabled_>_svg]:opacity-30 [&.swiper-button-disabled_>_svg]:cursor-default">
                                <IconComponent
                                    name="arrow"
                                    className="rotate-180 opacity-70 bg-grey-50 shadow-md rounded-full p-4 lg:p-6 h-12 w-12 lg:h-16 lg:w-16 text-red-800 cursor-pointer"
                                />
                            </div>

                            <div className="next absolute right-4 top-0 z-10 flex h-full items-center justify-center sm:right-8 lg:right-10 [&.swiper-button-disabled_>_svg]:opacity-30 [&.swiper-button-disabled_>_svg]:cursor-default">
                                <IconComponent
                                    name="arrow"
                                    className="opacity-70 bg-grey-50 shadow-md rounded-full p-4 lg:p-6 h-12 w-12 lg:h-16 lg:w-16 text-red-800 cursor-pointer "
                                />
                            </div>
                        </Swiper>
                    </div>
                )}
            </div>
        </div>
    );
};
