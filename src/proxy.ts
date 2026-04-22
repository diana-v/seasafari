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
    const { geo, ip, nextUrl } = req;
    const { pathname } = nextUrl;

    if (
        pathname.startsWith('/studio') ||
        pathname.startsWith('/images') ||
        pathname.startsWith('/icons')
    ) {
        return NextResponse.next();
    }

    const hasLocale = locales.some(
        (locale) =>
            pathname === `/${locale}` ||
            pathname.startsWith(`/${locale}/`)
    );

    if (!hasLocale) {
        const url = nextUrl.clone();

        url.pathname = `/${defaultLocale}${pathname}`;

        return NextResponse.redirect(url);
    }

    const requestHeaders = new Headers(req.headers);

    requestHeaders.set('x-client-ip', ip ?? '');
    requestHeaders.set('x-client-country', geo?.country ?? '');

    return NextResponse.next({
        request: { headers: requestHeaders },
    });
}

export const config = {
    // eslint-disable-next-line unicorn/prefer-string-raw
    matcher: ['/((?!api|_next|.*\\..*).*)'],
};
