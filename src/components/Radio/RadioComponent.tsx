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
    const handleChange = React.useCallback(() => onChange(item.value), []);

    return (
        <div
            className={cn(
                'relative rounded bg-white p-3 text-center border',
                {
                    'border-red-900': checked,
                    'border-grey-300': !checked,
                },
                classNames?.root
            )}
        >
            <input
                type="radio"
                id={item.value.toString()}
                value={item.value}
                checked={checked}
                onChange={handleChange}
                className="appearance-none opacity-0 absolute top-0 left-0 w-full h-full"
            />
            <label
                className={cn({
                    'text-red-900': checked,
                    'text-grey-300': !checked,
                })}
                htmlFor={item.value.toString()}
            >
                {item.label}
            </label>
        </div>
    );
};

RadioComponent.displayName = 'RadioComponent';
