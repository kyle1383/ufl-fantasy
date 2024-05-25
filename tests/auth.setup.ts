import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
    // Perform authentication steps. Replace these actions with your own.
    await page.goto('http://localhost:5173/sign-in');
    await page.getByPlaceholder('Enter your Email').fill('test@test.com');
    await page.getByPlaceholder('Enter your Password').fill('test12345!');
    await page.getByTestId('submit').click();
   
    await page.waitForURL('http://localhost:5173/leagues');
    // Alternatively, you can wait until the page reaches a state where all cookies are set.
    
    await page.context().storageState({ path: authFile });
});