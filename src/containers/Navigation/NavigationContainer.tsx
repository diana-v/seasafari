import * as React from 'react';
import { useRouter } from 'next/router';
import cn from 'clsx';

import { ImageContainer } from '@/containers/Image/ImageContainer';
import { useClickOutside } from '@/hooks/useClickOutside';
import { languages, LocaleType } from '@/translations/navigation';
import { DropdownComponent } from '@/components/Dropdown/DropdownComponent';
import { IconComponent } from '@/components/Icon/IconComponent';

export interface NavigationProps {
    logo?: string;
    phone?: string;
    showLocales?: boolean;
    isAuthenticated?: boolean;
    isSimple?: boolean;
}

export const NavigationContainer: React.FC<NavigationProps> = ({ logo, phone, isAuthenticated, isSimple }) => {
    const { locales, locale, defaultLocale, asPath, push, reload } = useRouter();
    const localisedString = languages[(locale ?? defaultLocale) as LocaleType];
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
        (newLocale: string) => push(asPath, undefined, { locale: newLocale, scroll: false }),
        [asPath, push]
    );

    const handleLogout = React.useCallback(() => {
        fetch('/api/admin-logout', { method: 'POST' })
            .then((res) => {
                if (res.status === 200) {
                    return reload();
                }

                return;
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <nav
            className={cn('z-20 relative mx-auto flex flex-wrap justify-between items-center px-4 py-3 gap-x-5', {
                'bg-slate-900': isSimple,
            })}
            ref={menuRef}
        >
            <a href="/" className="flex gap-8" aria-label="SeaSafari">
                {logo ? (
                    <ImageContainer
                        src={logo}
                        width={180}
                        height={80}
                        classNames={{
                            root: 'h-full',
                            image: cn('w-[100px] h-[50px]', {
                                'lg:w-[160px] lg:h-[80px]': !isSimple,
                                'lg:w-[100px] lg:h-[50px]': isSimple,
                            }),
                        }}
                    />
                ) : (
                    'SeaSafari'
                )}
            </a>
            <div className="flex gap-2 lg:gap-3 text-sm lg:text-lg text-center">
                {!isAuthenticated && (
                    <a
                        href={`tel:${phone}`}
                        className="rounded-full bg-white py-1.5 lg:py-2.5 px-3 lg:px-6 flex gap-2 items-center shadow-lg"
                    >
                        {localisedString.contactUs}
                        <IconComponent name="phone" className="w-6 h-6" />
                    </a>
                )}
                {isAuthenticated && (
                    <button
                        onClick={handleLogout}
                        className="uppercase rounded-full bg-white py-1.5 lg:py-2.5 px-3 lg:px-6 shadow-lg"
                    >
                        {localisedString.logout}
                    </button>
                )}
                {locales && locales.length > 1 && (
                    <div className="relative">
                        <button
                            onClick={toggleMenu}
                            className="uppercase rounded-full bg-white py-2 lg:py-2.5 px-2.5 lg:px-3.5 shadow-lg"
                        >
                            {locale}
                        </button>
                        {showMenu && (
                            <DropdownComponent
                                ref={menuRef}
                                items={locales}
                                onSelect={switchToLocale}
                                classNames={{ root: 'absolute rounded-lg top-[60px] right-[-8px] w-[60px] p-3' }}
                            />
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};
