import { test, expect, Page } from '@playwright/test';

interface BrokenLink {
  url: string;
  text: string;
  location: string;
  status: number;
  error?: string;
}

class BrokenLinksDetector {
  private page: Page;
  private brokenLinks: BrokenLink[] = [];

  constructor(page: Page) {
    this.page = page;
  }

  async detectBrokenLinksOnPage(pageUrl: string): Promise<BrokenLink[]> {
    console.log(`\n🔍 SCANNING FOR BROKEN LINKS ON: ${pageUrl}`);
    console.log('='.repeat(60));

    const pageBrokenLinks: BrokenLink[] = [];

    try {
      // Navigate to the page
      await this.page.goto(pageUrl, { waitUntil: 'networkidle', timeout: 30000 });
      await this.page.waitForTimeout(2000);

      // Get all links on the page
      const links = await this.page.locator('a[href]').all();
      console.log(`📊 Found ${links.length} links to check`);

      for (let i = 0; i < links.length; i++) {
        const link = links[i];

        try {
          const href = await link.getAttribute('href');
          const text = await link.textContent();

          if (!href) continue;

          // Skip external links, mailto, tel, and hash links
          if (
            href.startsWith('http') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            href.startsWith('#')
          ) {
            continue;
          }

          console.log(
            `🔗 Checking link ${i + 1}/${links.length}: ${href} (${text?.trim() || 'No text'})`
          );

          // Test the link
          const linkResult = await this.testLink(href, text?.trim() || 'No text', pageUrl);
          if (linkResult) {
            pageBrokenLinks.push(linkResult);
            console.log(`❌ BROKEN: ${href} - Status: ${linkResult.status}`);
          } else {
            console.log(`✅ OK: ${href}`);
          }
        } catch (error) {
          console.log(`⚠️  Error checking link: ${error.message}`);
        }
      }

      // Check navigation buttons and other clickable elements
      await this.checkNavigationButtons(pageUrl, pageBrokenLinks);
    } catch (error) {
      console.log(`❌ Error scanning page ${pageUrl}: ${error.message}`);
    }

    return pageBrokenLinks;
  }

  private async testLink(href: string, text: string, fromPage: string): Promise<BrokenLink | null> {
    try {
      // Create a new page for testing the link
      const testPage = await this.page.context().newPage();

      try {
        const response = await testPage.goto(href, {
          waitUntil: 'domcontentloaded',
          timeout: 15000,
        });

        if (!response) {
          return {
            url: href,
            text,
            location: fromPage,
            status: 0,
            error: 'No response received',
          };
        }

        const status = response.status();

        // Check if it's a 404 or other error
        if (status >= 400) {
          return {
            url: href,
            text,
            location: fromPage,
            status,
            error: `HTTP ${status}`,
          };
        }

        // Check if page shows 404 content
        await testPage.waitForTimeout(1000);
        const has404Content = await testPage
          .locator('text=404')
          .isVisible()
          .catch(() => false);
        const hasNotFoundContent = await testPage
          .locator('text=Not Found')
          .isVisible()
          .catch(() => false);

        if (has404Content || hasNotFoundContent) {
          return {
            url: href,
            text,
            location: fromPage,
            status: 404,
            error: '404 content detected on page',
          };
        }

        return null; // Link is working
      } finally {
        await testPage.close();
      }
    } catch (error) {
      return {
        url: href,
        text,
        location: fromPage,
        status: 0,
        error: error.message,
      };
    }
  }

  private async checkNavigationButtons(pageUrl: string, brokenLinks: BrokenLink[]): Promise<void> {
    console.log(`🔘 Checking navigation buttons...`);

    try {
      // Check buttons that might navigate
      const navButtons = await this.page
        .locator(
          'button:has-text("Dashboard"), button:has-text("Profile"), button:has-text("Settings"), button:has-text("Projects"), button:has-text("Builder")'
        )
        .all();

      for (const button of navButtons) {
        const text = await button.textContent();
        console.log(`🔘 Found navigation button: ${text?.trim()}`);

        // We can't easily test button navigation without triggering it
        // So we'll just log them for manual verification
      }
    } catch (error) {
      console.log(`⚠️  Error checking navigation buttons: ${error.message}`);
    }
  }

  async scanAllPages(): Promise<BrokenLink[]> {
    const pagesToScan = [
      '/',
      '/features',
      '/pricing',
      '/templates',
      '/documentation',
      '/auth',
      '/about',
      '/contact',
    ];

    console.log(`\n🌐 COMPREHENSIVE BROKEN LINKS SCAN`);
    console.log(`📄 Scanning ${pagesToScan.length} pages for broken links`);
    console.log('='.repeat(70));

    const allBrokenLinks: BrokenLink[] = [];

    for (const pageUrl of pagesToScan) {
      const pageBrokenLinks = await this.detectBrokenLinksOnPage(pageUrl);
      allBrokenLinks.push(...pageBrokenLinks);
    }

    return allBrokenLinks;
  }

  generateReport(brokenLinks: BrokenLink[]): void {
    console.log(`\n📋 BROKEN LINKS DETECTION REPORT`);
    console.log('='.repeat(50));

    if (brokenLinks.length === 0) {
      console.log(`✅ NO BROKEN LINKS FOUND! All navigation is working correctly.`);
      return;
    }

    console.log(`❌ FOUND ${brokenLinks.length} BROKEN LINKS:`);
    console.log('');

    // Group by status code
    const groupedByStatus = brokenLinks.reduce(
      (acc, link) => {
        const status = link.status.toString();
        if (!acc[status]) acc[status] = [];
        acc[status].push(link);
        return acc;
      },
      {} as Record<string, BrokenLink[]>
    );

    Object.entries(groupedByStatus).forEach(([status, links]) => {
      console.log(`📊 Status ${status} (${links.length} links):`);
      links.forEach((link, index) => {
        console.log(`   ${index + 1}. ${link.url}`);
        console.log(`      Text: "${link.text}"`);
        console.log(`      Found on: ${link.location}`);
        console.log(`      Error: ${link.error || 'HTTP ' + link.status}`);
        console.log('');
      });
    });

    // Recommendations
    console.log(`💡 RECOMMENDATIONS:`);
    const uniqueUrls = [...new Set(brokenLinks.map(link => link.url))];
    uniqueUrls.forEach(url => {
      if (url === '/profile') {
        console.log(`   - Create /profile page or redirect to /account`);
      } else if (url.includes('404') || url.includes('not-found')) {
        console.log(`   - Fix navigation to ${url} - should not lead to 404`);
      } else {
        console.log(`   - Fix or remove link to ${url}`);
      }
    });
  }
}

test.describe('Broken Links Detection', () => {
  test('should detect all broken links across the application', async ({ page }) => {
    const detector = new BrokenLinksDetector(page);

    // Scan all pages for broken links
    const brokenLinks = await detector.scanAllPages();

    // Generate comprehensive report
    detector.generateReport(brokenLinks);

    // Assert that we have no broken links
    expect(brokenLinks.length).toBe(0);
  });

  test('should specifically check navigation menu links', async ({ page }) => {
    console.log(`\n🧭 TESTING NAVIGATION MENU LINKS`);
    console.log('='.repeat(40));

    // Test main navigation
    await page.goto('/', { waitUntil: 'networkidle' });

    const navLinks = await page.locator('nav a[href]').all();
    const brokenNavLinks: BrokenLink[] = [];

    for (const link of navLinks) {
      const href = await link.getAttribute('href');
      const text = await link.textContent();

      if (!href || href.startsWith('http') || href.startsWith('#')) continue;

      console.log(`🔗 Testing nav link: ${href} (${text?.trim()})`);

      try {
        const response = await page.request.get(href);
        if (response.status() >= 400) {
          brokenNavLinks.push({
            url: href,
            text: text?.trim() || 'No text',
            location: 'Navigation menu',
            status: response.status(),
          });
          console.log(`❌ BROKEN: ${href} - Status: ${response.status()}`);
        } else {
          console.log(`✅ OK: ${href}`);
        }
      } catch (error) {
        brokenNavLinks.push({
          url: href,
          text: text?.trim() || 'No text',
          location: 'Navigation menu',
          status: 0,
          error: error.message,
        });
        console.log(`❌ ERROR: ${href} - ${error.message}`);
      }
    }

    if (brokenNavLinks.length > 0) {
      console.log(`\n❌ Found ${brokenNavLinks.length} broken navigation links:`);
      brokenNavLinks.forEach(link => {
        console.log(`   - ${link.url} (${link.text}) - Status: ${link.status}`);
      });
    } else {
      console.log(`\n✅ All navigation links are working!`);
    }

    // Assert navigation is working
    expect(brokenNavLinks.length).toBe(0);
  });
});
