import * as React from 'react';
import Image, { ImageProps } from 'next/image';
import cn from 'clsx';

import { imagePlaceHolder } from '@/lib/imagePlaceHolder';

export interface ImageContainerProps extends Partial<ImageProps> {
    classNames?: {
        root?: string;
        image?: string;
    };
}

export const ImageContainer: React.FC<ImageContainerProps> = ({ src, alt, classNames, className, ...restProps }) => {
    const imageErrorHandler = React.useCallback((e: React.BaseSyntheticEvent) => {
        e.target.parentNode.parentNode.classList.add('none');
    }, []);

    if (!src) {
        return null;
    }

    return (
        <div className={cn('select-none flex relative', classNames?.root)}>
            <Image
                src={src}
                alt={alt ?? ''}
                loading="lazy"
                placeholder="blur"
                blurDataURL={src?.toString().includes('http') ? imagePlaceHolder() : undefined}
                onError={imageErrorHandler}
                className={cn(classNames?.image, className)}
                {...restProps}
            />
        </div>
    );
};
