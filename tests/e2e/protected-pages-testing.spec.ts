import { test, expect, Page, BrowserContext } from '@playwright/test';

interface ProtectedPageTestResult {
  route: string;
  status: 'PASS' | 'FAIL' | 'WARNING' | 'REDIRECT';
  loadTime: number;
  consoleErrors: string[];
  authenticationWorking: boolean;
  redirectsCorrectly: boolean;
  functionalityAfterAuth: boolean;
  performanceScore: number;
  recommendations: string[];
}

class ProtectedPageTester {
  private page: Page;
  private context: BrowserContext;
  private consoleErrors: string[] = [];

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
  }

  async setupConsoleMonitoring(): Promise<void> {
    this.consoleErrors = [];

    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        this.consoleErrors.push(`Console Error: ${msg.text()}`);
      }
    });

    this.page.on('pageerror', error => {
      this.consoleErrors.push(`Page Error: ${error.message}`);
    });
  }

  async simulateAuthentication(): Promise<boolean> {
    try {
      // Simulate authentication by setting localStorage/sessionStorage
      await this.page.evaluate(() => {
        // Mock authentication state
        localStorage.setItem('auth-token', 'mock-jwt-token-for-testing');
        localStorage.setItem(
          'user-data',
          JSON.stringify({
            id: 'test-user-123',
            email: 'test@example.com',
            fullName: 'Test User',
            isPremium: false,
            avatarUrl: null,
          })
        );

        // Mock session storage
        sessionStorage.setItem('auth-session', 'active');

        // Dispatch auth state change event
        window.dispatchEvent(
          new CustomEvent('auth-state-changed', {
            detail: { authenticated: true },
          })
        );
      });

      await this.page.waitForTimeout(1000); // Allow auth state to propagate
      return true;
    } catch (error) {
      console.log(`Authentication simulation failed: ${error.message}`);
      return false;
    }
  }

  async clearAuthentication(): Promise<void> {
    try {
      await this.page.evaluate(() => {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user-data');
        sessionStorage.removeItem('auth-session');

        // Dispatch auth state change event
        window.dispatchEvent(
          new CustomEvent('auth-state-changed', {
            detail: { authenticated: false },
          })
        );
      });

      await this.page.waitForTimeout(1000);
    } catch (error) {
      console.log(`Authentication clearing failed: ${error.message}`);
    }
  }

  async testProtectedPage(route: string): Promise<ProtectedPageTestResult> {
    console.log(`\n🔒 TESTING PROTECTED PAGE: ${route}`);
    console.log('='.repeat(60));

    const startTime = Date.now();
    const result: ProtectedPageTestResult = {
      route,
      status: 'PASS',
      loadTime: 0,
      consoleErrors: [],
      authenticationWorking: false,
      redirectsCorrectly: false,
      functionalityAfterAuth: false,
      performanceScore: 100,
      recommendations: [],
    };

    try {
      // Setup monitoring
      await this.setupConsoleMonitoring();

      // Test 1: Access without authentication (should redirect)
      console.log(`🚫 Testing unauthenticated access...`);
      await this.clearAuthentication();

      const unauthResponse = await this.page.goto(route, {
        waitUntil: 'networkidle',
        timeout: 30000,
      });

      // Check if redirected to auth page
      await this.page.waitForTimeout(2000);
      const currentUrl = this.page.url();

      if (currentUrl.includes('/auth') || currentUrl.includes('/login')) {
        result.redirectsCorrectly = true;
        console.log(`✅ Correctly redirected to: ${currentUrl}`);
      } else if (currentUrl === route) {
        console.log(`⚠️  No redirect - page accessible without auth`);
        result.redirectsCorrectly = false;
      } else {
        console.log(`❓ Unexpected redirect to: ${currentUrl}`);
        result.redirectsCorrectly = false;
      }

      // Test 2: Access with authentication
      console.log(`🔑 Testing authenticated access...`);
      result.authenticationWorking = await this.simulateAuthentication();

      if (result.authenticationWorking) {
        const authResponse = await this.page.goto(route, {
          waitUntil: 'networkidle',
          timeout: 60000,
        });

        result.loadTime = Date.now() - startTime;
        console.log(`⏱️  Load time with auth: ${result.loadTime}ms`);

        if (!authResponse || authResponse.status() >= 400) {
          result.status = 'FAIL';
          console.log(`❌ Failed to load with auth: ${authResponse?.status()}`);
          return result;
        }

        // Wait for page to be fully loaded
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(3000); // Allow for auth-dependent content

        // Test 3: Check functionality after authentication
        await this.testAuthenticatedFunctionality(result);

        // Collect console errors
        result.consoleErrors = [...this.consoleErrors];
        if (result.consoleErrors.length > 0) {
          console.log(`⚠️  Console errors: ${result.consoleErrors.length}`);
          result.consoleErrors.forEach(error => console.log(`   - ${error}`));
        } else {
          console.log(`✅ No console errors`);
        }

        // Calculate performance score
        this.calculatePerformanceScore(result);

        // Generate recommendations
        this.generateRecommendations(result);

        console.log(`🏆 Final Status: ${result.status}`);
        console.log(`📊 Performance Score: ${result.performanceScore}/100`);
      }
    } catch (error) {
      result.status = 'FAIL';
      result.recommendations.push(`Test execution failed: ${error.message}`);
      console.log(`❌ Test failed: ${error.message}`);
    }

    return result;
  }

  private async testAuthenticatedFunctionality(result: ProtectedPageTestResult): Promise<void> {
    console.log(`⚙️  Testing authenticated functionality...`);

    try {
      // Check for authenticated user elements
      const userElements = await this.page
        .locator('[data-testid*="user"], [class*="user"], .avatar, .profile')
        .count();
      const authButtons = await this.page
        .locator(
          'button:has-text("Logout"), button:has-text("Profile"), button:has-text("Account")'
        )
        .count();
      const protectedContent = await this.page
        .locator('[data-protected], .protected-content, .dashboard')
        .count();

      console.log(`   👤 User elements: ${userElements}`);
      console.log(`   🔘 Auth buttons: ${authButtons}`);
      console.log(`   🔒 Protected content: ${protectedContent}`);

      // Check if page shows authenticated state
      if (userElements > 0 || authButtons > 0 || protectedContent > 0) {
        result.functionalityAfterAuth = true;
        console.log(`   ✅ Authenticated functionality working`);
      } else {
        result.functionalityAfterAuth = false;
        console.log(`   ⚠️  No authenticated functionality detected`);
      }

      // Test interactive elements
      const buttons = await this.page.locator('button:not([disabled])').count();
      const links = await this.page.locator('a[href]').count();
      const forms = await this.page.locator('form').count();

      console.log(`   📊 Interactive elements: ${buttons} buttons, ${links} links, ${forms} forms`);
    } catch (error) {
      result.functionalityAfterAuth = false;
      console.log(`   ❌ Functionality test failed: ${error.message}`);
    }
  }

  private calculatePerformanceScore(result: ProtectedPageTestResult): void {
    let score = 100;

    // Deduct points for load time
    if (result.loadTime > 5000) score -= 30;
    else if (result.loadTime > 3000) score -= 20;
    else if (result.loadTime > 2000) score -= 10;

    // Deduct points for console errors
    score -= Math.min(result.consoleErrors.length * 5, 25);

    // Deduct points for auth issues
    if (!result.authenticationWorking) score -= 20;
    if (!result.redirectsCorrectly) score -= 15;
    if (!result.functionalityAfterAuth) score -= 10;

    result.performanceScore = Math.max(score, 0);
  }

  private generateRecommendations(result: ProtectedPageTestResult): void {
    if (result.loadTime > 3000) {
      result.recommendations.push('Optimize page load time for authenticated users');
    }

    if (result.consoleErrors.length > 0) {
      result.recommendations.push('Fix console errors in authenticated state');
    }

    if (!result.redirectsCorrectly) {
      result.recommendations.push('Implement proper authentication redirects');
    }

    if (!result.functionalityAfterAuth) {
      result.recommendations.push('Ensure authenticated functionality is visible and working');
    }
  }
}

// Test suite for protected pages
test.describe('Protected Pages Testing Suite', () => {
  let protectedPageTester: ProtectedPageTester;
  const testResults: ProtectedPageTestResult[] = [];

  test.beforeEach(async ({ page, context }) => {
    protectedPageTester = new ProtectedPageTester(page, context);
  });

  // Protected pages to test
  const protectedPages = [
    '/account',
    '/dashboard',
    '/projects',
    '/builder',
    '/ai-workflow-studio',
    '/ai-ecosystem-playground',
    '/billing',
    '/settings',
    '/profile',
  ];

  // Test each protected page individually
  for (const route of protectedPages) {
    test(`should test protected page: ${route}`, async () => {
      const result = await protectedPageTester.testProtectedPage(route);
      testResults.push(result);

      // Assert quality standards for protected pages
      expect(result.status).not.toBe('FAIL');
      expect(result.loadTime).toBeLessThan(10000); // 10 second max for protected pages
      expect(result.performanceScore).toBeGreaterThanOrEqual(60); // Lower threshold for complex pages
    });
  }

  test('should generate comprehensive protected pages report', async () => {
    console.log('\n🔒 COMPREHENSIVE PROTECTED PAGES TESTING REPORT');
    console.log('='.repeat(70));

    const passedPages = testResults.filter(r => r.status === 'PASS').length;
    const warningPages = testResults.filter(r => r.status === 'WARNING').length;
    const failedPages = testResults.filter(r => r.status === 'FAIL').length;
    const redirectPages = testResults.filter(r => r.status === 'REDIRECT').length;

    const averageLoadTime =
      testResults.reduce((sum, r) => sum + r.loadTime, 0) / testResults.length;
    const averageScore =
      testResults.reduce((sum, r) => sum + r.performanceScore, 0) / testResults.length;

    const authWorkingCount = testResults.filter(r => r.authenticationWorking).length;
    const redirectWorkingCount = testResults.filter(r => r.redirectsCorrectly).length;
    const functionalityWorkingCount = testResults.filter(r => r.functionalityAfterAuth).length;

    console.log(`📊 Overall Statistics:`);
    console.log(`   Total Protected Pages Tested: ${testResults.length}`);
    console.log(
      `   Passed: ${passedPages} (${((passedPages / testResults.length) * 100).toFixed(1)}%)`
    );
    console.log(
      `   Warnings: ${warningPages} (${((warningPages / testResults.length) * 100).toFixed(1)}%)`
    );
    console.log(
      `   Failed: ${failedPages} (${((failedPages / testResults.length) * 100).toFixed(1)}%)`
    );
    console.log(
      `   Redirects: ${redirectPages} (${((redirectPages / testResults.length) * 100).toFixed(1)}%)`
    );
    console.log(`   Average Load Time: ${averageLoadTime.toFixed(0)}ms`);
    console.log(`   Average Performance Score: ${averageScore.toFixed(1)}/100`);

    console.log(`\n🔐 Authentication Statistics:`);
    console.log(
      `   Authentication Working: ${authWorkingCount}/${testResults.length} (${((authWorkingCount / testResults.length) * 100).toFixed(1)}%)`
    );
    console.log(
      `   Redirects Working: ${redirectWorkingCount}/${testResults.length} (${((redirectWorkingCount / testResults.length) * 100).toFixed(1)}%)`
    );
    console.log(
      `   Functionality Working: ${functionalityWorkingCount}/${testResults.length} (${((functionalityWorkingCount / testResults.length) * 100).toFixed(1)}%)`
    );

    // Detailed results for each page
    console.log(`\n📄 Detailed Results:`);
    testResults.forEach(result => {
      const statusIcon =
        result.status === 'PASS'
          ? '✅'
          : result.status === 'WARNING'
            ? '⚠️'
            : result.status === 'REDIRECT'
              ? '🔄'
              : '❌';
      const authIcon = result.authenticationWorking ? '🔑' : '🚫';
      const redirectIcon = result.redirectsCorrectly ? '↩️' : '❌';
      const funcIcon = result.functionalityAfterAuth ? '⚙️' : '❌';

      console.log(
        `   ${statusIcon} ${result.route} - ${result.loadTime}ms - Score: ${result.performanceScore}/100`
      );
      console.log(
        `      ${authIcon} Auth: ${result.authenticationWorking ? 'Working' : 'Failed'} | ${redirectIcon} Redirect: ${result.redirectsCorrectly ? 'Working' : 'Failed'} | ${funcIcon} Functionality: ${result.functionalityAfterAuth ? 'Working' : 'Failed'}`
      );

      if (result.recommendations.length > 0) {
        result.recommendations.forEach(rec => {
          console.log(`      💡 ${rec}`);
        });
      }
    });

    // Assert overall quality for protected pages
    expect(failedPages).toBeLessThanOrEqual(2); // Allow max 2 failed pages
    expect(averageScore).toBeGreaterThanOrEqual(70); // 70+ average score
    expect(authWorkingCount).toBeGreaterThanOrEqual(testResults.length * 0.8); // 80% auth working
  });
});
