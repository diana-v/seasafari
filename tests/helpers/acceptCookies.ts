import { Page } from '@playwright/test';

export async function acceptCookies(page: Page) {
    const accept = page.locator('.accept-all');
    const backdrop = page.locator('#cookieConsent-backdrop');

    if (await accept.isVisible().catch(() => false)) {
        await accept.click();

        await Promise.all([
            page.waitForSelector('#cookieConsent-banner', { state: 'hidden' }),
            backdrop.waitFor({ state: 'hidden' }).catch(() => { /* empty */ }),
        ]);
    }
}