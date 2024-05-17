import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const { ip, nextUrl, geo } = req;

    // Set ip and country for make-payment endpoint
    nextUrl.searchParams.set('clientIp', ip ?? '127.0.0.1');
    nextUrl.searchParams.set('clientCountry', geo?.country ?? 'lt');

    return NextResponse.rewrite(nextUrl);
}
