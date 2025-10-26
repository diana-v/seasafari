import * as React from 'react';
import cn from 'clsx';
import { TypedObject } from '@portabletext/types';
import Link from 'next/link';
import type { UrlObject } from 'node:url';
import { ComponentPropsWithoutRef } from 'react';

import { ImageContainer } from '@/containers/Image/ImageContainer';
import { IconComponent } from '@/components/Icon/IconComponent';

export enum CardType {
    Icon = 'icon',
    Image = 'image',
    Review = 'review',
    Blog = 'blog',
}

interface CustomProps {
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
    isActive?: boolean;
    location?: string;
    date?: string;
    rating?: number;
    index?: number;
    classNames?: {
        root?: string;
        image?: string;
        icon?: string;
    };
}

export type ComponentProps = CustomProps & ComponentPropsWithoutRef<'div'>;

const ImageCard = ({
    title,
    image,
    description,
    index,
    classNames,
    linkUrl,
    linkTitle,
    ...rest
}: Partial<ComponentProps>) => {
    const formattedIndex = index === undefined ? null : String(index + 1).padStart(2, '0');

    return (
        <div
            className={cn('mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 xl:gap-16 items-center', classNames?.root)}
            {...rest}
        >
            <div className="flex flex-col gap-2 lg:gap-4 md:col-span-4 xl:col-span-1">
                {formattedIndex && (
                    <div className="text-gray-400 text-lg lg:text-2xl font-semibold">/{formattedIndex}</div>
                )}
                <h3 className="font-bold text-gray-800">{title}</h3>
            </div>

            <div className="md:col-span-4 xl:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 xl:gap-16 items-center">
                {image && (
                    <ImageContainer
                        src={image}
                        width={450}
                        height={300}
                        classNames={{
                            root: 'h-full',
                            image: cn('w-full h-56 object-cover rounded-3xl', classNames?.image),
                        }}
                    />
                )}

                <div className="flex flex-col gap-4 text-gray-700">
                    <p>{description}</p>
                    {linkUrl && linkTitle && (
                        <Link
                            href={linkUrl}
                            className="flex items-center gap-2 px-6 py-3 border border-blue-900 rounded-full text-blue-900 hover:bg-blue-900 hover:text-white transition-colors duration-200 w-fit"
                        >
                            {linkTitle}
                            <IconComponent name="arrowRightUp" className="h-2.5 w-3" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

const IconCard = ({ title, icon, image, onClick, classNames, ...rest }: Partial<ComponentProps>) => (
    <div
        onClick={image ? onClick : undefined}
        className={cn(
            'bg-white rounded shadow-xl p-6 md:p-8',
            { 'shadow-red-100 cursor-pointer': image },
            classNames?.root
        )}
        {...rest}
    >
        <div className="flex flex-col gap-2 items-center">
            {icon && (
                <ImageContainer
                    src={icon}
                    width={60}
                    height={60}
                    classNames={{ root: 'h-full', image: classNames?.icon }}
                />
            )}
            {title && <p className="m-0">{title}</p>}
        </div>
    </div>
);

const ReviewCard = ({
    title,
    image,
    description,
    isActive,
    location,
    date,
    rating,
    classNames,
    ...rest
}: Partial<ComponentProps>) => {
    return (
        <div
            className={cn(
                'h-full flex flex-col text-center px-4 md:px-8 py-8 md:py-16 rounded-3xl bg-sky-100/10 border transition-all duration-300',
                { 'md:border-sky-800': isActive },
                classNames?.root
            )}
            {...rest}
        >
            <div className="flex-grow min-h-0">
                <div className="flex flex-col items-center mb-4">
                    {image && (
                        <div className="w-16 h-16">
                            <ImageContainer
                                src={image}
                                alt={title || 'Client review'}
                                width={64}
                                height={64}
                                classNames={{
                                    root: 'h-full',
                                    image: cn('object-contain rounded-full', classNames?.image),
                                }}
                            />
                        </div>
                    )}
                    {title && <h4 className="truncate">{title}</h4>}
                    {location && <p className="opacity-40">{location}</p>}
                </div>
                {description && <p className="flex-grow line-clamp-2 lg:line-clamp-3">{description}</p>}
            </div>

            <div className="flex justify-between items-center">
                {date && <p className="opacity-40">{date}</p>}
                {rating && (
                    <div className={cn('flex items-center gap-1.5', { 'ml-auto': !date })}>
                        <IconComponent name="star" className="w-4 h-4 text-yellow-500" />
                        <p className="font-bold">{rating.toFixed(1)}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const BlogCard = ({ title, image, description, linkUrl, linkTitle, classNames, ...rest }: Partial<ComponentProps>) => (
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
                    href={linkUrl}
                    className="flex items-center gap-2 px-6 py-3 border border-blue-900 rounded-full text-blue-900 hover:bg-blue-900 hover:text-white transition-colors duration-200 w-fit mt-auto"
                >
                    {linkTitle && <div>{linkTitle}</div>}
                    <IconComponent name="arrowRightUp" className="w-2.5 h-3" />
                </Link>
            )}
        </div>

        {image && (
            <div className="w-full h-48 xl:w-64 xl:h-full flex-shrink-0 order-first xl:order-none">
                <ImageContainer
                    src={image}
                    width={500}
                    height={500}
                    classNames={{
                        root: 'h-full',
                        image: cn('w-full h-full object-cover rounded-2xl', classNames?.image),
                    }}
                />
            </div>
        )}
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
    index,
    isActive,
    classNames = {},
    ...rest
}) => {
    const renderCardType = () => {
        switch (type) {
            case CardType.Image: {
                return (
                    <ImageCard
                        title={title}
                        description={description}
                        image={image}
                        classNames={classNames}
                        linkUrl={linkUrl}
                        linkTitle={linkTitle}
                        index={index}
                        {...rest}
                    />
                );
            }
            case CardType.Icon: {
                return (
                    <IconCard
                        title={title}
                        icon={icon}
                        image={image}
                        onClick={onClick}
                        classNames={classNames}
                        {...rest}
                    />
                );
            }
            case CardType.Review: {
                return (
                    <ReviewCard
                        title={title}
                        image={image}
                        description={description}
                        classNames={classNames}
                        isActive={isActive}
                        {...rest}
                    />
                );
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
