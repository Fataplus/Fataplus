import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/FataPlus/);
    await expect(page.getByText('Your agricultural companion')).toBeVisible();
  });

  test('should navigate to the shop page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Browse Shop' }).click();
    await expect(page).toHaveURL('/shop');
    await expect(page.getByText('Agricultural Marketplace')).toBeVisible();
  });

  test('should navigate to the login page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('/login');
    await expect(page.getByText('Enter your credentials')).toBeVisible();
  });

  test('should navigate using bottom navigation', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Shop
    await page.getByRole('button', { name: 'Shop' }).click();
    await expect(page).toHaveURL('/shop');
    
    // Navigate to Learn
    await page.getByRole('button', { name: 'Learn' }).click();
    await expect(page).toHaveURL('/learn');
    
    // Navigate to Community
    await page.getByRole('button', { name: 'Community' }).click();
    await expect(page).toHaveURL('/community');
    
    // Navigate to Account
    await page.getByRole('button', { name: 'Account' }).click();
    await expect(page).toHaveURL(/\/login|\/account/);
    
    // Navigate back to Home
    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL('/');
  });
});
