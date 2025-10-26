import * as React from 'react';
import cn from 'clsx';

import { ImageContainer } from '@/containers/Image/ImageContainer';

export interface WidgetProps {
    isVisible?: boolean;
    link?: string;
    title?: string;
    image?: string;
    className?: string;
}

export const Widget: React.FC<WidgetProps> = ({ isVisible = true, link = '', title, image, className }) => {
    return (
        <a
            href={link}
            className={cn(
                'animate-pulseShadow group fixed bottom-5 right-5 z-50 flex items-center overflow-hidden h-16 w-16 rounded-full bg-orange-500 shadow-md',
                'hover:w-[320px] transition-all duration-300 ease-in-out',
                className,
                {
                    'opacity-100': isVisible,
                    'opacity-0 pointer-events-none': !isVisible,
                }
            )}
        >
            {image && (
                <div className="flex flex-shrink-0 items-center justify-center">
                    <ImageContainer
                        src={image}
                        width={32}
                        height={32}
                        classNames={{ root: 'h-full', image: 'w-16 h-8' }}
                    />
                </div>
            )}

            {title && (
                <span
                    className={cn(
                        'opacity-0 group-hover:opacity-100 group-hover:delay-100 transition-opacity duration-200 whitespace-nowrap text-md flex-grow text-white'
                    )}
                >
                    {title}
                </span>
            )}
        </a>
    );
};

Widget.displayName = 'WidgetComponent';
