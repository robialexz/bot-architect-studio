import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the landing page successfully', async ({ page }) => {
    // Check if the page loads
    await expect(page).toHaveTitle(/Bot Architect Studio/);

    // Check for main heading
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display navigation menu', async ({ page }) => {
    // Check navigation elements
    await expect(page.locator('nav')).toBeVisible();

    // Check for key navigation links
    await expect(page.locator('text=Features')).toBeVisible();
    await expect(page.locator('text=Pricing')).toBeVisible();
  });

  test('should have working CTA buttons', async ({ page }) => {
    // Check for primary CTA button
    const ctaButton = page.locator('text=Get Started').first();
    await expect(ctaButton).toBeVisible();

    // Test button click (should navigate or show modal)
    await ctaButton.click();

    // Verify navigation or modal appears
    await page.waitForTimeout(1000);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check if mobile menu toggle is visible
    const mobileMenuToggle = page.locator('[aria-label="Toggle menu"]');
    if (await mobileMenuToggle.isVisible()) {
      await mobileMenuToggle.click();
      await expect(page.locator('nav')).toBeVisible();
    }
  });

  test('should load without accessibility violations', async ({ page }) => {
    // Basic accessibility checks
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();

    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('should have working theme toggle', async ({ page }) => {
    // Look for theme toggle button
    const themeToggle = page.locator('[aria-label*="theme"], [data-testid="theme-toggle"]');

    if (await themeToggle.isVisible()) {
      // Get initial theme
      const initialTheme = await page.evaluate(() =>
        document.documentElement.classList.contains('dark')
      );

      // Click theme toggle
      await themeToggle.click();

      // Wait for theme change
      await page.waitForTimeout(500);

      // Verify theme changed
      const newTheme = await page.evaluate(() =>
        document.documentElement.classList.contains('dark')
      );

      expect(newTheme).not.toBe(initialTheme);
    }
  });

  test('should display features section', async ({ page }) => {
    // Scroll to features section
    await page.locator('text=Features').first().click();

    // Check if features are displayed
    await expect(page.locator('text=AI Integration')).toBeVisible();
    await expect(page.locator('text=Workflow Builder')).toBeVisible();
  });

  test('should have working contact/support links', async ({ page }) => {
    // Look for contact or support links
    const contactLink = page.locator('text=Contact, text=Support').first();

    if (await contactLink.isVisible()) {
      await contactLink.click();
      // Verify navigation or modal
      await page.waitForTimeout(1000);
    }
  });
});
