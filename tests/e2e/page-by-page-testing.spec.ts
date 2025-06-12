import { test, expect, Page, BrowserContext } from '@playwright/test';

interface PageTestResult {
  route: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  loadTime: number;
  consoleErrors: string[];
  visualIssues: string[];
  functionalIssues: string[];
  responsiveIssues: string[];
  accessibilityIssues: string[];
  performanceScore: number;
  recommendations: string[];
}

class PageTester {
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

  async testPage(route: string): Promise<PageTestResult> {
    console.log(`\n🔍 TESTING PAGE: ${route}`);
    console.log('='.repeat(50));

    const startTime = Date.now();
    const result: PageTestResult = {
      route,
      status: 'PASS',
      loadTime: 0,
      consoleErrors: [],
      visualIssues: [],
      functionalIssues: [],
      responsiveIssues: [],
      accessibilityIssues: [],
      performanceScore: 100,
      recommendations: [],
    };

    try {
      // Setup monitoring
      await this.setupConsoleMonitoring();

      // Navigate to page
      console.log(`📄 Navigating to ${route}...`);
      const response = await this.page.goto(route, {
        waitUntil: 'networkidle',
        timeout: 120000,
      });

      if (!response || response.status() >= 400) {
        result.functionalIssues.push(`HTTP ${response?.status()}: Failed to load page`);
        result.status = 'FAIL';
        return result;
      }

      // Measure load time
      result.loadTime = Date.now() - startTime;
      console.log(`⏱️  Load time: ${result.loadTime}ms`);

      // Wait for page to be fully loaded
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForTimeout(2000); // Allow for async operations

      // Collect console errors
      result.consoleErrors = [...this.consoleErrors];
      if (result.consoleErrors.length > 0) {
        console.log(`❌ Console errors found: ${result.consoleErrors.length}`);
        result.consoleErrors.forEach(error => console.log(`   - ${error}`));
      } else {
        console.log(`✅ No console errors`);
      }

      // Test visual elements
      await this.testVisualElements(result);

      // Test functionality
      await this.testFunctionality(result);

      // Test responsive design
      await this.testResponsiveDesign(result);

      // Test accessibility
      await this.testAccessibility(result);

      // Calculate performance score
      this.calculatePerformanceScore(result);

      // Generate recommendations
      this.generateRecommendations(result);

      // Determine final status
      if (result.functionalIssues.length > 0 || result.consoleErrors.length > 5) {
        result.status = 'FAIL';
      } else if (
        result.visualIssues.length > 0 ||
        result.consoleErrors.length > 0 ||
        result.loadTime > 3000
      ) {
        result.status = 'WARNING';
      }

      console.log(`🏆 Final Status: ${result.status}`);
      console.log(`📊 Performance Score: ${result.performanceScore}/100`);
    } catch (error) {
      result.functionalIssues.push(`Test execution failed: ${error.message}`);
      result.status = 'FAIL';
      console.log(`❌ Test failed: ${error.message}`);
    }

    return result;
  }

  private async testVisualElements(result: PageTestResult): Promise<void> {
    console.log(`👁️  Testing visual elements...`);

    try {
      // Check if page has basic structure
      const hasHeader = (await this.page.locator('header, nav, [role="banner"]').count()) > 0;
      const hasMain = (await this.page.locator('main, [role="main"], .main-content').count()) > 0;
      const hasFooter = (await this.page.locator('footer, [role="contentinfo"]').count()) > 0;

      if (!hasHeader && !hasMain) {
        result.visualIssues.push('Page lacks basic semantic structure (header/main)');
      }

      // Check for broken images
      const images = await this.page.locator('img').all();
      for (const img of images) {
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
        if (naturalWidth === 0) {
          result.visualIssues.push('Broken image detected');
        }
      }

      // Check for missing alt text
      const imagesWithoutAlt = await this.page.locator('img:not([alt])').count();
      if (imagesWithoutAlt > 0) {
        result.visualIssues.push(`${imagesWithoutAlt} images missing alt text`);
      }

      console.log(
        `   ${result.visualIssues.length === 0 ? '✅' : '⚠️'} Visual elements: ${result.visualIssues.length} issues found`
      );
    } catch (error) {
      result.visualIssues.push(`Visual testing failed: ${error.message}`);
    }
  }

  private async testFunctionality(result: PageTestResult): Promise<void> {
    console.log(`⚙️  Testing functionality...`);

    try {
      // Test navigation links
      const links = await this.page.locator('a[href]').all();
      let brokenLinks = 0;

      for (const link of links.slice(0, 5)) {
        // Test first 5 links to avoid timeout
        const href = await link.getAttribute('href');
        if (href && href.startsWith('/') && !href.includes('#')) {
          try {
            const response = await this.page.request.get(href);
            if (response.status() >= 400) {
              brokenLinks++;
            }
          } catch {
            brokenLinks++;
          }
        }
      }

      if (brokenLinks > 0) {
        result.functionalIssues.push(`${brokenLinks} potentially broken internal links`);
      }

      // Test interactive elements
      const buttons = await this.page.locator('button, [role="button"]').count();
      const inputs = await this.page.locator('input, textarea, select').count();

      console.log(`   📊 Interactive elements: ${buttons} buttons, ${inputs} inputs`);
      console.log(
        `   ${result.functionalIssues.length === 0 ? '✅' : '⚠️'} Functionality: ${result.functionalIssues.length} issues found`
      );
    } catch (error) {
      result.functionalIssues.push(`Functionality testing failed: ${error.message}`);
    }
  }

  private async testResponsiveDesign(result: PageTestResult): Promise<void> {
    console.log(`📱 Testing responsive design...`);

    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 },
    ];

    try {
      for (const viewport of viewports) {
        await this.page.setViewportSize({ width: viewport.width, height: viewport.height });
        await this.page.waitForTimeout(1000);

        // Check for horizontal scroll
        const hasHorizontalScroll = await this.page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });

        if (hasHorizontalScroll) {
          result.responsiveIssues.push(`Horizontal scroll detected on ${viewport.name}`);
        }

        // Check for overlapping elements
        const overlappingElements = await this.page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll('*'));
          return elements.some(el => {
            const rect = el.getBoundingClientRect();
            return rect.width > window.innerWidth;
          });
        });

        if (overlappingElements) {
          result.responsiveIssues.push(`Elements overflow viewport on ${viewport.name}`);
        }
      }

      // Reset to desktop viewport
      await this.page.setViewportSize({ width: 1920, height: 1080 });

      console.log(
        `   ${result.responsiveIssues.length === 0 ? '✅' : '⚠️'} Responsive design: ${result.responsiveIssues.length} issues found`
      );
    } catch (error) {
      result.responsiveIssues.push(`Responsive testing failed: ${error.message}`);
    }
  }

  private async testAccessibility(result: PageTestResult): Promise<void> {
    console.log(`♿ Testing accessibility...`);

    try {
      // Check heading structure
      const headings = await this.page.locator('h1, h2, h3, h4, h5, h6').all();
      const headingLevels = [];

      for (const heading of headings) {
        const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
        headingLevels.push(parseInt(tagName.charAt(1)));
      }

      // Check for proper heading hierarchy
      for (let i = 1; i < headingLevels.length; i++) {
        if (headingLevels[i] - headingLevels[i - 1] > 1) {
          result.accessibilityIssues.push('Heading hierarchy skips levels');
          break;
        }
      }

      // Check for ARIA labels
      const ariaLabels = await this.page.locator('[aria-label], [aria-labelledby]').count();
      const interactiveElements = await this.page
        .locator('button, a, input, select, textarea')
        .count();

      if (interactiveElements > 0 && ariaLabels === 0) {
        result.accessibilityIssues.push('No ARIA labels found for interactive elements');
      }

      // Check color contrast (basic check)
      const hasLowContrast = await this.page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('*'));
        return elements.some(el => {
          const styles = window.getComputedStyle(el);
          const color = styles.color;
          const backgroundColor = styles.backgroundColor;
          return color === backgroundColor && color !== 'rgba(0, 0, 0, 0)';
        });
      });

      if (hasLowContrast) {
        result.accessibilityIssues.push('Potential color contrast issues detected');
      }

      console.log(
        `   📊 Accessibility metrics: ${headings.length} headings, ${ariaLabels} ARIA labels`
      );
      console.log(
        `   ${result.accessibilityIssues.length === 0 ? '✅' : '⚠️'} Accessibility: ${result.accessibilityIssues.length} issues found`
      );
    } catch (error) {
      result.accessibilityIssues.push(`Accessibility testing failed: ${error.message}`);
    }
  }

  private calculatePerformanceScore(result: PageTestResult): void {
    let score = 100;

    // Deduct points for load time
    if (result.loadTime > 3000) score -= 20;
    else if (result.loadTime > 2000) score -= 10;
    else if (result.loadTime > 1000) score -= 5;

    // Deduct points for console errors
    score -= Math.min(result.consoleErrors.length * 5, 25);

    // Deduct points for issues
    score -= result.visualIssues.length * 3;
    score -= result.functionalIssues.length * 10;
    score -= result.responsiveIssues.length * 5;
    score -= result.accessibilityIssues.length * 4;

    result.performanceScore = Math.max(score, 0);
  }

  private generateRecommendations(result: PageTestResult): void {
    if (result.loadTime > 3000) {
      result.recommendations.push(
        'Optimize page load time - consider lazy loading and code splitting'
      );
    }

    if (result.consoleErrors.length > 0) {
      result.recommendations.push('Fix console errors to improve user experience');
    }

    if (result.visualIssues.length > 0) {
      result.recommendations.push('Address visual issues for better presentation');
    }

    if (result.responsiveIssues.length > 0) {
      result.recommendations.push('Improve responsive design for better mobile experience');
    }

    if (result.accessibilityIssues.length > 0) {
      result.recommendations.push('Enhance accessibility for inclusive user experience');
    }
  }
}

// Test suite for individual pages
test.describe('Page-by-Page Testing Suite', () => {
  let pageTester: PageTester;
  const testResults: PageTestResult[] = [];

  test.beforeEach(async ({ page, context }) => {
    pageTester = new PageTester(page, context);
  });

  // Public pages to test
  const publicPages = [
    '/',
    '/features',
    '/pricing',
    '/templates',
    '/about',
    '/contact',
    '/documentation',
    '/auth',
  ];

  // Test each public page individually
  for (const route of publicPages) {
    test(`should test page: ${route}`, async () => {
      const result = await pageTester.testPage(route);
      testResults.push(result);

      // Assert quality standards
      expect(result.status).not.toBe('FAIL');
      expect(result.loadTime).toBeLessThan(5000); // 5 second max
      expect(result.functionalIssues.length).toBe(0);
      expect(result.performanceScore).toBeGreaterThanOrEqual(70);
    });
  }

  test('should generate comprehensive page testing report', async () => {
    // This test will run after all individual page tests
    console.log('\n📋 COMPREHENSIVE PAGE TESTING REPORT');
    console.log('='.repeat(60));

    const passedPages = testResults.filter(r => r.status === 'PASS').length;
    const warningPages = testResults.filter(r => r.status === 'WARNING').length;
    const failedPages = testResults.filter(r => r.status === 'FAIL').length;
    const averageLoadTime =
      testResults.reduce((sum, r) => sum + r.loadTime, 0) / testResults.length;
    const averageScore =
      testResults.reduce((sum, r) => sum + r.performanceScore, 0) / testResults.length;

    console.log(`📊 Overall Statistics:`);
    console.log(`   Total Pages Tested: ${testResults.length}`);
    console.log(
      `   Passed: ${passedPages} (${((passedPages / testResults.length) * 100).toFixed(1)}%)`
    );
    console.log(
      `   Warnings: ${warningPages} (${((warningPages / testResults.length) * 100).toFixed(1)}%)`
    );
    console.log(
      `   Failed: ${failedPages} (${((failedPages / testResults.length) * 100).toFixed(1)}%)`
    );
    console.log(`   Average Load Time: ${averageLoadTime.toFixed(0)}ms`);
    console.log(`   Average Performance Score: ${averageScore.toFixed(1)}/100`);

    // Detailed results for each page
    console.log(`\n📄 Detailed Results:`);
    testResults.forEach(result => {
      const statusIcon =
        result.status === 'PASS' ? '✅' : result.status === 'WARNING' ? '⚠️' : '❌';
      console.log(
        `   ${statusIcon} ${result.route} - ${result.loadTime}ms - Score: ${result.performanceScore}/100`
      );

      if (result.recommendations.length > 0) {
        result.recommendations.forEach(rec => {
          console.log(`      💡 ${rec}`);
        });
      }
    });

    // Assert overall quality
    expect(failedPages).toBe(0);
    expect(averageScore).toBeGreaterThanOrEqual(80);
    expect(averageLoadTime).toBeLessThan(3000);
  });
});
