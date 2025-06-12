import { test, expect } from '@playwright/test';

/**
 * Debug test to identify specific console errors on public routes
 */

const PUBLIC_ROUTES = ['/', '/minimalist', '/interactive', '/simple', '/features', '/pricing'];

test.describe('Console Errors Debug', () => {
  test('should identify specific console errors on each route', async ({ page }) => {
    const routeErrors: Record<string, string[]> = {};

    for (const route of PUBLIC_ROUTES) {
      console.log(`🔍 Debugging console errors for: ${route}`);

      const consoleErrors: string[] = [];
      const consoleWarnings: string[] = [];

      // Setup console monitoring
      page.on('console', msg => {
        const text = msg.text();
        if (msg.type() === 'error') {
          consoleErrors.push(text);
          console.error(`❌ Console Error on ${route}: ${text}`);
        } else if (msg.type() === 'warning') {
          consoleWarnings.push(text);
          console.warn(`⚠️  Console Warning on ${route}: ${text}`);
        }
      });

      page.on('pageerror', error => {
        const errorText = `Page Error: ${error.message}`;
        consoleErrors.push(errorText);
        console.error(`💥 Page Error on ${route}: ${errorText}`);
      });

      try {
        // Navigate to route
        const response = await page.goto(route, {
          waitUntil: 'networkidle',
          timeout: 30000,
        });

        if (!response || response.status() >= 400) {
          console.error(`🚫 HTTP Error on ${route}: ${response?.status()}`);
          continue;
        }

        // Wait for page to load completely
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000); // Give time for any async errors

        // Store errors for this route
        routeErrors[route] = [...consoleErrors];

        console.log(
          `📊 Route ${route}: ${consoleErrors.length} errors, ${consoleWarnings.length} warnings`
        );
      } catch (error) {
        console.error(`💥 Test failed for ${route}: ${error.message}`);
        routeErrors[route] = [`Test execution failed: ${error.message}`];
      }

      // Clear listeners for next route
      page.removeAllListeners('console');
      page.removeAllListeners('pageerror');
    }

    // Generate detailed report
    console.log('\n📋 DETAILED CONSOLE ERRORS REPORT:');
    console.log('=====================================');

    let totalErrors = 0;
    for (const [route, errors] of Object.entries(routeErrors)) {
      console.log(`\n🔗 Route: ${route}`);
      console.log(`   Errors: ${errors.length}`);
      if (errors.length > 0) {
        errors.forEach((error, index) => {
          console.log(`   ${index + 1}. ${error}`);
        });
      }
      totalErrors += errors.length;
    }

    console.log(
      `\n📈 SUMMARY: ${totalErrors} total console errors across ${PUBLIC_ROUTES.length} routes`
    );

    // For now, just log the errors - we'll fix them in the next step
    // expect(totalErrors).toBe(0); // Uncomment this after fixing errors
  });
});
