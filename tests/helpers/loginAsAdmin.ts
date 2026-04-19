import { BrowserContext } from '@playwright/test';


export async function loginAsAdmin(context: BrowserContext, user: string, pass: string) {
    await context.addCookies([
        {
            httpOnly: true,
            name: 'auth',
            path: '/',
            url: 'http://127.0.0.1:3000',
            value: Buffer.from(`${user}:${pass}`).toString('base64'),
        },
    ]);
}