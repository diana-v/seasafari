import * as React from 'react';
import { createPortal } from 'react-dom';

interface ContainerProps {
    children: React.ReactNode;
}

export const ClientOnlyPortalContainer: React.FC<ContainerProps> = ({ children }) => {
    const ref = React.useRef<HTMLDivElement | null>(null);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        ref.current = document.querySelector('#modal');
        setMounted(true);
    }, []);

    return mounted && ref.current ? createPortal(children, ref.current) : null;
};
