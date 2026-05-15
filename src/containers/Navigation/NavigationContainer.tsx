'use client';

import cn from 'clsx';
import Link from 'next/link';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';

import { DropdownComponent } from '@/components/Dropdown/DropdownComponent';
import { IconComponent } from '@/components/Icon/IconComponent';
import { ImageContainer } from '@/containers/Image/ImageContainer';
import { useClickOutside } from '@/hooks/useClickOutside';
import { languages, LocaleType } from '@/translations/navigation';

export interface NavigationProps {
    isAuthenticated?: boolean;
    isSimple?: boolean;
    logo?: string;
    phone?: string;
    showLocales?: boolean;
}

export const NavigationContainer: React.FC<NavigationProps> = ({ isAuthenticated, isSimple, logo, phone }) => {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const searchParams = useSearchParams();

    const locale = (params?.locale as string) || 'lt';
    const locales = ['lt', 'en', 'ru'];

    const localisedString = languages[locale as LocaleType] || languages['lt'];

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
        (newLocale: string) => {
            if (!pathname) return;

            const segments = pathname.split('/');

            segments[1] = newLocale;

            let newPath = segments.join('/');

            const currentParams = searchParams.toString();

            if (currentParams) {
                newPath += `?${currentParams}`;
            }

            router.push(newPath);
            router.refresh();
        },
        [pathname, router, searchParams]
    );

    const handleLogout = React.useCallback(() => {
        fetch('/api/admin-logout', { method: 'POST' })
            .then((res) => {
                if (res.status === 200) {
                    router.refresh();

                    return;
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, [router]);

    return (
        <nav
            className={cn('z-20 relative flex flex-wrap justify-between items-center px-4 py-3 gap-x-5', {
                'bg-slate-900': isSimple,
            })}
            ref={menuRef}
        >
            <Link aria-label="SeaSafari" className="flex gap-8" href={`/${locale}`} prefetch={false}>
                {logo ? (
                    <ImageContainer
                        classNames={{
                            image: cn('w-[100px] h-[50px] !bg-none', {
                                'lg:w-[100px] lg:h-[50px]': isSimple,
                                'lg:w-[160px] lg:h-[80px]': !isSimple,
                            }),
                            root: 'h-full',
                        }}
                        height={80}
                        src={logo}
                        width={180}
                    />
                ) : (
                    'SeaSafari'
                )}
            </Link>

            <div className="flex gap-2 lg:gap-3 text-sm lg:text-lg text-center">
                {!isAuthenticated && (
                    <a
                        className="rounded-full bg-white py-1.5 lg:py-2.5 px-3 lg:px-6 flex gap-2 items-center shadow-lg"
                        href={`tel:${phone}`}
                    >
                        {localisedString?.contactUs}
                        <IconComponent className="w-6 h-6" name="phone" />
                    </a>
                )}
                {isAuthenticated && (
                    <button
                        className="uppercase rounded-full bg-white py-1.5 lg:py-2.5 px-3 lg:px-6 shadow-lg"
                        onClick={handleLogout}
                    >
                        {localisedString?.logout}
                    </button>
                )}
                {locales.length > 1 && (
                    <div className="relative">
                        <button
                            className="uppercase rounded-full bg-white py-2 lg:py-2.5 px-2.5 lg:px-3.5 shadow-lg"
                            onClick={toggleMenu}
                        >
                            {locale}
                        </button>
                        {showMenu && (
                            <DropdownComponent
                                classNames={{ root: 'absolute rounded-lg top-[60px] right-[-8px] w-[60px] p-3' }}
                                items={locales}
                                onSelect={switchToLocale}
                                ref={menuRef}
                            />
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};
