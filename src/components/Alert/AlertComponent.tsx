import * as React from 'react';
import cn from 'clsx';

import styles from './alertComponent.module.scss';

export enum AlertType {
    Success = 'success',
    Error = 'error',
}

interface ComponentProps {
    color: AlertType;
    message: string;
    classNames?: string;
}

export const AlertComponent: React.FC<ComponentProps> = ({ color, message, classNames }) => {
    const wrapperClass = cn(
        {
            [styles.success]: color === AlertType.Success,
            [styles.error]: color === AlertType.Error,
        },
        classNames
    );

    return (
        <div data-testid="alertComponent" className={wrapperClass}>
            {message}
        </div>
    );
};

AlertComponent.displayName = 'AlertComponent';
