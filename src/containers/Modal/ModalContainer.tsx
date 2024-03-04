import * as React from 'react';
import cn from 'clsx';
import { CSSProperties, MutableRefObject } from 'react';

import { getScrollbarSize, hasScrollbar } from 'src/utils/dimensions';
import styles from './modalContainer.module.scss';
import { ClientOnlyPortalContainer } from '@/containers/ClientOnlyPortal/ClientOnlyPortalContainer';

interface ComponentProps {
    scrollbarSize?: number;
    animate?: boolean;
    type?: ModalType;
    className?: string;
    style?: CSSProperties;
    onClose?: () => void;
}

export enum ModalType {
    sideBar,
    centered,
}

interface MyInputHandles {
    open(): void;
    close(): void;
    isOpen: boolean;
}

export const ModalContainer = React.forwardRef<MyInputHandles, React.PropsWithChildren<ComponentProps>>(
    ({ children, type = ModalType.sideBar, className, style, onClose, animate = true }, ref) => {
        const [isOpen, setIsOpen] = React.useState(false);
        const [scrollbarWidth, setScrollbarWidth] = React.useState(0);

        const close = React.useCallback(() => setIsOpen(false), []);
        const open = React.useCallback(() => setIsOpen(true), []);

        React.useImperativeHandle(
            ref,
            () => ({
                open,
                close,
                isOpen,
            }),
            [close, isOpen, open]
        );

        const classNames = cn({
            [styles.modal]: true,
            [styles.modalFade]: animate,
            [styles.right]: type === ModalType.sideBar,
            [styles.center]: type === ModalType.centered,
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
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                        __html: `.modal { overflow: hidden; padding-right: ${scrollbarWidth}px }`,
                    }}
                />
                <div className={classNames}>
                    <div className={styles.modalOverlay} onClick={close} />
                    <div
                        className={cn(
                            styles.modalBody,
                            { [styles.modalBodyCentered]: type === ModalType.centered },
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
