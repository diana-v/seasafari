import * as React from 'react';
import cn from 'clsx';
import { TypedObject } from '@portabletext/types';

import { ImageContainer } from '@/containers/Image/ImageContainer';
import { RichTextComponent } from '@/components/RichText/RichTextComponent';

export enum CardType {
    Icon = 'icon',
    Image = 'image',
    Review = 'review',
}

interface ComponentProps {
    type: CardType;
    title?: string;
    richDescription?: TypedObject | TypedObject[];
    description?: string;
    icon?: string;
    image?: string;
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

export const CardComponent: React.FC<ComponentProps> = ({
    type,
    title,
    description,
    icon,
    image,
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
            default: {
                return null;
            }
        }
    };

    return renderCardType();
};

CardComponent.displayName = 'CardComponent';
