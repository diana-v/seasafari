import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { password, username } = await req.json();

        if (
            username === process.env.BASIC_AUTH_USER &&
            password === process.env.BASIC_AUTH_PASSWORD
        ) {
            const authValue = `${username}:${password}`;
            const encodedValue = Buffer.from(authValue).toString('base64');

            const response = NextResponse.json(
                { message: 'Login successful' },
                { status: 200 }
            );

            response.cookies.set('auth', encodedValue, {
                httpOnly: true,
                maxAge: 60 * 60 * 24,
                path: '/',
                sameSite: 'strict',
            });

            return response;
        } else {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }
    } catch {
        return NextResponse.json(
            { message: 'Login failed' },
            { status: 500 }
        );
    }
}
