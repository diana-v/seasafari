import React, { useState } from 'react';
import cn from 'clsx';
import { TypedObject } from '@portabletext/types';

import { RichTextComponent } from '@/components/RichText/RichTextComponent';
import { IconComponent } from '@/components/Icon/IconComponent';

interface ComponentProps {
    items: {
        title: string;
        content: TypedObject | TypedObject[];
    }[];
}

export const AccordionComponent: React.FC<ComponentProps> = ({ items }) => {
    const [activeIndexes, setActiveIndexes] = useState<number[]>([]);

    const handleClick = React.useCallback(
        (index: number) => () =>
            setActiveIndexes((prevIndexes) => {
                const indexExists = prevIndexes.includes(index);

                return indexExists ? prevIndexes.filter((i) => i !== index) : [...prevIndexes, index];
            }),
        []
    );

    return (
        <div className="w-full bg-white">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="border border-b-0 last:border-b rounded first:rounded-t rounded-t-none rounded-b-none last:rounded-b border-neutral-300"
                >
                    <button
                        className="flex w-full items-center justify-between px-5 py-4 text-neutral-800 font-bold focus:outline-none"
                        type="button"
                        onClick={handleClick(index)}
                        aria-expanded={activeIndexes.includes(index)}
                        aria-controls={`collapse-${index}`}
                    >
                        {item.title}
                        <IconComponent
                            name="arrow"
                            className={cn('w-4 h-4 transition-all ease-in duration-200 transform', {
                                '-rotate-90': activeIndexes.includes(index),
                                'rotate-90': !activeIndexes.includes(index),
                            })}
                        />
                    </button>
                    <div
                        className={cn('transition-all ease-in-out duration-300 transform max-h-0 overflow-hidden', {
                            'max-h-screen': activeIndexes.includes(index),
                        })}
                    >
                        <RichTextComponent classNames={{ root: 'px-5 py-4' }} content={item.content} />
                    </div>
                </div>
            ))}
        </div>
    );
};

AccordionComponent.displayName = 'AccordionComponent';
