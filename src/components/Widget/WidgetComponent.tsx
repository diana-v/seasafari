import cn from 'clsx';
import * as React from 'react';

import { ImageContainer } from '@/containers/Image/ImageContainer';

export interface WidgetProps {
    className?: string;
    image?: string;
    isVisible?: boolean;
    link?: string;
    title?: string;
}

export const Widget: React.FC<WidgetProps> = ({ className, image, isVisible = true, link = '', title }) => {
    return (
        <a
            className={cn(
                'animate-pulseShadow group fixed bottom-5 right-5 z-50 flex items-center overflow-hidden h-16 w-16 rounded-full bg-orange-500 shadow-md',
                'hover:w-[320px] transition-all duration-300 ease-in-out',
                className,
                {
                    'opacity-0 pointer-events-none': !isVisible,
                    'opacity-100': isVisible,
                }
            )}
            href={link}
        >
            {image && (
                <div className="flex flex-shrink-0 items-center justify-center">
                    <ImageContainer
                        classNames={{ image: 'w-16 h-8', root: 'h-full' }}
                        hasPlaceholder={false}
                        height={32}
                        src={image}
                        width={32}
                    />
                </div>
            )}

            {title && (
                <span
                    className={cn(
                        'opacity-0 group-hover:opacity-100 group-hover:delay-100 transition-opacity duration-200 whitespace-nowrap text-md flex-grow text-white !mb-0'
                    )}
                >
                    {title}
                </span>
            )}
        </a>
    );
};

Widget.displayName = 'WidgetComponent';
