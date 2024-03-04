import { MutableRefObject, useCallback, useEffect } from 'react';

export const useClickOutside = (ref: MutableRefObject<HTMLElement | null>, callbackFunction: () => void) => {
    const handleClickOutside = useCallback(
        (event: MouseEvent) => {
            if (ref.current && !ref.current?.contains(event.target as Node)) {
                callbackFunction();
            }
        },
        [callbackFunction, ref]
    );
    const handleEscape = useCallback(
        (event: KeyboardEvent) => {
            if (ref.current && event.code === 'Escape') {
                callbackFunction();
            }
        },
        [callbackFunction, ref]
    );

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [ref, callbackFunction, handleClickOutside, handleEscape]);
};
