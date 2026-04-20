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

    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (nextUrl.searchParams.toString()) {
        return NextResponse.next();
    }

    if (!pathnameHasLocale) {
        nextUrl.pathname = `/${defaultLocale}${pathname}`;

        return NextResponse.redirect(nextUrl);
    }

    nextUrl.searchParams.set('clientIp', ip ?? '127.0.0.1');
    nextUrl.searchParams.set('clientCountry', geo?.country ?? 'lt');

    return NextResponse.rewrite(nextUrl);
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|studio|favicon.ico|icons|images|manifest.json).*)',
    ],
};