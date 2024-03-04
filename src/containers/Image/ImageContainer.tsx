import * as React from 'react';
import Image, { ImageProps } from 'next/image';

import { imagePlaceHolder } from '@/lib/imagePlaceHolder';

export const ImageContainer: React.FC<Partial<ImageProps>> = ({ src, alt, ...restProps }) => {
    const imageErrorHandler = React.useCallback((e: React.BaseSyntheticEvent) => {
        e.target.parentNode.parentNode.classList.add('none');
    }, []);

    if (!src) {
        return null;
    }

    return (
        <div className="flex relative">
            <Image
                src={src}
                alt={alt ?? ''}
                loading="lazy"
                placeholder="blur"
                blurDataURL={src?.toString().includes('http') ? imagePlaceHolder() : undefined}
                onError={imageErrorHandler}
                {...restProps}
            />
        </div>
    );
};
