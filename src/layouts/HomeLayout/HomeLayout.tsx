import * as React from 'react';
import cn from 'clsx';
import { useRouter } from 'next/router';

import { ImageContainer } from '@/containers/Image/ImageContainer';
import { IconComponent } from '@/components/Icon/IconComponent';
import { languages, LocaleType } from '@/translations/common';

export interface HomeProps {
    videoWebm?: string;
    videoMp4?: string;
    image?: string;
    heroMedia?: {
        desktopContent?: 'image' | 'video';
        mobileContent?: 'image' | 'video';
    };
    title?: string;
    subtitle?: string;
    cta?: {
        link?: string;
        label?: string;
    };
}

export const HomeLayout: React.FC<HomeProps> = ({ videoWebm, videoMp4, image, heroMedia, title, subtitle, cta }) => {
    const { locale, defaultLocale } = useRouter();
    const localisedString = languages[(locale ?? defaultLocale) as LocaleType];

    const { desktopContent, mobileContent } = heroMedia ?? {};

    return (
        <div className="absolute top-0 h-screen w-full">
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
                classNames={{
                    root: 'h-full',
                    image: cn('h-screen w-full object-cover', {
                        hidden: mobileContent !== 'image',
                        'md:block': desktopContent === 'image',
                        'md:hidden': desktopContent !== 'image',
                    }),
                }}
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
                        href={cta.link}
                        className="mt-8 rounded bg-orange-500 px-10 py-3 text-sm md:text-lg lg:max-w-xl font-bold uppercase tracking-wider transition-transform hover:scale-105"
                    >
                        {cta.label}
                    </a>
                )}
            </div>

            <a
                href="#offers"
                aria-label={localisedString.scrollDown}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden flex-col items-center gap-2 text-sm uppercase tracking-widest md:flex animate-bounce z-10"
            >
                <IconComponent name="arrow" className="rotate-90 h-6 w-6 text-white" />
            </a>
        </div>
    );
};
