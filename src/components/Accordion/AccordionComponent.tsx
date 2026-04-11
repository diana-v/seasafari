import { TypedObject } from '@portabletext/types';
import cn from 'clsx';
import React, { useState } from 'react';

import { IconComponent } from '@/components/Icon/IconComponent';
import { RichTextComponent } from '@/components/RichText/RichTextComponent';

interface ComponentProps {
    items: {
        content: TypedObject | TypedObject[];
        title: string;
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
                    className="border border-b-0 last:border-b rounded first:rounded-t rounded-t-none rounded-b-none last:rounded-b border-neutral-300"
                    key={index}
                >
                    <button
                        aria-controls={`collapse-${index}`}
                        aria-expanded={activeIndexes.includes(index)}
                        className="flex w-full items-center justify-between px-5 py-4 text-neutral-800 font-bold focus:outline-none"
                        onClick={handleClick(index)}
                        type="button"
                    >
                        {item.title}
                        <IconComponent
                            className={cn('w-4 h-4 transition-all ease-in duration-200 transform', {
                                '-rotate-90': activeIndexes.includes(index),
                                'rotate-90': !activeIndexes.includes(index),
                            })}
                            name="arrow"
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
