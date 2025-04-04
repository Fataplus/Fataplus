import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show validation errors on login form', async ({ page }) => {
    await page.goto('/login');
    
    // Submit without filling the form
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Check for validation errors
    await expect(page.locator('input[name="email"]:invalid')).toBeVisible();
    await expect(page.locator('input[name="password"]:invalid')).toBeVisible();
  });
  
  test('should navigate to register page from login page', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: 'Register' }).click();
    await expect(page).toHaveURL('/register');
    await expect(page.getByText('Create an account')).toBeVisible();
  });
  
  test('should show validation errors on register form', async ({ page }) => {
    await page.goto('/register');
    
    // Submit without filling the form
    await page.getByRole('button', { name: 'Register' }).click();
    
    // Check for validation errors
    await expect(page.locator('input[name="name"]:invalid')).toBeVisible();
    await expect(page.locator('input[name="email"]:invalid')).toBeVisible();
    await expect(page.locator('input[name="password"]:invalid')).toBeVisible();
    await expect(page.locator('input[name="passwordConfirm"]:invalid')).toBeVisible();
  });
  
  test('should navigate to login page from register page', async ({ page }) => {
    await page.goto('/register');
    await page.getByRole('link', { name: 'Login' }).click();
    await expect(page).toHaveURL('/login');
    await expect(page.getByText('Enter your credentials')).toBeVisible();
  });
});
