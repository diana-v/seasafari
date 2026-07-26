import { expect, Page } from '@playwright/test';

export async function acceptCookies(page: Page) {
    const accept = page.locator('.accept-all');
    const backdrop = page.locator('#cookieConsent-backdrop');

    if (await accept.isVisible()) {
        await accept.click();

        await expect(backdrop).toBeHidden();
    }

    // Persist the accepted state across all subsequent page.goto() calls in this
    // context. WebKit does not always carry localStorage between hard navigations,
    // so without this the consent banner reappears and blocks interactive elements.
    await page.context().addInitScript(() => {
        localStorage.setItem('cookieConsentCookieBanner_InitialChoice', '1');
    });
}