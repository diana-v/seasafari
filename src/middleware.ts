import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const { ip, nextUrl, geo, headers } = req;

    // Set ip and country for make-payment endpoint
    nextUrl.searchParams.set('clientIp', ip ?? '127.0.0.1');
    nextUrl.searchParams.set('clientCountry', geo?.country ?? 'lt');

    const basicAuth = headers.get('authorization');

    if (nextUrl.pathname === '/admin') {
        if (basicAuth) {
            const authValue = basicAuth.split(' ')[1];
            const [user, pwd] = atob(authValue).split(':');

            const { BASIC_AUTH_USER, BASIC_AUTH_PASSWORD } = process.env;

            if (user === BASIC_AUTH_USER && pwd === BASIC_AUTH_PASSWORD) {
                return NextResponse.next();
            }
        }

        nextUrl.pathname = '/api/admin-login';

        return NextResponse.rewrite(nextUrl);
    }

    return NextResponse.rewrite(nextUrl);
}
