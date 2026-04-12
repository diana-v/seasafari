'use client';

import { useEffect } from 'react';

export function ClearPaymentContainer() {
    useEffect(() => {
        fetch('/api/clear-payment-cookie', { method: 'POST' });
    }, []);

    return null;
}