import * as React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { CardComponent, CardType } from '@/components/Card/CardComponent';

type CardsType = {
    name?: string;
    review?: string;
    image?: string;
};

export interface ReviewsProps {
    sectionTitle?: string;
    title?: string;
    cards?: CardsType[];
}

export const ReviewsLayout: React.FC<ReviewsProps> = ({ sectionTitle, title, cards }) => {
    if (!cards?.length) {
        return null;
    }

    return (
        <div
            id={sectionTitle?.toLowerCase()}
            className="container mx-auto px-4 my-8 md:my-16 lg:my-24 flex flex-col items-center"
        >
            {title && <h1 className="uppercase">{title}</h1>}
            <div className="flex-grow w-full">
                <Swiper
                    loop
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        dynamicBullets: true,
                    }}
                    modules={[Autoplay, Pagination]}
                    style={{
                        '--swiper-pagination-color': '#7f1d1d',
                        '--swiper-pagination-bullet-size': '12px',
                    }}
                >
                    {cards?.map((card, index) => (
                        <SwiperSlide key={index}>
                            <CardComponent
                                type={CardType.Review}
                                image={card.image}
                                title={card.name}
                                description={card.review}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};
