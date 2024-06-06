import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    res.status(401).setHeader('WWW-Authenticate', "Basic realm='private_pages'").end('Authentication Required!');
};
