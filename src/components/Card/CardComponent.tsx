import * as React from 'react';
import cn from 'clsx';
import { TypedObject } from '@portabletext/types';
import Link from 'next/link';
import type { UrlObject } from 'node:url';

import { ImageContainer } from '@/containers/Image/ImageContainer';
import { RichTextComponent } from '@/components/RichText/RichTextComponent';
import { IconComponent } from '@/components/Icon/IconComponent';

export enum CardType {
    Icon = 'icon',
    Image = 'image',
    Review = 'review',
    Blog = 'blog',
}

interface ComponentProps {
    type: CardType;
    title?: string;
    richDescription?: TypedObject | TypedObject[];
    description?: string;
    icon?: string;
    image?: string;
    linkUrl?: string | UrlObject;
    linkTitle?: string;
    createdAt?: string;
    onClick?: () => void;
    classNames?: {
        root?: string;
        image?: string;
        icon?: string;
    };
}

const ImageCard = ({ title, image, description, richDescription, classNames }: Partial<ComponentProps>) => (
    <div className={cn('bg-white rounded shadow-xl p-6 md:p-8 hover:shadow-red-100', classNames?.root)}>
        <div className="flex flex-col gap-4">
            <div className="relative text-center text-white">
                {title && (
                    <h2 className="absolute w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 px-4">
                        {title}
                    </h2>
                )}
                {image && (
                    <ImageContainer
                        src={image}
                        width={500}
                        height={250}
                        className={cn('w-full object-cover rounded', classNames?.image)}
                    />
                )}
            </div>
            {description && <p>{description}</p>}
            {richDescription && (
                <div>
                    <RichTextComponent content={richDescription} />
                </div>
            )}
        </div>
    </div>
);

const IconCard = ({ title, icon, image, onClick, classNames }: Partial<ComponentProps>) => (
    <div
        onClick={image ? onClick : undefined}
        className={cn(
            'bg-white rounded shadow-xl p-6 md:p-8',
            { 'shadow-red-100 cursor-pointer': image },
            classNames?.root
        )}
    >
        <div className="flex flex-col gap-2 items-center">
            {icon && <ImageContainer src={icon} width={60} height={60} className={classNames?.icon} />}
            {title && <p className="m-0">{title}</p>}
        </div>
    </div>
);

const ReviewCard = ({ title, image, description, classNames }: Partial<ComponentProps>) => (
    <div className="flex flex-col gap-2 items-center p-6 md:p-8 text-center">
        {image && (
            <ImageContainer
                src={image}
                width={120}
                height={120}
                className={cn('w-full rounded-full', classNames?.image)}
            />
        )}
        {title && <h2 className="text-lg lg:text-xl">{title}</h2>}
        {description && <p>{description}</p>}
    </div>
);

const BlogCard = ({
    title,
    image,
    description,
    linkUrl,
    linkTitle,
    createdAt,
    classNames,
}: Partial<ComponentProps>) => (
    <div className={cn('bg-white rounded border border-grey-100', classNames?.root)}>
        <div className="flex flex-col gap-4 grow h-full">
            {image && (
                <ImageContainer
                    src={image}
                    width={500}
                    height={250}
                    className={cn('w-full object-cover rounded-t', classNames?.image)}
                />
            )}
            <div className="px-4 grow h-full flex flex-col justify-between">
                <div>
                    {title && <h4 className="mb-0">{title}</h4>}
                    {description && <p className="mb-0">{description}</p>}
                </div>
                {linkUrl && (
                    <Link className="underline underline-offset-4 py-2 text-red-900 rounded" href={linkUrl}>
                        {linkTitle}
                    </Link>
                )}
            </div>
            <div className="bg-grey-50 text-grey-400 text-sm p-4 border-t border-grey-100 flex gap-2 items-center">
                <IconComponent name="calendar" className="w-4 h-4 text-grey-400" />
                {createdAt && createdAt?.split('T')[0]}
            </div>
        </div>
    </div>
);

export const CardComponent: React.FC<ComponentProps> = ({
    type,
    title,
    description,
    icon,
    image,
    linkUrl,
    linkTitle,
    createdAt,
    onClick,
    classNames = {},
}) => {
    const renderCardType = () => {
        switch (type) {
            case CardType.Image: {
                return <ImageCard title={title} description={description} image={image} classNames={classNames} />;
            }
            case CardType.Icon: {
                return <IconCard title={title} icon={icon} image={image} onClick={onClick} classNames={classNames} />;
            }
            case CardType.Review: {
                return <ReviewCard title={title} image={image} description={description} classNames={classNames} />;
            }
            case CardType.Blog: {
                return (
                    <BlogCard
                        title={title}
                        image={image}
                        description={description}
                        linkUrl={linkUrl}
                        linkTitle={linkTitle}
                        createdAt={createdAt}
                        classNames={classNames}
                    />
                );
            }
            default: {
                return null;
            }
        }
    };

    return renderCardType();
};

CardComponent.displayName = 'CardComponent';
