import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const adminLogout = async () => {
    try {
        const cookieStore = await cookies();

        cookieStore.set('auth', '', {
            httpOnly: true,
            maxAge: 0,
            path: '/',
            sameSite: 'strict',
        });

        return NextResponse.json({ message: 'Logout successful' }, { status: 200 });
    } catch {
        return NextResponse.json({ message: 'Logout failed' }, { status: 500 });
    }
};

export { adminLogout as POST };
