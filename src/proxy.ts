import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'lt', 'ru'];
const defaultLocale = 'lt';

interface AuthenticatedNextRequest extends NextRequest {
    geo?: {
        city?: string;
        country?: string;
        region?: string;
    };
    ip?: string;
}

export async function proxy(req: AuthenticatedNextRequest) {
    const { geo, ip } = req;

    const requestHeaders = new Headers(req.headers);

    requestHeaders.set('x-client-ip', ip ?? '');
    requestHeaders.set('x-client-country', geo?.country ?? '');

    return NextResponse.next({
        request: { headers: requestHeaders },
    });
}

export const config = {
    // eslint-disable-next-line unicorn/prefer-string-raw
    matcher: ['/((?!_next|api|.*\\..*).*)'],
};
