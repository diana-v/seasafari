import { cookies } from 'next/headers';
import { Buffer } from 'node:buffer';

export async function checkAdminAuth() {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth');

    if (!authCookie?.value) return false;

    const decoded = Buffer.from(authCookie.value, 'base64').toString('utf8');
    const [username, password] = decoded.split(':');

    return (
        username === process.env.BASIC_AUTH_USER &&
        password === process.env.BASIC_AUTH_PASSWORD
    );
}
