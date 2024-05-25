import { test, expect } from '@playwright/test';

test('Loads With Data', async ({ page }) => {
    await page.goto('http://localhost:5173/leagues/257');

    // Expect a title "to contain" a substring.
    const locator = page.locator('#standings p').first();
    await expect(locator).toHaveText('Standings');
});

