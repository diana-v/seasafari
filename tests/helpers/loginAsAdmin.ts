import { expect, Page } from '@playwright/test';

export async function loginAsAdmin(page: Page, user: string, pass: string) {
    await page.goto('/lt/login');

    await page.getByTestId('username-input').fill(user);
    await page.getByTestId('password-input').fill(pass);

    await Promise.all([
        page.waitForURL('**/lt/admin'),
        page.click('[data-testid="login-button"]'),
    ]);

    await page.waitForLoadState('networkidle');
}