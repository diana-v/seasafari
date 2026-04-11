import cn from 'clsx';
import * as React from 'react';

interface ComponentProps {
    classNames?: {
        root?: string;
    };
    items?: readonly string[];
    onSelect: (item: string) => void;
    selectedItem?: string;
}

export const DropdownComponent = React.forwardRef<HTMLDivElement, ComponentProps>(
    ({ classNames, items, onSelect }, ref) => (
        <div className={cn('w-80 rounded shadow bg-white flex flex-col gap-4', classNames?.root)} ref={ref}>
            {items?.map((item, index) => (
                <button className="uppercase" key={index} onClick={() => onSelect(item)}>
                    {item}
                </button>
            ))}
        </div>
    )
);

DropdownComponent.displayName = 'DropdownComponent';
