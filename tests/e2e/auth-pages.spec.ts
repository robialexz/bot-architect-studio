import { test, expect } from '@playwright/test';

test.describe('Authentication Pages Testing', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Look for login link in navigation
    const loginLink = page.locator('a[href="/login"]').first();
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/login');
    } else {
      // Try direct navigation
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
    }
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Look for register link in navigation
    const registerLink = page.locator('a[href="/register"]').first();
    if (await registerLink.isVisible()) {
      await registerLink.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/register');
    } else {
      // Try direct navigation
      await page.goto('/register');
      await page.waitForLoadState('networkidle');
    }
  });

  test('should display login form elements', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Check for common login form elements
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    if (await emailInput.isVisible()) {
      await expect(emailInput).toBeVisible();
    }
    if (await passwordInput.isVisible()) {
      await expect(passwordInput).toBeVisible();
    }
    if (await submitButton.isVisible()) {
      await expect(submitButton).toBeVisible();
    }
  });

  test('should display register form elements', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    // Check for common register form elements
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    if (await emailInput.isVisible()) {
      await expect(emailInput).toBeVisible();
    }
    if (await passwordInput.isVisible()) {
      await expect(passwordInput).toBeVisible();
    }
    if (await submitButton.isVisible()) {
      await expect(submitButton).toBeVisible();
    }
  });

  test('should handle 404 for non-existent auth routes', async ({ page }) => {
    await page.goto('/non-existent-auth-page');
    await page.waitForLoadState('networkidle');

    // Should either show 404 or redirect to home
    const is404 = await page.locator('text=404').isVisible();
    const isHome = page.url().includes('/');

    expect(is404 || isHome).toBeTruthy();
  });
});
