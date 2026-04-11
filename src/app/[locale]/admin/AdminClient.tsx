'use client';

import { Scanner } from '@yudiel/react-qr-scanner';
import cn from 'clsx';
import * as React from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { AlertComponent, AlertType } from '@/components/Alert/AlertComponent';
import { IconComponent } from '@/components/Icon/IconComponent';
import { NavigationContainer, NavigationProps } from '@/containers/Navigation/NavigationContainer';
import { Order, Status } from '@/server/db/schema';
import { languages, LocaleType } from '@/translations/admin';

interface AdminClientProps {
    initialOrders: Order[];
    lang: string;
    navigation?: NavigationProps;
}

interface IAlert { message: string; type: AlertType; }

export default function AdminClient({ initialOrders, lang, navigation }: AdminClientProps) {
    const localisedString = languages[lang as LocaleType] || languages['lt'];
    const [alert, setAlert] = React.useState<IAlert>({ message: '', type: AlertType.Error });
    const [updatedOrders, setUpdatedOrders] = React.useState<Order[]>(initialOrders);
    const [showCompleted, setShowCompleted] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isScannerOpen, setIsScannerOpen] = React.useState(false);
    const [sortBy, setSortBy] = React.useState<{ direction: 'asc' | 'desc'; field: keyof Order }>({
        direction: 'asc',
        field: 'orderRef',
    });

    const tableCellBase = "flex justify-between items-center py-4 border-b border-gray-100 last:border-0 before:content-[attr(data-label)] before:font-semibold before:text-gray-600 before:capitalize min-[1285px]:table-cell min-[1285px]:px-6 min-[1285px]:py-4 min-[1285px]:before:content-none min-[1285px]:border-none min-[1285px]:whitespace-nowrap";
    const tableHeadBase = "px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer flex gap-2 items-center hover:bg-gray-100 transition-colors";

    const fieldMapping: Record<string, keyof typeof localisedString> = {
        orderAmount: 'amount',
        orderEmail: 'email',
        orderRef: 'reference',
        status: 'completed',
        validFrom: 'validFrom',
        validTo: 'validTo',
    };
    
    const fetchData = React.useCallback(async (queryParams: URLSearchParams) => {
        try {
            const res = await fetch(`/api/order-sort?${queryParams.toString()}`);

            if (!res.ok) throw new Error('Failed to fetch orders');
            const data = await res.json();

            setUpdatedOrders(data);
        } catch {
            setAlert({ message: localisedString.sortError, type: AlertType.Error });
            setTimeout(() => setAlert({ message: '', type: AlertType.Error }), 5000);
        }
    }, [localisedString.sortError]);

    const handleSort = (field: keyof Order) => {
        const direction = sortBy.field === field ? (sortBy.direction === 'asc' ? 'desc' : 'asc') : 'desc';

        setSortBy({ direction, field });
        const params = new URLSearchParams({
            direction, field, searchTerm,
            showCompleted: showCompleted.toString()
        });

        fetchData(params);
    };

    const handleSearch = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const searchBy = e.target.value;

        setSearchTerm(searchBy);
        const params = new URLSearchParams({
            direction: sortBy.direction, field: sortBy.field,
            searchTerm: searchBy, showCompleted: showCompleted.toString()
        });

        fetchData(params);
    }, 500);

    const handleFilter = (e: React.MouseEvent<HTMLInputElement>) => {
        const isChecked = e.currentTarget.checked;

        setShowCompleted(isChecked);
        const params = new URLSearchParams({
            direction: sortBy.direction, field: sortBy.field,
            searchTerm, showCompleted: isChecked.toString()
        });

        fetchData(params);
    };

    const handleUpdateStatus = async (item: Order) => {
        const params = new URLSearchParams({
            direction: sortBy.direction, field: sortBy.field,
            searchTerm, showCompleted: showCompleted.toString()
        });

        try {
            const res = await fetch(`/api/order-update?orderRef=${encodeURIComponent(item.orderRef)}&status=${item.status === Status.COMPLETED ? 'created' : 'completed'}&${params.toString()}`);

            if (!res.ok) throw new Error('Failed to update order');
            const data = await res.json();

            setUpdatedOrders(data);
        } catch {
            setAlert({ message: localisedString.updateError, type: AlertType.Error });
            setTimeout(() => setAlert({ message: '', type: AlertType.Error }), 5000);
        }
    };

    const handleResendEmail = async (item: Order) => {
        try {
            const res = await fetch('/api/resend-email', {
                body: JSON.stringify({
                    amount: item.orderAmount, email: item.orderEmail,
                    locale: lang, orderRef: item.orderRef,
                    validFrom: item.validFrom, validTo: item.validTo,
                }),
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
            });

            setAlert({
                message: res.ok ? localisedString.emailResent : localisedString.emailResendError,
                type: res.ok ? AlertType.Success : AlertType.Error
            });
        } catch {
            setAlert({ message: localisedString.emailResendError, type: AlertType.Error });
        } finally {
            setTimeout(() => setAlert({ message: '', type: AlertType.Error }), 5000);
        }
    };

    const handleScan = async (scannedValue: string) => {
        if (!scannedValue) return;
        try {
            const url = new URL(scannedValue);
            const token = url.searchParams.get('token');

            if (!token) {
                setAlert({ message: localisedString.invalidQRCode, type: AlertType.Error });

                return setIsScannerOpen(false);
            }
            const res = await fetch(`/api/verify-qr?token=${encodeURIComponent(token)}&locale=${lang}`);
            const data = await res.json();

            setUpdatedOrders(data.updatedOrders ?? []);
            setAlert({ message: data.reason, type: data.valid ? AlertType.Success : AlertType.Error });
            setIsScannerOpen(false);
        } catch {
            setAlert({ message: localisedString.scanError, type: AlertType.Error });
            setIsScannerOpen(false);
        } finally {
            setTimeout(() => setAlert({ message: '', type: AlertType.Error }), 15_000);
        }
    };

    return (
        <>
            <NavigationContainer isAuthenticated isSimple logo={navigation?.logo} phone={navigation?.phone} />
            <div className="bg-gray-50 py-8 md:py-16 lg:py-24 min-h-screen">
                <div className="xl:container mx-auto p-4 flex flex-col gap-4">
                    {alert.message && <AlertComponent color={alert.type} message={alert.message} />}

                    <div className="flex flex-wrap gap-4 justify-between items-center">
                        <div className="flex flex-wrap items-center gap-2">
                            <label
                                className="text-left text-gray-600 uppercase cursor-pointer text-sm font-semibold"
                                htmlFor="search"
                            >
                                {localisedString.search}
                            </label>
                            <input
                                className="border border-gray-800 rounded focus:outline-none px-2 py-1 bg-white"
                                id="search"
                                onChange={handleSearch}
                                type="text"
                            />
                            <span className="w-full text-xs text-gray-500">{localisedString.searchHelp}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <input
                                className="h-6 w-6 text-gray-800 focus:ring-gray-800 border-gray-300 rounded accent-[#15496b] cursor-pointer"
                                defaultChecked={showCompleted}
                                id="filter"
                                onClick={handleFilter}
                                type="checkbox"
                            />
                            <label
                                className="text-gray-600 uppercase cursor-pointer text-sm font-semibold"
                                htmlFor="filter"
                            >
                                {localisedString.filter}
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center md:justify-end mb-6">
                        <button
                            className="flex justify-center text-white bg-orange-500 hover:bg-orange-600 transition-colors items-center gap-2 px-6 py-3 font-semibold rounded-sm"
                            onClick={() => setIsScannerOpen(!isScannerOpen)}
                        >
                            {localisedString.scanQR}
                        </button>
                    </div>

                    {isScannerOpen && (
                        <div className="fixed inset-0 z-[60] flex flex-col bg-black bg-opacity-90">
                            <button
                                className="absolute flex items-center gap-2 top-4 right-4 text-white md:text-lg bg-gray-800 bg-opacity-60 px-4 py-2 rounded-md hover:bg-opacity-80 z-[70]"
                                onClick={() => setIsScannerOpen(false)}
                            >
                                {localisedString.closeScanner}
                                <IconComponent className="w-3 md:w-4 h-3 md:h-4" name="cross" />
                            </button>
                            <div className="flex-1 flex justify-center items-center">
                                <div className="w-[90vw] max-w-md aspect-square border-4 border-gray-400 rounded-xl overflow-hidden shadow-lg bg-black">
                                    <Scanner
                                        onScan={(detectedCodes) => {
                                            const token = detectedCodes[0]?.rawValue;

                                            if (token) handleScan(token);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="xl:container mx-auto px-4">
                    <div className="w-full overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 block min-[1285px]:table">
                            <thead className="bg-gray-50 hidden min-[1285px]:table-header-group">
                                <tr>{(['orderRef', 'orderAmount', 'orderEmail', 'validFrom', 'validTo','status',] as const).map((field) => {
                                        const translationKey = fieldMapping[field];

                                        return (
                                            <th
                                                className="p-0 cursor-pointer"
                                                key={field}
                                                onClick={() => handleSort(field)}
                                            >
                                                <div className={tableHeadBase}>
                                                    {localisedString[translationKey]}
                                                    <IconComponent
                                                        className={cn('w-2 h-2 transition-transform', {
                                                            '-rotate-90':
                                                                sortBy.field === field && sortBy.direction === 'desc',
                                                            'rotate-90': !(
                                                                sortBy.field === field && sortBy.direction === 'desc'
                                                            ),
                                                        })}
                                                        name="arrow"
                                                    />
                                                </div>
                                            </th>
                                        );
                                    })}
                                    <th className="p-0">
                                        <div className={tableHeadBase}>{localisedString.actions}</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 block min-[1285px]:table-row-group">
                                {updatedOrders.map((item, index) => (
                                    <tr
                                        className="block min-[1285px]:table-row mb-6 bg-white rounded-lg shadow-md min-[1285px]:shadow-none border border-gray-100 min-[1285px]:border-none p-4 min-[1285px]:p-0"
                                        key={index}
                                    >
                                        <td className={tableCellBase} data-label={localisedString.reference}>
                                            {item.orderRef}
                                        </td>
                                        <td className={tableCellBase} data-label={localisedString.amount}>
                                            {item.orderAmount}
                                        </td>
                                        <td className={tableCellBase} data-label={localisedString.email}>
                                            {item.orderEmail}
                                        </td>
                                        <td className={tableCellBase} data-label={localisedString.validFrom}>
                                            {new Date(item.validFrom).toISOString().split('T')[0]}
                                        </td>
                                        <td className={tableCellBase} data-label={localisedString.validTo}>
                                            {new Date(item.validTo).toISOString().split('T')[0]}
                                        </td>
                                        <td className={tableCellBase} data-label={localisedString.completed}>
                                            <input
                                                checked={item.status === Status.COMPLETED}
                                                className="h-6 w-6 accent-[#15496b]"
                                                onChange={() => handleUpdateStatus(item)}
                                                type="checkbox"
                                            />
                                        </td>
                                        <td className={tableCellBase} data-label={localisedString.actions}>
                                            <button
                                                className="bg-blue-900 text-white px-4 py-2 text-sm"
                                                onClick={() => handleResendEmail(item)}
                                            >
                                                {localisedString.resendEmail}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
