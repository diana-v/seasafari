import type { UrlObject } from 'node:url';

import { TypedObject } from '@portabletext/types';
import cn from 'clsx';
import Link from 'next/link';
import * as React from 'react';
import { ComponentPropsWithoutRef } from 'react';

import { IconComponent } from '@/components/Icon/IconComponent';
import { ImageContainer } from '@/containers/Image/ImageContainer';

export enum CardType {
    Blog = 'blog',
    Icon = 'icon',
    Image = 'image',
    Review = 'review',
}

export type ComponentProps = ComponentPropsWithoutRef<'div'> & CustomProps;

interface CustomProps {
    classNames?: {
        icon?: string;
        image?: string;
        root?: string;
    };
    createdAt?: string;
    date?: string;
    description?: string;
    icon?: string;
    image?: string;
    index?: number;
    isActive?: boolean;
    linkTitle?: string;
    linkUrl?: string | UrlObject;
    location?: string;
    onClick?: () => void;
    rating?: number;
    richDescription?: TypedObject | TypedObject[];
    title?: string;
    type: CardType;
}

const ImageCard = ({
    classNames,
    description,
    image,
    index,
    linkTitle,
    linkUrl,
    title,
    ...rest
}: Partial<ComponentProps>) => {
    const formattedIndex = index === undefined ? null : String(index + 1).padStart(2, '0');

    return (
        <div className={cn('flex flex-col xl:flex-row gap-8 xl:gap-16 items-start', classNames?.root)} {...rest}>
            <div className="flex flex-col gap-2 lg:gap-4 flex-none w-full xl:w-1/4">
                {formattedIndex && (
                    <div className="text-gray-400 text-lg lg:text-2xl font-semibold">/{formattedIndex}</div>
                )}
                <h3 className="font-bold text-gray-800">{title}</h3>
            </div>

            <div className="flex flex-col md:flex-row gap-8 md:gap-12 xl:gap-16 flex-1 items-center">
                {image && (
                    <ImageContainer
                        classNames={{
                            image: cn('w-full h-56 object-cover rounded-3xl', classNames?.image),
                            root: 'h-full w-full md:w-auto flex-1',
                        }}
                        height={300}
                        src={image}
                        width={450}
                    />
                )}

                <div className="flex flex-col gap-4 text-gray-700 flex-1">
                    <p>{description}</p>
                    {linkUrl && linkTitle && (
                        <Link
                            aria-label={linkTitle}
                            className="flex items-center gap-2 px-6 py-3 border border-blue-900 rounded-full text-blue-900 hover:bg-blue-900 hover:text-white transition-colors duration-200 w-fit"
                            href={linkUrl}
                            scroll={true}
                        >
                            {linkTitle}
                            <IconComponent className="h-2.5 w-3" name="arrowRightUp" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

const IconCard = ({ classNames, icon, image, onClick, title, ...rest }: Partial<ComponentProps>) => (
    <div
        className={cn(
            'bg-white rounded shadow-xl p-6 md:p-8',
            { 'shadow-red-100 cursor-pointer': image },
            classNames?.root
        )}
        onClick={image ? onClick : undefined}
        {...rest}
    >
        <div className="flex flex-col gap-2 items-center">
            {icon && (
                <ImageContainer
                    classNames={{ image: classNames?.icon, root: 'h-full' }}
                    height={60}
                    src={icon}
                    width={60}
                />
            )}
            {title && <p className="m-0">{title}</p>}
        </div>
    </div>
);

const ReviewCard = ({
    classNames,
    date,
    description,
    image,
    isActive,
    rating,
    title,
    ...rest
}: Partial<ComponentProps>) => {
    return (
        <div
            className={cn(
                'h-full flex flex-col text-center px-4 md:px-8 py-8 rounded-3xl bg-sky-100/10 border transition-all duration-300',
                { 'md:border-sky-800': isActive },
                classNames?.root
            )}
            {...rest}
        >
            <div className="flex-grow min-h-0">
                <div className="flex flex-col items-center mb-4">
                    {image && (
                        <div className="w-16 h-16 mb-2 md:mb-3 lg:mb-4">
                            <ImageContainer
                                alt={title || 'Client review'}
                                classNames={{
                                    image: cn('object-contain rounded-full', classNames?.image),
                                    root: 'h-full',
                                }}
                                height={64}
                                src={image}
                                width={64}
                            />
                        </div>
                    )}
                    {title && <div className="truncate text-lg lg:text-xl font-bold">{title}</div>}
                </div>
                {description && <p className="flex-grow line-clamp-2 lg:line-clamp-3">{description}</p>}
            </div>

            <div className="flex justify-between items-center">
                {date && <p className="opacity-40">{date}</p>}
                {rating && (
                    <div className={cn('flex items-center gap-1.5', { 'ml-auto': !date })}>
                        <IconComponent className="w-4 h-4 text-yellow-500" name="star" />
                        <p className="font-bold">{rating}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const BlogCard = ({ classNames, createdAt, description, image, linkTitle, linkUrl, title, ...rest }: Partial<ComponentProps>) => (
    <div
        className={cn(
            'w-full h-full flex flex-col xl:flex-row items-center gap-4 p-8 bg-white rounded-2xl transition-all duration-300',
            classNames?.root
        )}
        {...rest}
    >
        <div className="flex flex-col gap-2 lg:gap-4 h-full order-last xl:order-none">
            {title && <h3 className="text-2xl lg:text-3xl font-bold text-sky-900">{title}</h3>}

            {description && <p className="text-slate-600">{description}</p>}

            {linkUrl && (
                <Link
                    aria-label={linkTitle}
                    className="flex items-center gap-2 px-6 py-3 border border-blue-900 rounded-full text-blue-900 hover:bg-blue-900 hover:text-white transition-colors duration-200 w-fit mt-auto"
                    href={linkUrl}
                    scroll={true}
                >
                    {linkTitle && <div>{linkTitle}</div>}
                    <IconComponent className="w-2.5 h-3" name="arrowRightUp" />
                </Link>
            )}
        </div>

        {image && (
            <div className="w-full h-48 xl:w-64 xl:h-full flex-shrink-0 order-first xl:order-none">
                <ImageContainer
                    classNames={{
                        image: cn('w-full h-full object-cover rounded-2xl', classNames?.image),
                        root: 'h-full',
                    }}
                    height={500}
                    src={image}
                    width={500}
                />
            </div>
        )}
    </div>
);

export const CardComponent: React.FC<ComponentProps> = ({
    classNames = {},
    createdAt,
    description,
    icon,
    image,
    index,
    isActive,
    linkTitle,
    linkUrl,
    onClick,
    title,
    type,
    ...rest
}) => {
    const renderCardType = () => {
        switch (type) {
            case CardType.Blog: {
                return (
                    <BlogCard
                        classNames={classNames}
                        createdAt={createdAt}
                        description={description}
                        image={image}
                        linkTitle={linkTitle}
                        linkUrl={linkUrl}
                        title={title}
                        {...rest}
                    />
                );
            }
            case CardType.Icon: {
                return (
                    <IconCard
                        classNames={classNames}
                        icon={icon}
                        image={image}
                        onClick={onClick}
                        title={title}
                        {...rest}
                    />
                );
            }
            case CardType.Image: {
                return (
                    <ImageCard
                        classNames={classNames}
                        description={description}
                        image={image}
                        index={index}
                        linkTitle={linkTitle}
                        linkUrl={linkUrl}
                        title={title}
                        {...rest}
                    />
                );
            }
            case CardType.Review: {
                return (
                    <ReviewCard
                        classNames={classNames}
                        description={description}
                        image={image}
                        isActive={isActive}
                        title={title}
                        {...rest}
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
