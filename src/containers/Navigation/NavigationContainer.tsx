import * as React from 'react';
import Link from 'next/link';
import cn from 'clsx';
import { useRouter } from 'next/router';

import styles from './navigationContainer.module.scss';
import { IconComponent } from '@/components/Icon/IconComponent';
import { ImageContainer } from '@/containers/Image/ImageContainer';
import { useClickOutside } from '@/hooks/useClickOutside';

export interface NavigationProps {
    logo?: string;
    sections?: {
        title?: string;
    }[];
}

export const NavigationContainer: React.FC<NavigationProps> = ({ logo, sections }) => {
    const { locales, locale, asPath, push } = useRouter();
    const [showMenu, setShowMenu] = React.useState(false);
    const menuRef = React.useRef(null);

    const toggleMenu = React.useCallback(() => {
        setShowMenu((prevState) => !prevState);
    }, []);

    const closeMenu = React.useCallback(() => {
        setShowMenu(false);
    }, []);

    useClickOutside(menuRef, closeMenu);

    const switchToLocale = React.useCallback(
        (newLocale: string) => () => push(asPath, undefined, { locale: newLocale, scroll: false }),
        []
    );

    return (
        <nav className={styles.root} ref={menuRef}>
            <Link href={'/'} className="font-display text-3xl leading-[3.5rem]" aria-label="SeaSafari">
                {logo ? <ImageContainer src={logo} width={120} height={50} /> : 'SeaSafari'}
            </Link>
            <button
                className="block lg:hidden w-6 h-6 text-grey-600 hover:text-black"
                onClick={toggleMenu}
                aria-label="Navigation"
            >
                <IconComponent name="hamburger" />
            </button>
            <div className={`${showMenu ? 'max-h-[300px]' : 'max-h-[0px]'} ${styles.linkContainer}`}>
                {sections &&
                    sections.map((section, index) => (
                        <Link
                            key={index}
                            href={`/#${section.title?.toLowerCase()}`}
                            className={cn('hover:text-red-800 capitalise')}
                        >
                            {section.title}
                        </Link>
                    ))}
                {locales && locales.length > 1 && (
                    <div className="border-t lg:border-t-0 pt-2 lg:pt-0 lg:border-l lg:pl-5 flex gap-2 md:gap-5 justify-center">
                        {locales.map((item, index) => (
                            <button
                                key={index}
                                onClick={switchToLocale(item)}
                                className={cn('uppercase', { 'font-bold text-red-800': item === locale })}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
};
