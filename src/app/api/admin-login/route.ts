import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const adminLogin = async (req: NextRequest) => {
    const { password, username } = await req.json();

    try {
        if (username === process.env.BASIC_AUTH_USER && password === process.env.BASIC_AUTH_PASSWORD) {
            const authValue = `${username}:${password}`;
            const encodedValue = Buffer.from(authValue).toString('base64');

            const cookieStore = await cookies();

            cookieStore.set('auth', encodedValue, {
                httpOnly: true,
                maxAge: 60 * 60 * 24,
                path: '/',
                sameSite: 'strict',
            });

            return NextResponse.json({ message: 'Login successful' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }
    } catch {
        return NextResponse.json({ message: 'Login failed' }, { status: 500 });
    }
};

export { adminLogin as POST };
