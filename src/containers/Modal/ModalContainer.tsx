'use client';

import cn from 'clsx';
import * as React from 'react';
import { CSSProperties, MutableRefObject } from 'react';
import { getScrollbarSize, hasScrollbar } from 'src/utils/dimensions';

import { ClientOnlyPortalContainer } from '@/containers/ClientOnlyPortal/ClientOnlyPortalContainer';

export enum ModalType {
    sideBar,
    centered,
}

interface ComponentProps {
    animate?: boolean;
    className?: string;
    onClose?: () => void;
    scrollbarSize?: number;
    style?: CSSProperties;
    type?: ModalType;
}

interface MyInputHandles {
    close(): void;
    isOpen: boolean;
    open(): void;
}

export const ModalContainer = React.forwardRef<MyInputHandles, React.PropsWithChildren<ComponentProps>>(
    ({ animate = true, children, className, onClose, style, type = ModalType.sideBar }, ref) => {
        const [isOpen, setIsOpen] = React.useState(false);
        const [scrollbarWidth, setScrollbarWidth] = React.useState(0);

        const close = React.useCallback(() => setIsOpen(false), []);
        const open = React.useCallback(() => setIsOpen(true), []);

        React.useImperativeHandle(
            ref,
            () => ({
                close,
                isOpen,
                open,
            }),
            [close, isOpen, open]
        );

        const classNames = cn("fixed overflow-hidden top-0 right-0 bottom-0 left-0 w-full h-full flex z-50 bg-[#00000033]", {
            "content-center items-center justify-center": type === ModalType.centered,
            "justify-end": type === ModalType.sideBar,
            "opacity-0 animate-[fade-in_0.3s_linear_forwards]": animate,
        });

        const handleEscape = React.useCallback(
            (event: KeyboardEvent) => {
                if (event.code === 'Escape') {
                    close();
                }
            },
            [close]
        );

        React.useEffect(() => {
            document.addEventListener('keydown', handleEscape);
            const currentState = ref as MutableRefObject<MyInputHandles>;

            if (!isOpen) {
                setScrollbarWidth(hasScrollbar() ? getScrollbarSize(document) : 0);
            }

            return () => {
                document.removeEventListener('keydown', handleEscape);

                if (currentState?.current && !currentState?.current.isOpen && isOpen && onClose) {
                    onClose();
                }
            };
        }, [handleEscape, isOpen, onClose, ref]);

        const renderModal = () => (
            <ClientOnlyPortalContainer>
                <style
                     
                    dangerouslySetInnerHTML={{
                        __html: `.modal { overflow: hidden; padding-right: ${scrollbarWidth}px }`,
                    }}
                />
                <div className={classNames}>
                    <div className="w-full h-full absolute top-0 left-0" onClick={close} />
                    <div
                        className={cn(
                            "shadow-xl bg-white relative overflow-x-hidden overflow-y-auto max-h-full",
                            { "border rounded-xl shadow-xl sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full": type === ModalType.centered },
                            className
                        )}
                        style={style}
                    >
                        {children}
                    </div>
                </div>
            </ClientOnlyPortalContainer>
        );

        return <>{isOpen && renderModal()}</>;
    }
);

ModalContainer.displayName = 'ModalContainer';
