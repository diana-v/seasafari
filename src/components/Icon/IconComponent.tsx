'use client'

import * as React from 'react';

/**
 * @enum
 */
export enum Icons {
    arrow = 'arrow',
    arrowRightUp = 'arrow-right-up',
    calendar = 'calendar',
    check = 'check',
    checkCircle = 'check-circle',
    cross = 'cross',
    email = 'email',
    hamburger = 'hamburger',
    makeCommerce = 'makecommerce-logo',
    phone = 'phone',
    pin = 'pin',
    print = 'print',
    propeller = 'propeller',
    securePayment = 'secure-payment',
    spinner = 'spinner',
    star = 'star',
}

interface ComponentProps {
    name: keyof typeof Icons;
}

export const IconComponent: React.FC<ComponentProps & React.SVGProps<SVGSVGElement>> = ({ name, ...rest }) => {
    const ImportedIconRef = React.useRef<React.FC<React.SVGProps<SVGSVGElement>>>(null);
    const [loading, setLoading] = React.useState(true);

    const importIcon = React.useCallback(async () => {
        try {
            const importedIcon = await import(`./icons/${Icons[name]}.svg`);

            ImportedIconRef.current = importedIcon.default || importedIcon.ReactComponent;
        } catch (error) {
            console.error(`Failed to load icon: ${name}`, error);
        } finally {
            setLoading(false);
        }
    }, [name]);

    React.useEffect(() => {
        setLoading(true);

        importIcon();

        return () => {
            setLoading(false);
        };
    }, [importIcon, name]);

    if (!loading && ImportedIconRef.current) {
        const { current: ImportedIcon } = ImportedIconRef;

        return <ImportedIcon data-testid="iconComponent" {...rest} />;
    }

    return null;
};

IconComponent.displayName = 'IconComponent';
