import * as React from 'react';

/**
 * @enum
 */
export enum Icons {
    arrow = 'arrow',
    check = 'check',
    cross = 'cross',
    print = 'print',
    email = 'email',
    hamburger = 'hamburger',
    phone = 'phone',
    pin = 'pin',
}

interface ComponentProps {
    name: keyof typeof Icons;
}

export const IconComponent: React.FC<ComponentProps & React.SVGProps<SVGSVGElement>> = ({ name, ...rest }) => {
    const ImportedIconRef = React.useRef<React.FC<React.SVGProps<SVGSVGElement>>>();
    const [loading, setLoading] = React.useState(true);

    const importIcon = React.useCallback(async () => {
        try {
            const importedIcon = await import(`./icons/${Icons[name]}.svg`);

            ImportedIconRef.current = importedIcon.ReactComponent;
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
