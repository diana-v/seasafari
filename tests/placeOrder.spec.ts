import { expect, test } from '@playwright/test';
import crypto from 'node:crypto';

import { acceptCookies } from './helpers/acceptCookies';
import { loginAsAdmin } from './helpers/loginAsAdmin';

const USER = process.env.BASIC_AUTH_USER ?? '';
const PASS = process.env.BASIC_AUTH_PASSWORD ?? '';
const SECRET = process.env.MAKECOMMERCE_SECRET_KEY ?? '';

test.describe('Order & Payment Lifecycle', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await acceptCookies(page);
    });

    test('Successful payment: UI redirect and Admin status update', async ({ page, request }) => {
        let capturedRef = '';
        const testEmail = process.env.TEST_EMAIL ?? '';

        await page.route('**/api/make-payment', async (route) => {
            capturedRef = route.request().postDataJSON().reference;
            await route.continue();
        });

        await page.goto('/lt#gift-cards');
        await page.getByTestId('gift-card-email-input').fill(testEmail);
        await page.getByTestId('gift-card-terms-checkbox').scrollIntoViewIfNeeded();
        await page.getByTestId('gift-card-terms-checkbox').check({ force: true, position: { x: 1, y: 1 } });

        await page.getByTestId('gift-card-submit-button').click();
        await page.waitForResponse('**/api/make-payment');

        const jsonPayload = JSON.stringify({
            amount: "28.00",
            currency: "EUR",
            reference: capturedRef,
            status: "COMPLETED",
        });

        const mac = crypto.createHash('sha512')
            .update(jsonPayload + SECRET)
            .digest('hex')
            .toUpperCase();

        const webhookResponse = await request.post(`/api/payment-success?email=${encodeURIComponent(testEmail)}`, {
            data: { json: jsonPayload, mac: mac }
        });

        expect(webhookResponse.status()).toBe(200);

        await loginAsAdmin(page, USER, PASS);

        const searchInput = page.getByTestId('search-input');

        await searchInput.fill(capturedRef);
        await page.waitForResponse(r => r.url().includes('order-sort'));

        const orderRow = page.getByTestId(`${capturedRef}-row`);

        await expect(orderRow).toBeVisible();
        await expect(orderRow.locator('input[type="checkbox"]')).not.toBeChecked();
    });

    test('Cancelled payment: Status remains UNPAID and hidden from Admin', async ({ page }) => {
        let capturedRef = '';
        const testEmail = process.env.TEST_EMAIL ?? '';

        await page.route('**/api/make-payment', async (route) => {
            capturedRef = route.request().postDataJSON().reference;
            await route.continue();
        });

        await page.goto('/lt#gift-cards');
        await page.getByTestId('gift-card-email-input').fill(testEmail);
        await page.getByTestId('gift-card-terms-checkbox').scrollIntoViewIfNeeded();
        await page.getByTestId('gift-card-terms-checkbox').check({ force: true, position: { x: 1, y: 1 } });

        await page.getByTestId('gift-card-submit-button').click();
        await page.waitForResponse('**/api/make-payment');

        await page.goto('/lt/#gift-cards');

        await loginAsAdmin(page, USER, PASS);

        const searchInput = page.getByTestId('search-input');

        await searchInput.fill(capturedRef);
        await page.waitForResponse(r => r.url().includes('order-sort'));

        // ASSERTION: The row should NOT be visible because your order-sort
        // filters out Status.UNPAID
        const orderRow = page.getByTestId(`${capturedRef}-row`);

        await expect(orderRow).not.toBeVisible();
    });

    test('Security: Webhook rejects invalid signature', async ({ request }) => {
        const jsonPayload = JSON.stringify({
            amount: "100.00",
            currency: "EUR",
            reference: "HACK-REF",
            status: "COMPLETED"
        });

        const response = await request.post(`/api/payment-success?email=hacker@test.com`, {
            data: {
                json: jsonPayload,
                mac: 'NOT_A_VALID_SHA512_HASH'
            }
        });

        expect(response.status()).toBe(401);
    });
});
