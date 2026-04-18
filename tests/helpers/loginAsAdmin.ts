import { BrowserContext } from '@playwright/test';


export async function loginAsAdmin(context: BrowserContext, user: string, pass: string) {
    await context.addCookies([
        {
            domain: '127.0.0.1',
            httpOnly: true,
            name: 'auth',
            path: '/',
            value: Buffer.from(`${user}:${pass}`).toString('base64'),
        },
    ]);
}