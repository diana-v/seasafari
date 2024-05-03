import * as React from 'react';
import cn from 'clsx';

interface ComponentProps {
    items: string[];
    onSelect: (item: string) => () => void;
    selectedItem?: string;
    classNames?: {
        root?: string;
    };
}

export const DropdownComponent = React.forwardRef<HTMLDivElement, ComponentProps>(
    ({ items, onSelect, classNames }, ref) => (
        <div ref={ref} className={cn('w-80 rounded shadow bg-white flex flex-col gap-4', classNames?.root)}>
            {items.map((item, index) => (
                <button key={index} className="uppercase" onClick={onSelect(item)}>
                    {item}
                </button>
            ))}
        </div>
    )
);

DropdownComponent.displayName = 'DropdownComponent';
