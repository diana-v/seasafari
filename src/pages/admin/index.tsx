import * as React from 'react';
import { GetServerSideProps } from 'next';
import { createClient } from '@sanity/client';
import { useDebouncedCallback } from 'use-debounce';
import { asc } from 'drizzle-orm';
import cn from 'clsx';
import { useRouter } from 'next/router';
import Cookies from 'cookies';

import { NavigationContainer, NavigationProps } from '@/containers/Navigation/NavigationContainer';
import { fetchHeaderData } from '@/schemas/navigation';
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
    const [sortBy, setSortBy] = React.useState<{ field: keyof Order; direction: 'asc' | 'desc' }>({
        field: 'orderRef',
        direction: 'asc',
    });
    const [searchTerm, setSearchTerm] = React.useState('');

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
        [searchTerm, sortBy]
    );

    const handleSort = React.useCallback(
        async (field: keyof Order) => {
            const direction = sortBy.field === field ? (sortBy.direction === 'asc' ? 'desc' : 'asc') : 'desc';

            setSortBy({ field, direction });

            const params = {
                field,
                direction,
                searchTerm,
            };

            const queryParams = new URLSearchParams(params);

            await fetchData(queryParams);
        },
        [sortBy, searchTerm, fetchData]
    );

    const handleSearch = useDebouncedCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchBy = e.target.value;

        setSearchTerm(searchBy);

        const params = {
            field: sortBy.field,
            direction: sortBy.direction,
            searchTerm: searchBy,
        };

        const queryParams = new URLSearchParams(params);

        await fetchData(queryParams);
    }, 500);

    const handleUpdateStatus = React.useCallback(
        async (item: Order) => {
            const params = {
                field: sortBy.field,
                direction: sortBy.direction,
                searchTerm,
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

    return (
        <>
            <NavigationContainer logo={navigation?.logo} isAuthenticated />
            <div className="bg-grey-50 py-8 md:py-16 lg:py-24">
                <div className="container mx-auto p-4 flex flex-col gap-4">
                    {alert.message && <AlertComponent color={alert.type} message={alert.message} />}

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
                </div>

                <div className="container mx-auto px-4 flex flex-col items-center gap-6 md:gap-10 lg:gap-16">
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
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {updatedOrders.length > 0 ? (
                                    updatedOrders.map((item) => (
                                        <tr key={item.orderRef}>
                                            <td className={styles.tableDetail}>{item.orderRef}</td>
                                            <td className={styles.tableDetail}>{item.orderAmount}</td>
                                            <td className={styles.tableDetail}>{item.orderEmail}</td>
                                            <td className={styles.tableDetail}>
                                                {new Date(item.validFrom).toISOString().split('T')[0]}
                                            </td>
                                            <td className={styles.tableDetail}>
                                                {new Date(item.validTo).toISOString().split('T')[0]}
                                            </td>
                                            <td className={styles.tableDetail}>
                                                <input
                                                    type="checkbox"
                                                    className={styles.checkmark}
                                                    onChange={() => handleUpdateStatus(item)}
                                                    checked={item.status === Status.COMPLETED}
                                                />
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

    const navigation = await fetchHeaderData(client, locale, defaultLocale);
    const initialOrders = await db.query.orders.findMany({ orderBy: asc(orders.orderRef) });
    const formattedOrders = JSON.parse(JSON.stringify(initialOrders));

    return {
        props: {
            navigation,
            initialOrders: formattedOrders,
        },
    };
};

export default Admin;
