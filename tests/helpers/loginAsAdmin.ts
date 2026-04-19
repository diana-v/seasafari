import { expect, Page } from '@playwright/test';

export async function loginAsAdmin(page: Page, user: string, pass: string) {
    await page.goto('/lt/login');

    await page.getByTestId('username-input').fill(user);
    await page.getByTestId('password-input').fill(pass);

    await page.getByTestId('login-button').click();

    await expect(page).toHaveURL('/lt/admin');
}