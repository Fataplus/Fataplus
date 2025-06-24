import { test, expect } from '@playwright/test'

test.describe('Fataplus Platform', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/')
    
    // Check the page title
    await expect(page).toHaveTitle(/Fataplus/)
    
    // Check main navigation is present
    await expect(page.locator('nav')).toBeVisible()
    
    // Check for main sections
    await expect(page.locator('text=Marketplace')).toBeVisible()
    await expect(page.locator('text=Formation')).toBeVisible()
    await expect(page.locator('text=Communauté')).toBeVisible()
  })

  test('navigation works correctly', async ({ page }) => {
    await page.goto('/')
    
    // Test marketplace navigation
    await page.click('text=Marketplace')
    await expect(page).toHaveURL(/.*marketplace/)
    
    // Test learning navigation
    await page.click('text=Formation')
    await expect(page).toHaveURL(/.*learning/)
    
    // Test community navigation
    await page.click('text=Communauté')
    await expect(page).toHaveURL(/.*community/)
  })

  test('responsive design works', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Check mobile menu is present
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible()
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.reload()
    
    // Check desktop navigation is present
    await expect(page.locator('[data-testid="desktop-navigation"]')).toBeVisible()
  })
}) 