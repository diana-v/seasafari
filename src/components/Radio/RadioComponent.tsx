import cn from 'clsx';
import * as React from 'react';

interface ComponentProps {
    checked: boolean;
    classNames?: {
        root?: string;
    };
    item: {
        label: string;
        value: number;
    };
    onChange: (value: number) => void;
}

export const RadioComponent: React.FC<ComponentProps> = ({ checked, classNames, item, onChange }) => {
    const handleChange = React.useCallback(() => onChange(item.value), []);

    return (
        <div
            className={cn(
                'relative rounded bg-white p-3 text-center border',
                {
                    'border-grey-300': !checked,
                    'border-red-900': checked,
                },
                classNames?.root
            )}
        >
            <input
                checked={checked}
                className="appearance-none opacity-0 absolute top-0 left-0 w-full h-full"
                id={item.value.toString()}
                onChange={handleChange}
                type="radio"
                value={item.value}
            />
            <label
                className={cn({
                    'text-grey-300': !checked,
                    'text-red-900': checked,
                })}
                htmlFor={item.value.toString()}
            >
                {item.label}
            </label>
        </div>
    );
};

RadioComponent.displayName = 'RadioComponent';
