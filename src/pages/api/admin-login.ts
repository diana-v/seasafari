import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { username, password } = JSON.parse(req.body);
    const cookies = new Cookies(req, res);

    try {
        if (username === process.env.BASIC_AUTH_USER && password === process.env.BASIC_AUTH_PASSWORD) {
            const authValue = `${username}:${password}`;
            const encodedValue = Buffer.from(authValue).toString('base64');

            cookies.set('auth', encodedValue, {
                httpOnly: true,
                maxAge: 60 * 60 * 24,
                sameSite: 'strict',
                path: '/',
            });

            return res.status(200).json({ message: 'Login successful' });
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch {
        return res.status(500).json({ message: 'Login failed' });
    }
};
