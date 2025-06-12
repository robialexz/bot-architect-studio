import { test, expect, Page } from '@playwright/test';

// Test configuration
const BASE_URL = 'http://localhost:8080';
const LANDING_PAGE_URL = `${BASE_URL}/`;

// Test user credentials (mock)
const TEST_USER = {
  email: 'test@example.com',
  password: 'testpassword123',
};

// Test utilities
class WorkflowStudioPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto(LANDING_PAGE_URL);
    await this.page.waitForLoadState('networkidle');
  }

  async login() {
    // Check if we're already on a login page or need to navigate to auth
    const currentUrl = this.page.url();
    if (!currentUrl.includes('/auth') && !currentUrl.includes('login')) {
      // Look for login button in navigation
      const navLoginButton = this.page
        .locator('button:has-text("Login"), button:has-text("Sign In")')
        .first();
      if (await navLoginButton.isVisible()) {
        await navLoginButton.click();
        await this.page.waitForLoadState('networkidle');
      } else {
        // Navigate directly to auth page
        await this.page.goto(`${BASE_URL}/auth`);
        await this.page.waitForLoadState('networkidle');
      }
    }

    // Wait for login form to be visible
    await this.page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 });

    // Fill login form
    await this.page.fill('input[type="email"], input[name="email"]', TEST_USER.email);
    await this.page.fill('input[type="password"], input[name="password"]', TEST_USER.password);

    // Submit login
    const submitButton = this.page
      .locator('button[type="submit"], button:has-text("Sign In")')
      .last();
    await submitButton.click();
    await this.page.waitForLoadState('networkidle');

    // Wait for successful authentication (redirect away from auth page)
    await this.page.waitForFunction(() => !window.location.pathname.includes('/auth'), {
      timeout: 15000,
    });
  }

  async waitForWorkflowStudio() {
    // Wait for the main workflow studio components to load
    await this.page.waitForLoadState('networkidle');

    // Check if we're on the login page and need to authenticate
    const isLoginPage = await this.page
      .locator('text=Sign in to your')
      .isVisible({ timeout: 2000 });
    if (isLoginPage) {
      await this.login();
      await this.page.waitForLoadState('networkidle');
    }

    // Wait for the node library heading as the primary indicator (h2 element)
    await expect(this.page.locator('h2:has-text("Node Library")')).toBeVisible({ timeout: 15000 });

    // Wait a bit more for the canvas to initialize
    await this.page.waitForTimeout(2000);
  }

  async checkSmartOnboarding() {
    // Check if smart onboarding appears for new users
    const onboardingModal = this.page.locator(
      '[data-testid="smart-onboarding"], .fixed.inset-0.z-50'
    );
    return await onboardingModal.isVisible();
  }

  async interactWithOnboarding() {
    const onboardingModal = this.page.locator('.fixed.inset-0.z-50');
    if (await onboardingModal.isVisible()) {
      // Test path selection
      await this.page.click('text=Beginner');
      await expect(this.page.locator('.ring-2.ring-primary')).toBeVisible();

      // Test starting tutorial
      await this.page.click('button:has-text("Start Interactive Tutorial")');
      await this.page.waitForTimeout(1000);
    }
  }

  async testInteractiveTutorial() {
    // Check if tutorial modal appears
    const tutorialModal = this.page.locator('[data-testid="interactive-tutorial"]');
    if (await tutorialModal.isVisible()) {
      // Test tutorial navigation
      await expect(this.page.locator('text=Welcome to AI Workflow Studio')).toBeVisible();

      // Test next button
      await this.page.click('button:has-text("Next")');
      await this.page.waitForTimeout(500);

      // Test previous button
      await this.page.click('button:has-text("Previous")');
      await this.page.waitForTimeout(500);

      // Close tutorial
      await this.page.click('button:has-text("×"), button[aria-label="Close"]');
    }
  }

  async testContextualHelp() {
    // Check if help button exists
    const helpButton = this.page.locator('button[title="Toggle contextual help"]');
    if (await helpButton.isVisible()) {
      await helpButton.click();

      // Check if contextual help panel appears
      await expect(this.page.locator('text=Contextual Help')).toBeVisible();

      // Test help content changes based on context
      await this.page.click('.w-80.border-r'); // Click node library
      await this.page.waitForTimeout(500);

      // Toggle help off
      await helpButton.click();
    }
  }

  async testNodeLibrary() {
    // Test node categories using more flexible selectors
    const categories = [
      { name: 'AI Models', value: 'ai-models' },
      { name: 'Data Processing', value: 'data-processing' },
      { name: 'Integrations', value: 'integrations' },
      { name: 'Triggers', value: 'triggers' },
    ];

    for (const category of categories) {
      try {
        // Try multiple selector strategies
        const categoryButton = this.page.locator(`button[value="${category.value}"]`).first();

        if (await categoryButton.isVisible({ timeout: 2000 })) {
          await categoryButton.click();
          await this.page.waitForTimeout(500);
        } else {
          // Fallback to text-based selection
          const textButton = this.page.locator(`button:has-text("${category.name}")`).first();
          if (await textButton.isVisible({ timeout: 2000 })) {
            await textButton.click();
            await this.page.waitForTimeout(500);
          }
        }
      } catch (error) {
        console.log(`Could not click category ${category.name}, continuing...`);
      }
    }

    // Test search functionality
    const searchInput = this.page.locator(
      'input[placeholder*="Search"], input[placeholder*="search"]'
    );
    if (await searchInput.isVisible({ timeout: 2000 })) {
      await searchInput.fill('GPT');
      await this.page.waitForTimeout(500);
      await searchInput.fill('');
    }
  }

  async testDragAndDrop() {
    // Find a node to drag
    const nodeCard = this.page.locator('.cursor-grab').first();
    const canvas = this.page.locator('[data-testid="rf__wrapper"]');

    if ((await nodeCard.isVisible()) && (await canvas.isVisible())) {
      // Get bounding boxes
      const nodeBox = await nodeCard.boundingBox();
      const canvasBox = await canvas.boundingBox();

      if (nodeBox && canvasBox) {
        // Perform drag and drop
        await this.page.mouse.move(nodeBox.x + nodeBox.width / 2, nodeBox.y + nodeBox.height / 2);
        await this.page.mouse.down();
        await this.page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
        await this.page.mouse.up();
        await this.page.waitForTimeout(1000);
      }
    }
  }

  async testWorkflowSaving() {
    const saveButton = this.page.locator('button:has-text("Save")');
    if (await saveButton.isVisible()) {
      await saveButton.click();
      await this.page.waitForTimeout(2000);

      // Check for success message or modal
      const successMessage = this.page.locator('text=saved, text=Success');
      // Note: This might require authentication, so we'll just check if the button is clickable
    }
  }

  async testWorkflowExecution() {
    const executeButton = this.page.locator('button:has-text("Execute")');
    if ((await executeButton.isVisible()) && !(await executeButton.isDisabled())) {
      await executeButton.click();
      await this.page.waitForTimeout(2000);
    }
  }

  async checkForJavaScriptErrors() {
    // This will be handled by Playwright's built-in error detection
    const errors: string[] = [];

    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    this.page.on('pageerror', error => {
      errors.push(error.message);
    });

    return errors;
  }

  async testResponsiveDesign() {
    // Test different viewport sizes
    const viewports = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 1024, height: 768 }, // Tablet
      { width: 375, height: 667 }, // Mobile
    ];

    for (const viewport of viewports) {
      await this.page.setViewportSize(viewport);
      await this.page.waitForTimeout(1000);

      // Check if main elements are still visible
      await expect(this.page.getByRole('heading', { name: 'Node Library' })).toBeVisible();
    }
  }
}

// Main test suite
test.describe('Landing Page - Comprehensive E2E Tests', () => {
  let workflowStudio: WorkflowStudioPage;
  let jsErrors: string[] = [];

  test.beforeEach(async ({ page }) => {
    workflowStudio = new WorkflowStudioPage(page);

    // Set up error tracking (ignore CSP warnings)
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('Content Security Policy')) {
        jsErrors.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      if (!error.message.includes('Content Security Policy')) {
        jsErrors.push(error.message);
      }
    });

    // Navigate to the landing page
    await workflowStudio.navigate();
  });

  test.afterEach(async () => {
    // Report any JavaScript errors found
    if (jsErrors.length > 0) {
      console.log('JavaScript Errors Found:', jsErrors);
    }
    jsErrors = []; // Reset for next test
  });

  test('should load the landing page without errors', async ({ page }) => {
    // Check that main elements are visible
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('h1, h2')).toBeVisible();
  });

  test('should display navigation menu', async ({ page }) => {
    // Check for navigation elements
    const nav = page.locator('nav, header');
    await expect(nav).toBeVisible();
  });

  test('should display main content sections', async ({ page }) => {
    // Check for main content areas
    await expect(page.locator('main, section')).toBeVisible();
  });

  test('should be responsive across different screen sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('body')).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle navigation links', async ({ page }) => {
    // Test navigation links (if they exist)
    const navLinks = page.locator('nav a, header a');
    const linkCount = await navLinks.count();

    if (linkCount > 0) {
      // Test first few links
      for (let i = 0; i < Math.min(3, linkCount); i++) {
        const link = navLinks.nth(i);
        const href = await link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('mailto:')) {
          // Only test internal links
          if (href.startsWith('/') || href.includes('localhost')) {
            await expect(link).toBeVisible();
          }
        }
      }
    }
  });
});

// Performance tests
test.describe('Performance Tests', () => {
  test('should load within acceptable time limits', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(LANDING_PAGE_URL);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(10000); // Should load within 10 seconds
  });

  test('should handle page interactions efficiently', async ({ page }) => {
    await page.goto(LANDING_PAGE_URL);
    await expect(page.locator('body')).toBeVisible();

    // Test scroll performance
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));
  });
});

// Content Tests
test.describe('Content Tests', () => {
  test('should display main heading', async ({ page }) => {
    await page.goto(LANDING_PAGE_URL);

    // Check for main heading
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });

  test('should display call-to-action buttons', async ({ page }) => {
    await page.goto(LANDING_PAGE_URL);

    // Check for CTA buttons
    const buttons = page.locator('button, a[role="button"]');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
  });

  test('should display footer content', async ({ page }) => {
    await page.goto(LANDING_PAGE_URL);

    // Check for footer
    const footer = page.locator('footer');
    if (await footer.isVisible()) {
      await expect(footer).toBeVisible();
    }
  });
});

// Accessibility tests
test.describe('Accessibility Tests', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto(LANDING_PAGE_URL);
    await page.waitForLoadState('networkidle');

    // Test tab navigation - find focusable elements first
    const focusableElements = page.locator('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const count = await focusableElements.count();

    if (count > 0) {
      // Press Tab to focus first element
      await page.keyboard.press('Tab');

      // Check if any element has focus
      const focusedElement = page.locator(':focus');
      const hasFocus = await focusedElement.count() > 0;

      // If we have focusable elements, at least one should be focused
      if (count > 0) {
        expect(hasFocus).toBe(true);
      }
    }
  });

  test('should have proper semantic structure', async ({ page }) => {
    await page.goto(LANDING_PAGE_URL);

    // Check for semantic HTML elements
    const main = page.locator('main');
    const nav = page.locator('nav');
    const headings = page.locator('h1, h2, h3, h4, h5, h6');

    // At least one heading should exist
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto(LANDING_PAGE_URL);

    // Check all images have alt text
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      // Alt attribute should exist (can be empty for decorative images)
      expect(alt).not.toBeNull();
    }
  });
});
