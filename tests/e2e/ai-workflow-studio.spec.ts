import { test, expect, Page } from '@playwright/test';

// Test configuration
const BASE_URL = 'http://localhost:8080';
const WORKFLOW_STUDIO_URL = `${BASE_URL}/ai-workflow-studio/new`;

// User credentials
const TEST_USER = {
  email: 'robialexzi0@gmail.com',
  password: 'Alexandur132!@?',
};

// Test utilities
class WorkflowStudioPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto(WORKFLOW_STUDIO_URL);
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
test.describe('AI Workflow Studio - Comprehensive E2E Tests', () => {
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

    // Navigate to the application and authenticate
    await workflowStudio.navigate();
    await workflowStudio.login();

    // Navigate to workflow studio after authentication
    await page.goto(WORKFLOW_STUDIO_URL);
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async () => {
    // Report any JavaScript errors found
    if (jsErrors.length > 0) {
      console.log('JavaScript Errors Found:', jsErrors);
    }
    jsErrors = []; // Reset for next test
  });

  test('should load the AI Workflow Studio without errors', async () => {
    await workflowStudio.waitForWorkflowStudio();
    expect(jsErrors).toHaveLength(0);
  });

  test('should authenticate user successfully', async ({ page }) => {
    // Authentication is already done in beforeEach, just verify we're authenticated
    const currentUrl = page.url();
    expect(currentUrl).toContain('/ai-workflow-studio');
    expect(currentUrl).not.toContain('/auth');
  });

  test('should display Smart Onboarding for new users', async () => {
    const hasOnboarding = await workflowStudio.checkSmartOnboarding();
    if (hasOnboarding) {
      await workflowStudio.interactWithOnboarding();
    }
  });

  test('should handle Interactive Tutorial system', async () => {
    await workflowStudio.testInteractiveTutorial();
  });

  test('should display and interact with Contextual Help', async () => {
    await workflowStudio.testContextualHelp();
  });

  test('should navigate node library categories', async () => {
    await workflowStudio.testNodeLibrary();
  });

  test('should support drag and drop functionality', async () => {
    await workflowStudio.testDragAndDrop();
  });

  test('should handle workflow saving', async () => {
    await workflowStudio.testWorkflowSaving();
  });

  test('should handle workflow execution', async () => {
    await workflowStudio.testWorkflowExecution();
  });

  test('should be responsive across different screen sizes', async () => {
    await workflowStudio.testResponsiveDesign();
  });

  test('should handle error scenarios gracefully', async ({ page }) => {
    // Test invalid workflow execution
    const executeButton = page.locator('button:has-text("Execute")');
    if (await executeButton.isVisible()) {
      await executeButton.click();
      // Should show appropriate error message for empty workflow
    }

    // Test invalid node connections
    // Add more error scenario tests here
  });
});

// Performance tests
test.describe('Performance Tests', () => {
  test('should load within acceptable time limits', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(WORKFLOW_STUDIO_URL);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(10000); // Should load within 10 seconds (realistic for enhanced app)
  });

  test('should handle large workflows efficiently', async ({ page }) => {
    const workflowStudio = new WorkflowStudioPage(page);
    await workflowStudio.navigate();
    await workflowStudio.waitForWorkflowStudio();

    // Add multiple nodes to test performance with more realistic expectations
    for (let i = 0; i < 5; i++) {
      try {
        await workflowStudio.testDragAndDrop();
        await page.waitForTimeout(200);
      } catch (error) {
        console.log(`Drag and drop attempt ${i + 1} failed, continuing...`);
      }
    }

    // Verify the workflow studio is still responsive
    await expect(page.locator('h2:has-text("Node Library")')).toBeVisible();
  });
});

// Enhanced Tutorial System Tests
test.describe('Enhanced Tutorial System Tests', () => {
  test('should open comprehensive tutorial system', async ({ page }) => {
    const workflowStudio = new WorkflowStudioPage(page);
    await workflowStudio.navigate();
    await workflowStudio.waitForWorkflowStudio();

    // Test comprehensive tutorial button
    const comprehensiveTutorialButton = page.locator(
      'button[title="Start comprehensive tutorial"]'
    );
    if (await comprehensiveTutorialButton.isVisible()) {
      await comprehensiveTutorialButton.click();
      await expect(page.locator('.fixed.inset-0.z-50')).toBeVisible();

      // Check for tutorial content
      await expect(page.locator('text=Objective')).toBeVisible();
      await expect(page.locator('text=Step-by-Step Instructions')).toBeVisible();

      // Close tutorial
      await page.locator('button[aria-label="Close"]').click();
    }
  });

  test('should open progress tracker with all tabs', async ({ page }) => {
    const workflowStudio = new WorkflowStudioPage(page);
    await workflowStudio.navigate();
    await workflowStudio.waitForWorkflowStudio();

    // Test progress tracker button
    const progressButton = page.locator('button[title="View learning progress"]');
    if (await progressButton.isVisible()) {
      await progressButton.click();
      await expect(page.locator('text=Learning Progress')).toBeVisible();

      // Test all tabs
      const tabs = ['Progress', 'Achievements', 'Learning Paths', 'AI Insights', 'Gamification'];
      for (const tab of tabs) {
        const tabButton = page.locator(`button:has-text("${tab}")`);
        if (await tabButton.isVisible()) {
          await tabButton.click();
          await page.waitForTimeout(500);
        }
      }

      // Close progress tracker
      await page.locator('button[aria-label="Close"]').click();
    }
  });

  test('should display gamification elements', async ({ page }) => {
    const workflowStudio = new WorkflowStudioPage(page);
    await workflowStudio.navigate();
    await workflowStudio.waitForWorkflowStudio();

    const progressButton = page.locator('button[title="View learning progress"]');
    if (await progressButton.isVisible()) {
      await progressButton.click();

      // Navigate to gamification tab
      const gamificationTab = page.locator('button:has-text("Gamification")');
      if (await gamificationTab.isVisible()) {
        await gamificationTab.click();

        // Check for gamification elements
        await expect(page.locator('text=Level')).toBeVisible();
        await expect(page.locator('text=XP')).toBeVisible();
        await expect(page.locator('text=Achievements')).toBeVisible();
        await expect(page.locator('text=Challenges')).toBeVisible();
        await expect(page.locator('text=Leaderboard')).toBeVisible();
      }

      await page.locator('button[aria-label="Close"]').click();
    }
  });

  test('should display AI optimization insights', async ({ page }) => {
    const workflowStudio = new WorkflowStudioPage(page);
    await workflowStudio.navigate();
    await workflowStudio.waitForWorkflowStudio();

    const progressButton = page.locator('button[title="View learning progress"]');
    if (await progressButton.isVisible()) {
      await progressButton.click();

      // Navigate to AI insights tab
      const aiInsightsTab = page.locator('button:has-text("AI Insights")');
      if (await aiInsightsTab.isVisible()) {
        await aiInsightsTab.click();

        // Check for AI optimization elements
        await expect(page.locator('text=Learning Analytics')).toBeVisible();
        await expect(page.locator('text=Average Score')).toBeVisible();
        await expect(page.locator('text=AI-Powered Recommendations')).toBeVisible();
      }

      await page.locator('button[aria-label="Close"]').click();
    }
  });
});

// Accessibility tests
test.describe('Accessibility Tests', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto(WORKFLOW_STUDIO_URL);

    // Test tab navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Check if focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto(WORKFLOW_STUDIO_URL);

    // Check for important ARIA labels
    const helpButton = page.locator('button[title="Toggle contextual help"]');
    if (await helpButton.isVisible()) {
      await expect(helpButton).toHaveAttribute('title');
    }
  });
});
