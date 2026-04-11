'use client';

import cn from 'clsx';
import Image, { ImageProps } from 'next/image';
import * as React from 'react';

import { imagePlaceHolder } from '@/lib/imagePlaceHolder';

export interface ImageContainerProps extends Partial<ImageProps> {
    classNames?: {
        image?: string;
        root?: string;
    };
}

export const ImageContainer: React.FC<ImageContainerProps> = ({ alt, className, classNames, src, ...restProps }) => {
    const imageErrorHandler = React.useCallback((e: React.BaseSyntheticEvent) => {
        e.target.parentNode.parentNode.classList.add('none');
    }, []);

    if (!src) {
        return null;
    }

    return (
        <div className={cn('select-none flex relative', classNames?.root)}>
            <Image
                alt={alt ?? ''}
                blurDataURL={src?.toString().includes('http') ? imagePlaceHolder() : undefined}
                className={cn(classNames?.image, className)}
                loading="lazy"
                onError={imageErrorHandler}
                placeholder="blur"
                src={src}
                {...restProps}
            />
        </div>
    );
};
