import { expect, test } from '@playwright/test';

import { Order } from '@/server/db/schema';
import { createGiftCardToken } from '@/utils/jwt';

import { acceptCookies } from './helpers/acceptCookies';
import { loginAsAdmin } from './helpers/loginAsAdmin';

const USER = process.env.BASIC_AUTH_USER ?? '';
const PASS = process.env.BASIC_AUTH_PASSWORD ?? '';

test.describe('Admin login', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');

        await acceptCookies(page);
    });

    test('user can log in via UI', async ({ page }) => {
        await page.goto('/lt/login');

        await page.getByTestId('username-input').fill(USER);
        await page.getByTestId('password-input').fill(PASS);

        await page.getByTestId('login-button').click();

        await expect(page).toHaveURL('/lt/admin');
    });

    test('redirects unauthenticated user away from admin', async ({ page }) => {
        await page.goto('/lt/admin');

        await expect(page).toHaveURL(/login/);
    });
});

test.describe('Admin panel', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');

        await acceptCookies(page);

        await loginAsAdmin(page, USER, PASS);
    });

    test('admin page loads orders table', async ({ page }) => {
        await expect(page.locator('table')).toBeVisible();
        await expect(page.getByTestId('search-input')).toBeVisible();
    });

    test('can search orders', async ({ page }) => {
        const firstRow = page.locator('tbody tr').first();
        const orderRef = await firstRow.locator('td').first().textContent() ?? '';

        await page.getByTestId('search-input').fill(orderRef);

        await page.waitForResponse(res =>
            res.url().includes('/api/order-sort') &&
            res.status() === 200
        );

        await expect(page.getByTestId(`${orderRef}-row`)).toBeVisible();
    });

    test('can complete order and see it in completed filter', async ({ page }) => {
        const rows = page.locator('tbody tr');

        const nonCompletedRow = rows.filter({
            has: page.locator('input[type="checkbox"]:not(:checked)'),
        }).first();

        await expect(nonCompletedRow).toBeVisible();

        const orderRef = await nonCompletedRow.locator('td').first().textContent();

        await nonCompletedRow.locator('input[type="checkbox"]').click()

        await page.waitForResponse(res =>
            res.url().includes('/api/order-update') &&
            res.status() === 200
        )
        await page.getByTestId('filter-checkbox').check()

        await page.waitForResponse(res =>
            res.url().includes('/api/order-sort') &&
            res.status() === 200
        )

        const updatedRow = page.getByTestId(`${orderRef}-row`);

        await expect(updatedRow).toBeVisible();
        await expect(updatedRow.locator('input[type="checkbox"]')).toBeChecked();
    });

    test('can sort orders', async ({ page }) => {
        await page.getByTestId('sort-orderRef').click();

        const response = await page.waitForResponse(res =>
            res.url().includes('/api/order-sort') &&
            res.status() === 200
        );

        const apiOrders: Order[] = await response.json();

        const expected = apiOrders.map(o => o.orderRef);

        const actual = await page
            .locator('tbody tr td:first-child')
            .allTextContents();

        expect(expected).toEqual(actual);
    });

    test('can resend email', async ({ page }) => {
        await page.route('**/api/resend-email', async route => {
            await route.fulfill({
                body: JSON.stringify({ message: 'Email sent successfully' }),
                contentType: 'application/json',
                status: 200,
            });
        });

        const resendBtn = page.getByTestId('resend-email-button').first();

        await expect(resendBtn).toBeVisible();

        await resendBtn.click();

        await expect(page.getByTestId('alert-success')).toBeVisible();
    });

    test('QR scan completes order and updates UI', async ({ page }) => {
        await page.getByTestId('sort-validFrom').click();

        await page.waitForResponse(res =>
            res.url().includes('/api/order-sort') && res.ok()
        );

        const orderRow = page.locator('[data-testid$="-row"]').first();

        const orderRef = await orderRow.locator('td').first().textContent();

        if (!orderRef) throw new Error('No order found');

        const validToText = await orderRow.locator('td').nth(4).textContent();

        if (!validToText) throw new Error('Missing validTo');

        const validTo = new Date(validToText);

        const token = createGiftCardToken(orderRef, validTo);

        await page.getByTestId('scan-qr-button').click();
        await expect(page.getByTestId('qr-scanner')).toBeVisible();

        await page.evaluate((t) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (globalThis as any).__testScan?.(`https://test.com?token=${encodeURIComponent(t)}`);
        }, token);

        await page.waitForResponse(res =>
            res.url().includes('/api/order-sort') && res.ok()
        );

        await expect(page.getByTestId('alert-success')).toBeVisible();

        await page.getByTestId('filter-checkbox').click();

        await expect(
            page.locator(`[data-testid="${orderRef}-row"] input[type="checkbox"]`)
        ).toBeChecked();
    });

    test('QR scan rejects expired order', async ({ page }) => {
        const orderRow = page.locator('[data-testid$="-row"]').first();

        const orderRef = await orderRow.locator('td').first().textContent();

        if (!orderRef) throw new Error('No order found');

        const validToText = await orderRow.locator('td').nth(4).textContent();

        if (!validToText) throw new Error('Missing validTo');

        const validTo = new Date(validToText);

        const token = createGiftCardToken(orderRef, validTo);

        await page.getByTestId('scan-qr-button').click();
        await expect(page.getByTestId('qr-scanner')).toBeVisible();

        await page.evaluate((t) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (globalThis as any).__testScan?.(`https://test.com?token=${t}`);
        }, token);

        await expect(page.getByTestId('alert-error')).toBeVisible();
    });

    test('QR scan rejects already completed order', async ({ page }) => {
        await page.getByTestId('filter-checkbox').click();

        await page.waitForResponse(res =>
            res.url().includes('/api/order-sort') && res.ok()
        );

        const orderRow = page.locator('[data-testid$="-row"]').first();

        const orderRef = await orderRow.locator('td').first().textContent();

        if (!orderRef) throw new Error('No order found');

        const validToText = await orderRow.locator('td').nth(4).textContent();

        if (!validToText) throw new Error('Missing validTo');

        const validTo = new Date(validToText);

        const token = createGiftCardToken(orderRef, validTo);

        await page.getByTestId('scan-qr-button').click();
        await expect(page.getByTestId('qr-scanner')).toBeVisible();

        await page.evaluate((t) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (globalThis as any).__testScan?.(`https://test.com?token=${t}`);
        }, token);

        await expect(page.getByTestId('alert-error')).toBeVisible();
    });

    test('missing cookie redirects to login', async ({ context, page }) => {
        await context.clearCookies();

        await page.goto('/lt/admin');
        await expect(page).toHaveURL(/\/login/);
    });

    test('invalid auth cookie redirects to login', async ({ context, page }) => {
        await context.clearCookies();
        const badAuth = Buffer.from('wrong:creds').toString('base64');

        await context.addCookies([
            {
                domain: process.env.NEXT_PUBLIC_DOMAIN,
                name: 'auth',
                path: '/',
                value: badAuth,
            },
        ]);

        await page.goto('/lt/admin');

        await expect(page).toHaveURL(/login/);
    });
});
