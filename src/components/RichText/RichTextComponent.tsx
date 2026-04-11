import { PortableText, PortableTextComponents } from '@portabletext/react';
import { TypedObject } from '@portabletext/types';
import cn from 'clsx';
import * as React from 'react';

import { ImageContainer } from '@/containers/Image/ImageContainer';
import { getFileUrl } from '@/utils/getFileUrl';
import { getImageUrl } from '@/utils/getImageUrl';

interface ComponentProps {
    classNames?: {
        root?: string;
    };
    content: TypedObject | TypedObject[];
}

const components: PortableTextComponents = {
    types: {
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
                        className={cn('object-cover rounded-md', {
                            'h-[200px] md:h-[300px]': position !== 'center',
                            'h-[200px] md:h-[400px] lg:h-[600px]': position === 'center',
                        })}
                        controls
                        height={600}
                        width={1500}
                    >
                        <source src={videoUrl} type="video/mp4" />
                    </video>
                </div>
            );
        },
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
                        classNames={{
                            image: 'h-[200px] md:h-[300px] lg:h-[300px] object-cover rounded-md',
                            root: 'h-full',
                        }}
                        height={250}
                        src={imageUrl}
                        width={1500}
                    />
                </div>
            );
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        normal: ({ children }: any) => {
            if (children.length === 1 && children[0] === '') {
                return <br />;
            }

            return <p>{children}</p>;
        },
    },
};

export const RichTextComponent: React.FC<ComponentProps> = ({ classNames, content }) => (
    <div className={classNames?.root}>
        <PortableText components={components} value={content} />
    </div>
);

RichTextComponent.displayName = 'RichTextComponent';
