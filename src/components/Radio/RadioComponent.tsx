import * as React from 'react';
import cn from 'clsx';

interface ComponentProps {
    item: {
        value: number;
        label: string;
    };
    onChange: (value: number) => void;
    checked: boolean;
    classNames?: {
        root?: string;
    };
}

export const RadioComponent: React.FC<ComponentProps> = ({ item, onChange, checked, classNames }) => {
    return (
        <div
            className={cn(
                'relative rounded bg-white p-3 text-center uppercase border-2',
                {
                    'border-red-900': checked,
                    'border-grey-100': !checked,
                },
                classNames?.root
            )}
        >
            <input
                type="radio"
                id={item.value.toString()}
                value={item.value}
                checked={checked}
                onChange={() => onChange(item.value)}
                className="appearance-none opacity-0 absolute top-0 left-0 w-full h-full"
            />
            <label htmlFor={item.value.toString()}>{item.label}</label>
        </div>
    );
};

RadioComponent.displayName = 'RadioComponent';
