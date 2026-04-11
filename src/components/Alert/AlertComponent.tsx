import cn from 'clsx';
import * as React from 'react';

export enum AlertType {
    Error = 'error',
    Success = 'success',
}

interface ComponentProps {
    classNames?: string;
    color: AlertType;
    message: string;
}

export const AlertComponent: React.FC<ComponentProps> = ({ classNames, color, message }) => {
    const wrapperClass = cn(
        {
            "px-4 py-2 w-full rounded-md text-sm md:text-base border border-green-700 bg-green-100": color === AlertType.Success,
            "px-4 py-2 w-full rounded-md text-sm md:text-base border border-red-700 bg-red-100": color === AlertType.Error,
        },
        classNames
    );

    return (
        <div className={wrapperClass} data-testid="alertComponent">
            {message}
        </div>
    );
};

AlertComponent.displayName = 'AlertComponent';
