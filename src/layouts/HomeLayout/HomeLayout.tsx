'use client';

import cn from 'clsx';
import { useParams } from 'next/navigation';
import * as React from 'react';

import { IconComponent } from '@/components/Icon/IconComponent';
import { ImageContainer } from '@/containers/Image/ImageContainer';
import { languages, LocaleType } from '@/translations/common';

export interface HomeProps {
    cta?: {
        label?: string;
        link?: string;
    };
    heroMedia?: {
        desktopContent?: 'image' | 'video';
        mobileContent?: 'image' | 'video';
    };
    image?: string;
    subtitle?: string;
    title?: string;
    videoMp4?: string;
    videoWebm?: string;
}

export const HomeLayout: React.FC<HomeProps> = ({ cta, heroMedia, image, subtitle, title, videoMp4, videoWebm }) => {
    const params = useParams();
    const locale = params.locale as string;
    const defaultLocale = 'lt';
    const localisedString = languages[(locale ?? defaultLocale) as LocaleType];

    const { desktopContent, mobileContent } = heroMedia ?? {};

    return (
        <div className="absolute top-0 h-screen w-full">
            <video
                autoPlay
                className={cn('h-screen w-full object-cover', {
                    hidden: mobileContent !== 'video',
                    'md:block': desktopContent === 'video',
                    'md:hidden': desktopContent !== 'video',
                })}
                loop
                muted
                playsInline
                preload="auto"
            >
                <source src={videoMp4} type="video/mp4" />
                <source src={videoWebm} type="video/webm" />
            </video>
            <ImageContainer
                classNames={{
                    image: cn('h-screen w-full object-cover', {
                        hidden: mobileContent !== 'image',
                        'md:block': desktopContent === 'image',
                        'md:hidden': desktopContent !== 'image',
                    }),
                    root: 'h-full',
                }}
                height={750}
                src={image}
                width={1500}
            />

            <div className="shadow-inner-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex h-full w-full flex-col items-center justify-center p-4 text-center text-white">
                {title && <h1 className="tracking-tight">{title}</h1>}
                {subtitle && (
                    <div className="mt-4 max-w-xl text-md font-extralight text-sm md:text-2xl lg:max-w-2xl">
                        {subtitle}
                    </div>
                )}
                {cta && (
                    <a
                        className="mt-8 rounded bg-orange-500 px-10 py-3 text-sm md:text-lg lg:max-w-xl font-bold uppercase tracking-wider transition-transform hover:scale-105"
                        href={cta.link}
                    >
                        {cta.label}
                    </a>
                )}
            </div>

            <a
                aria-label={localisedString.scrollDown}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden flex-col items-center gap-2 text-sm uppercase tracking-widest md:flex animate-bounce z-10"
                href="#offers"
            >
                <IconComponent className="rotate-90 h-6 w-6 text-white" name="arrow" />
            </a>
        </div>
    );
};
