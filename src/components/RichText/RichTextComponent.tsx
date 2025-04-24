import * as React from 'react';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { TypedObject } from '@portabletext/types';
import cn from 'clsx';

import { ImageContainer } from '@/containers/Image/ImageContainer';
import { getImageUrl } from '@/utils/getImageUrl';
import { getFileUrl } from '@/utils/getFileUrl';

interface ComponentProps {
    content: TypedObject | TypedObject[];
    classNames?: {
        root?: string;
    };
}

const components: PortableTextComponents = {
    types: {
        image: ({ value }) => {
            const imageUrl = getImageUrl(value?.asset?._ref);
            const position = value?.position;

            if (!imageUrl) {
                return null;
            }

            return (
                <div
                    className={cn('my-2', {
                        'md:float-left md:mr-4 md:max-w-[50%]': position === 'left',
                        'md:float-right md:ml-4 md:max-w-[50%]': position === 'right',
                    })}
                >
                    <ImageContainer
                        src={imageUrl}
                        width={1500}
                        height={250}
                        className="h-[200px] md:h-[300px] lg:h-[300px] object-cover rounded-md"
                    />
                </div>
            );
        },
        file: ({ value }) => {
            const videoUrl = getFileUrl(value?.asset?._ref);
            const position = value?.position;

            if (!videoUrl) return null;

            return (
                <div
                    className={cn('my-2', {
                        'md:float-left md:mr-4 md:max-w-[50%]': position === 'left',
                        'md:float-right md:ml-4 md:max-w-[50%]': position === 'right',
                    })}
                >
                    <video
                        width={1500}
                        height={600}
                        controls
                        className={cn('object-cover rounded-md', {
                            'h-[200px] md:h-[400px] lg:h-[600px]': position === 'center',
                            'h-[200px] md:h-[300px]': position !== 'center',
                        })}
                    >
                        <source src={videoUrl} type="video/mp4" />
                    </video>
                </div>
            );
        },
        normal: ({ children }: any) => {
            if (children.length === 1 && children[0] === '') {
                return <br />;
            }

            return <p>{children}</p>;
        },
    },
};

export const RichTextComponent: React.FC<ComponentProps> = ({ content, classNames }) => (
    <div className={classNames?.root}>
        <PortableText value={content} components={components} />
    </div>
);

RichTextComponent.displayName = 'RichTextComponent';
