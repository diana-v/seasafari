'use client';

import * as React from 'react';

import { IconComponent } from '@/components/Icon/IconComponent';

interface PrintButtonProps {
    pdfBase64: string;
}

export default function PrintButton({ pdfBase64 }: PrintButtonProps) {
    const handlePrint = React.useCallback(() => {
        const pdfBlob = new Blob(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [new Uint8Array(Buffer.from(pdfBase64, 'base64')) as any],
            { type: 'application/pdf' }
        );

        window.open(URL.createObjectURL(pdfBlob), '_blank');
    }, [pdfBase64]);

    return (
        <button className="hover:opacity-70 transition-opacity" onClick={handlePrint} type="button">
            <IconComponent className="w-8 h-8" name="print" />
        </button>
    );
}
