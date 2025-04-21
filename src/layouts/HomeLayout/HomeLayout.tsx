import * as React from 'react';
import cn from 'clsx';

import { ImageContainer } from '@/containers/Image/ImageContainer';

export interface HomeProps {
    sectionTitle?: string;
    videoWebm?: string;
    videoMp4?: string;
    image?: string;
    heroMedia?: {
        desktopContent?: 'image' | 'video';
        mobileContent?: 'image' | 'video';
    };
    title?: string;
}

export const HomeLayout: React.FC<HomeProps> = ({ sectionTitle, videoWebm, videoMp4, image, heroMedia, title }) => {
    const { desktopContent, mobileContent } = heroMedia ?? {};

    return (
        <div id={sectionTitle?.toLowerCase()} className="relative h-screen w-full">
            <video
                autoPlay
                muted
                loop
                preload={'preload'}
                className={cn('h-screen w-full object-cover', {
                    hidden: mobileContent !== 'video',
                    'md:block': desktopContent === 'video',
                    'md:hidden': desktopContent !== 'video',
                })}
            >
                <source src={videoMp4} type="video/mp4" />
                <source src={videoWebm} type="video/webm" />
            </video>
            <ImageContainer
                src={image}
                height={750}
                width={1500}
                className={cn('h-screen w-full object-cover', {
                    hidden: mobileContent !== 'image',
                    'md:block': desktopContent === 'image',
                    'md:hidden': desktopContent !== 'image',
                })}
            />
            <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-3xl md:text-5xl lg:text-7xl text-center uppercase text-white w-full lg:px-24">
                {title}
            </h1>
        </div>
    );
};
