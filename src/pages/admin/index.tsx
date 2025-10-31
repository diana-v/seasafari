import * as React from 'react';
import { GetServerSideProps } from 'next';
import { createClient } from '@sanity/client';
import { useDebouncedCallback } from 'use-debounce';
import { asc, eq } from 'drizzle-orm';
import cn from 'clsx';
import { useRouter } from 'next/router';
import Cookies from 'cookies';
import { Scanner } from '@yudiel/react-qr-scanner';

import { NavigationContainer, NavigationProps } from '@/containers/Navigation/NavigationContainer';
import { fetchNavigationData } from '@/schemas/navigation';
import styles from './admin.module.scss';
import { db } from '@/server/db';
import { Order, orders, Status } from '@/server/db/schema';
import { languages, LocaleType } from '@/translations/admin';
import { IconComponent } from '@/components/Icon/IconComponent';
import { AlertComponent, AlertType } from '@/components/Alert/AlertComponent';

interface PageProps {
    navigation?: NavigationProps;
    initialOrders: Order[];
}

interface IAlert {
    message: string;
    type: AlertType;
}

export const Admin = ({ navigation, initialOrders }: PageProps) => {
    const { locale, defaultLocale } = useRouter();
    const localisedString = languages[(locale ?? defaultLocale) as LocaleType];
    const [alert, setAlert] = React.useState<IAlert>({ message: '', type: AlertType.Error });
    const [updatedOrders, setUpdatedOrders] = React.useState<Order[]>(initialOrders);
    const [showCompleted, setShowCompleted] = React.useState(false);
    const [sortBy, setSortBy] = React.useState<{ field: keyof Order; direction: 'asc' | 'desc' }>({
        field: 'orderRef',
        direction: 'asc',
    });
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isScannerOpen, setIsScannerOpen] = React.useState(false);

    const fetchData = React.useCallback(
        async (queryParams: URLSearchParams) => {
            await fetch(`/api/order-sort?${queryParams.toString()}`, {
                method: 'GET',
            }).then(async (res) => {
                if (res.status === 500) {
                    setAlert({
                        message: localisedString.sortError,
                        type: AlertType.Error,
                    });
                }

                if (res.status === 200) {
                    const data = await res.json();

                    return setUpdatedOrders(data);
                }

                return setTimeout(() => {
                    setAlert({ message: '', type: AlertType.Error });
                }, 5000);
            });
        },
        [searchTerm, sortBy, showCompleted]
    );

    const handleSort = React.useCallback(
        async (field: keyof Order) => {
            const direction = sortBy.field === field ? (sortBy.direction === 'asc' ? 'desc' : 'asc') : 'desc';

            setSortBy({ field, direction });

            const params = {
                field,
                direction,
                searchTerm,
                showCompleted: showCompleted.toString(),
            };

            const queryParams = new URLSearchParams(params);

            await fetchData(queryParams);
        },
        [sortBy, searchTerm, showCompleted, fetchData]
    );

    const handleSearch = useDebouncedCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchBy = e.target.value;

        setSearchTerm(searchBy);

        const params = {
            field: sortBy.field,
            direction: sortBy.direction,
            searchTerm: searchBy,
            showCompleted: showCompleted.toString(),
        };

        const queryParams = new URLSearchParams(params);

        await fetchData(queryParams);
    }, 500);

    const handleFilter = React.useCallback(
        async (e: React.MouseEvent<HTMLInputElement>) => {
            const isChecked = e.currentTarget.checked;

            setShowCompleted(isChecked);

            const params = {
                field: sortBy.field,
                direction: sortBy.direction,
                searchTerm: searchTerm,
                showCompleted: isChecked.toString(),
            };

            const queryParams = new URLSearchParams(params);

            await fetchData(queryParams);
        },
        [sortBy, searchTerm, showCompleted, fetchData]
    );

    const handleUpdateStatus = React.useCallback(
        async (item: Order) => {
            const params = {
                field: sortBy.field,
                direction: sortBy.direction,
                searchTerm,
                showCompleted: showCompleted.toString(),
            };
            const queryParams = new URLSearchParams(params);

            await fetch(
                `/api/order-update?orderRef=${encodeURIComponent(item.orderRef)}&status=${
                    item.status === Status.COMPLETED ? 'created' : 'completed'
                }&${queryParams.toString()}`,
                {
                    method: 'GET',
                }
            ).then(async (res) => {
                if (res.status === 500) {
                    setAlert({
                        message: localisedString.updateError,
                        type: AlertType.Error,
                    });
                }

                if (res.status === 200) {
                    const data = await res.json();

                    return setUpdatedOrders(data);
                }

                return setTimeout(() => {
                    setAlert({ message: '', type: AlertType.Error });
                }, 5000);
            });
        },
        [searchTerm, sortBy]
    );

    const handleResendEmail = React.useCallback(
        async (item: Order) => {
            try {
                const res = await fetch('/api/resend-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        orderRef: item.orderRef,
                        email: item.orderEmail,
                        amount: item.orderAmount,
                        validFrom: item.validFrom,
                        validTo: item.validTo,
                        locale: locale ?? defaultLocale,
                    }),
                });

                if (res.ok) {
                    setAlert({ message: localisedString.emailResent, type: AlertType.Success });
                } else {
                    setAlert({ message: localisedString.emailResendError, type: AlertType.Error });
                }
            } catch (error) {
                console.error(error);
                setAlert({ message: localisedString.emailResendError, type: AlertType.Error });
            } finally {
                setTimeout(() => setAlert({ message: '', type: AlertType.Error }), 5000);
            }
        },
        [locale, defaultLocale, localisedString]
    );

    const handleOpenScanner = React.useCallback(() => {
        setIsScannerOpen((prev) => !prev);
    }, []);

    const handleScan = React.useCallback(
        async (scannedValue: string) => {
            if (!scannedValue) return;

            try {
                const url = new URL(scannedValue);
                const token = url.searchParams.get('token');

                if (!token) {
                    setAlert({ message: 'Invalid QR code', type: AlertType.Error });

                    return setIsScannerOpen(false);
                }

                const res = await fetch(`/api/scan-qr-proxy?token=${encodeURIComponent(token)}`);

                const data = await res.json();

                setUpdatedOrders(data.updatedOrders ?? []);

                if (res.ok && data.valid) {
                    setAlert({ message: localisedString.scanSuccess, type: AlertType.Success });

                    return setIsScannerOpen(false);
                }

                if (!data.valid && data.manualCheckRequired) {
                    setAlert({
                        message: localisedString.manualCheckRequired,
                        type: AlertType.Error,
                    });

                    return setIsScannerOpen(false);
                }

                if (!data.valid) {
                    setAlert({
                        message: localisedString.scanError + (data.reason ? ` (${data.reason})` : ''),
                        type: AlertType.Error,
                    });

                    return setIsScannerOpen(false);
                }
            } catch (error) {
                console.error(error);
                setAlert({ message: localisedString.scanError, type: AlertType.Error });
                setIsScannerOpen(false);
            }
        },
        [localisedString]
    );

    return (
        <>
            <NavigationContainer logo={navigation?.logo} phone={navigation?.phone} isSimple isAuthenticated />
            <div className="bg-grey-50 py-8 md:py-16 lg:py-24">
                <div className="xl:container mx-auto p-4 flex flex-col gap-4">
                    {alert.message && <AlertComponent color={alert.type} message={alert.message} />}

                    <div className="flex flex-wrap gap-4 justify-between align-center">
                        <div className="flex flex-wrap items-center gap-2">
                            <label className={styles.search} htmlFor="search">
                                {localisedString.search}
                            </label>
                            <input
                                name="search"
                                className="border border-grey-800 rounded focus:outline-none px-2 py-1"
                                type="text"
                                onChange={handleSearch}
                            />
                            <span className="w-full !text-gray-600">{localisedString.searchHelp}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <input
                                type="checkbox"
                                className={styles.checkmark}
                                onClick={handleFilter}
                                defaultChecked={showCompleted}
                            />
                            <label className={styles.search} htmlFor="filter">
                                {localisedString.filter}
                            </label>
                        </div>
                    </div>
                    <div className="flex items-center md:justify-end mb-6">
                        <button
                            onClick={handleOpenScanner}
                            className="flex justify-center text-white bg-orange-500 items-center gap-2 px-6 py-3"
                        >
                            {localisedString.scanQR}
                        </button>
                    </div>

                    {isScannerOpen && (
                        <div className="fixed inset-0 z-50 flex flex-col bg-black bg-opacity-90">
                            <button
                                onClick={handleOpenScanner}
                                className="absolute flex items-center gap-2 top-4 right-4 text-white md:text-lg bg-gray-800 bg-opacity-60 px-4 py-2 rounded-md hover:bg-opacity-80"
                            >
                                {localisedString.closeScanner}
                                <IconComponent name="cross" className="w-3 md:w-4 h-3 md:h-4" />
                            </button>

                            <div className="flex-1 flex justify-center items-center">
                                <div className="w-[90vw] max-w-md aspect-square border-4 border-gray-400 rounded-xl overflow-hidden shadow-lg">
                                    <Scanner
                                        onScan={(detectedCodes) => {
                                            const token = detectedCodes[0]?.rawValue;

                                            if (token) handleScan(token);
                                        }}
                                        onError={(error) => console.error(error)}
                                        classNames={{ container: 'w-full h-full' }}
                                        constraints={{ facingMode: 'environment' }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="xl:container mx-auto px-4 flex flex-col items-center gap-6 md:gap-10 lg:gap-16">
                    <div className="w-full overflow-auto">
                        <table className={styles.table}>
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" onClick={() => handleSort('orderRef')}>
                                        <div className={styles.tableHead}>
                                            {localisedString.reference}
                                            <IconComponent
                                                name="arrow"
                                                className={cn(styles.arrow, {
                                                    [styles.desc]:
                                                        sortBy.field === 'orderRef' && sortBy.direction === 'desc',
                                                })}
                                            />
                                        </div>
                                    </th>
                                    <th scope="col" onClick={() => handleSort('orderAmount')}>
                                        <div className={styles.tableHead}>
                                            {localisedString.amount}
                                            <IconComponent
                                                name="arrow"
                                                className={cn(styles.arrow, {
                                                    [styles.desc]:
                                                        sortBy.field === 'orderAmount' && sortBy.direction === 'desc',
                                                })}
                                            />
                                        </div>
                                    </th>
                                    <th scope="col" onClick={() => handleSort('orderEmail')}>
                                        <div className={styles.tableHead}>
                                            {localisedString.email}
                                            <IconComponent
                                                name="arrow"
                                                className={cn(styles.arrow, {
                                                    [styles.desc]:
                                                        sortBy.field === 'orderEmail' && sortBy.direction === 'desc',
                                                })}
                                            />
                                        </div>
                                    </th>
                                    <th scope="col" onClick={() => handleSort('validFrom')}>
                                        <div className={styles.tableHead}>
                                            {localisedString.validFrom}
                                            <IconComponent
                                                name="arrow"
                                                className={cn(styles.arrow, {
                                                    [styles.desc]:
                                                        sortBy.field === 'validFrom' && sortBy.direction === 'desc',
                                                })}
                                            />
                                        </div>
                                    </th>
                                    <th scope="col" onClick={() => handleSort('validTo')}>
                                        <div className={styles.tableHead}>
                                            {localisedString.validTo}
                                            <IconComponent
                                                name="arrow"
                                                className={cn(styles.arrow, {
                                                    [styles.desc]:
                                                        sortBy.field === 'validTo' && sortBy.direction === 'desc',
                                                })}
                                            />
                                        </div>
                                    </th>
                                    <th scope="col" onClick={() => handleSort('status')}>
                                        <div className={styles.tableHead}>
                                            {localisedString.completed}
                                            <IconComponent
                                                name="arrow"
                                                className={cn(styles.arrow, {
                                                    [styles.desc]:
                                                        sortBy.field === 'status' && sortBy.direction === 'desc',
                                                })}
                                            />
                                        </div>
                                    </th>
                                    <th scope="col">
                                        <div className={styles.tableHead}>{localisedString.actions}</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {updatedOrders.length > 0 ? (
                                    updatedOrders.map((item, index) => (
                                        <tr key={index}>
                                            <td className={styles.tableDetail} data-label={localisedString.reference}>
                                                {item.orderRef}
                                            </td>
                                            <td className={styles.tableDetail} data-label={localisedString.amount}>
                                                {item.orderAmount}
                                            </td>
                                            <td className={styles.tableDetail} data-label={localisedString.email}>
                                                {item.orderEmail}
                                            </td>
                                            <td className={styles.tableDetail} data-label={localisedString.validFrom}>
                                                {new Date(item.validFrom).toISOString().split('T')[0]}
                                            </td>
                                            <td className={styles.tableDetail} data-label={localisedString.validTo}>
                                                {new Date(item.validTo).toISOString().split('T')[0]}
                                            </td>
                                            <td className={styles.tableDetail} data-label={localisedString.completed}>
                                                <input
                                                    type="checkbox"
                                                    className={styles.checkmark}
                                                    onChange={() => handleUpdateStatus(item)}
                                                    checked={item.status === Status.COMPLETED}
                                                />
                                            </td>
                                            <td className={styles.tableDetail} data-label={localisedString.actions}>
                                                <button
                                                    className="flex items-center justify-center px-4 py-2 bg-blue-900 text-white cursor-pointer"
                                                    onClick={() => handleResendEmail(item)}
                                                >
                                                    {localisedString.resendEmail}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className={cn('text-center', styles.tableDetail)}>
                                            {localisedString.noOrdersFound}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
    useCdn: false,
});

export const getServerSideProps: GetServerSideProps = async ({ locale, defaultLocale, req, res }) => {
    const cookies = new Cookies(req, res);
    const authCookie = cookies.get('auth');

    if (!authCookie) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    const decodedValue = Buffer.from(authCookie, 'base64').toString('utf8');
    const [username, password] = decodedValue.split(':');

    if (username !== process.env.BASIC_AUTH_USER || password !== process.env.BASIC_AUTH_PASSWORD) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    const navigation = await fetchNavigationData(client, locale, defaultLocale);
    const initialOrders = await db.query.orders.findMany({
        where: (order) => eq(order.status, Status.CREATED),
        orderBy: asc(orders.orderRef),
    });
    const formattedOrders = JSON.parse(JSON.stringify(initialOrders));

    return {
        props: {
            navigation,
            initialOrders: formattedOrders,
        },
    };
};

export default Admin;
