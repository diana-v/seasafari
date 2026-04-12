import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const response = NextResponse.json(
            { message: 'Logout successful' },
            { status: 200 }
        );

        response.cookies.set('auth', '', {
            httpOnly: true,
            maxAge: 0,
            path: '/',
            sameSite: 'strict',
        });

        return response;
    } catch {
        return NextResponse.json(
            { message: 'Logout failed' },
            { status: 500 }
        );
    }
}
