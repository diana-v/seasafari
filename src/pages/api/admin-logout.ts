import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const cookies = new Cookies(req, res);

    try {
        cookies.set('auth', '', {
            httpOnly: true,
            maxAge: 0,
            sameSite: 'strict',
            path: '/',
        });

        return res.status(200).json({ message: 'Logout successful' });
    } catch {
        return res.status(500).json({ message: 'Logout failed' });
    }
};
