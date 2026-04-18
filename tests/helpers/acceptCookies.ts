import { Page } from '@playwright/test';

export async function acceptCookies(page: Page) {
    const accept = page.locator('.accept-all');

    if (await accept.isVisible().catch(() => false)) {
        await accept.click();
        await page.waitForSelector('#cookieConsent-banner', { state: 'detached' });
    }
}