import { expect, Page } from '@playwright/test';

export async function acceptCookies(page: Page) {
    const accept = page.locator('.accept-all');
    const backdrop = page.locator('#cookieConsent-backdrop');

    if (await accept.isVisible()) {
        await accept.click();

        await expect(backdrop).toBeHidden();
    }
}