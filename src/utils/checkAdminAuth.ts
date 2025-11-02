import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';

export function checkAdminAuth(req: NextApiRequest, res: NextApiResponse) {
    const cookies = new Cookies(req, res);
    const authCookie = cookies.get('auth');

    if (!authCookie) return false;

    const decoded = Buffer.from(authCookie, 'base64').toString('utf8');
    const [username, password] = decoded.split(':');

    return username === process.env.BASIC_AUTH_USER && password === process.env.BASIC_AUTH_PASSWORD;
}
