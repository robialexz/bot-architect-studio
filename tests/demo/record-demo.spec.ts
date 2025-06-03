import { test, expect, Page } from '@playwright/test';

// Demo recording configuration
const DEMO_CONFIG = {
  baseUrl: 'http://localhost:8080',
  videoPath: 'demo-videos',
  duration: 180000, // 3 minutes
  credentials: {
    email: 'robialexzi0@gmail.com',
    password: 'Alexandur132!@?',
  },
};

class DemoRecorder {
  constructor(private page: Page) {}

  async setupRecording() {
    // Set viewport for professional recording
    await this.page.setViewportSize({ width: 1920, height: 1080 });

    // Add custom CSS for demo highlights
    await this.page.addStyleTag({
      content: `
        .demo-highlight {
          animation: pulse 2s infinite;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.8) !important;
          border: 2px solid #FFD700 !important;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
          50% { box-shadow: 0 0 30px rgba(255, 215, 0, 1); }
          100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
        }

        .demo-tooltip {
          position: fixed;
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          z-index: 10000;
          pointer-events: none;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
      `,
    });
  }

  async addTooltip(text: string, x: number, y: number, duration: number = 3000) {
    await this.page.evaluate(
      ({ text, x, y, duration }) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'demo-tooltip';
        tooltip.textContent = text;
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
        document.body.appendChild(tooltip);

        setTimeout(() => {
          if (tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
          }
        }, duration);
      },
      { text, x, y, duration }
    );

    await this.page.waitForTimeout(duration);
  }

  async highlightElement(selector: string, duration: number = 2000) {
    await this.page.evaluate(selector => {
      const element = document.querySelector(selector);
      if (element) {
        element.classList.add('demo-highlight');
      }
    }, selector);

    await this.page.waitForTimeout(duration);

    await this.page.evaluate(selector => {
      const element = document.querySelector(selector);
      if (element) {
        element.classList.remove('demo-highlight');
      }
    }, selector);
  }

  async smoothScroll(selector: string) {
    await this.page.evaluate(selector => {
      const element = document.querySelector(selector);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, selector);
    await this.page.waitForTimeout(1000);
  }

  async typeWithDelay(selector: string, text: string, delay: number = 100) {
    await this.page.click(selector);
    await this.page.waitForTimeout(500);

    for (const char of text) {
      await this.page.keyboard.type(char);
      await this.page.waitForTimeout(delay);
    }
  }

  async authenticateUser() {
    await this.page.goto(`${DEMO_CONFIG.baseUrl}/ai-workflow-studio/new`);
    await this.page.waitForLoadState('networkidle');

    // Check if we need to authenticate
    const isLoginPage = await this.page
      .locator('text=Sign in to your')
      .isVisible({ timeout: 3000 });

    if (isLoginPage) {
      await this.addTooltip('🔐 Authenticating with AI Workflow Studio', 960, 100);

      // Fill email
      await this.page.fill('input[type="email"]', DEMO_CONFIG.credentials.email);
      await this.page.waitForTimeout(500);

      // Fill password
      await this.page.fill('input[type="password"]', DEMO_CONFIG.credentials.password);
      await this.page.waitForTimeout(500);

      // Click sign in
      await this.page.click('button:has-text("Sign In")');
      await this.page.waitForLoadState('networkidle');

      // Wait for redirect
      await this.page.waitForFunction(() => !window.location.pathname.includes('/auth'), {
        timeout: 10000,
      });
    }
  }

  async waitForWorkflowStudio() {
    // Wait for the main components to load
    await this.page.waitForLoadState('networkidle');
    await expect(this.page.locator('h2:has-text("Node Library")')).toBeVisible({ timeout: 15000 });
    await this.page.waitForTimeout(2000);
  }
}

test.describe('AI Workflow Studio - Professional Demo Recording', () => {
  test('Record comprehensive demo video', async ({ page }) => {
    const recorder = new DemoRecorder(page);

    // Setup recording environment
    await recorder.setupRecording();

    // === SCENE 1: INTRODUCTION ===
    await recorder.addTooltip(
      '🚀 Welcome to AI Workflow Studio - The Future of AI Automation',
      960,
      100,
      4000
    );

    // Authenticate and navigate to studio
    await recorder.authenticateUser();
    await recorder.waitForWorkflowStudio();

    // === SCENE 2: INTERFACE OVERVIEW ===
    await recorder.addTooltip('🎯 Revolutionary AI-Powered Tutorial System', 960, 100, 3000);

    // Highlight node library
    await recorder.highlightElement('.w-80.border-r');
    await recorder.addTooltip(
      '📚 Comprehensive Node Library with AI Models, Data Processing, and Integrations',
      400,
      300,
      4000
    );

    // Highlight canvas
    await recorder.highlightElement('.flex-1.relative');
    await recorder.addTooltip(
      '🎨 Intelligent Workflow Canvas with Real-time Validation',
      960,
      400,
      3000
    );

    // === SCENE 3: TUTORIAL SYSTEM DEMO ===
    await recorder.addTooltip('🎓 Industry-First AI-Powered Tutorial System', 960, 100, 3000);

    // Open comprehensive tutorial
    const tutorialButton = page.locator('button[title="Start comprehensive tutorial"]');
    if (await tutorialButton.isVisible({ timeout: 2000 })) {
      await recorder.highlightElement('button[title="Start comprehensive tutorial"]');
      await tutorialButton.click();
      await page.waitForTimeout(2000);

      await recorder.addTooltip(
        '✨ Step-by-step guidance with real-time validation',
        960,
        200,
        3000
      );

      // Close tutorial
      await page.locator('button[aria-label="Close"]').click();
      await page.waitForTimeout(1000);
    }

    // === SCENE 4: PROGRESS TRACKING ===
    await recorder.addTooltip('📊 Advanced Progress Tracking & Gamification', 960, 100, 3000);

    // Open progress tracker
    const progressButton = page.locator('button[title="View learning progress"]');
    if (await progressButton.isVisible({ timeout: 2000 })) {
      await recorder.highlightElement('button[title="View learning progress"]');
      await progressButton.click();
      await page.waitForTimeout(2000);

      await recorder.addTooltip(
        '🏆 Enterprise-grade gamification with achievements and leaderboards',
        960,
        200,
        4000
      );

      // Navigate through tabs
      const tabs = ['Achievements', 'Learning Paths', 'AI Insights', 'Gamification'];
      for (const tab of tabs) {
        const tabButton = page.locator(`button:has-text("${tab}")`);
        if (await tabButton.isVisible({ timeout: 1000 })) {
          await tabButton.click();
          await page.waitForTimeout(1500);
          await recorder.addTooltip(`📈 ${tab} - Personalized learning experience`, 960, 300, 2000);
        }
      }

      // Close progress tracker
      await page.locator('button[aria-label="Close"]').click();
      await page.waitForTimeout(1000);
    }

    // === SCENE 5: WORKFLOW BUILDING ===
    await recorder.addTooltip('🔧 Build Your First AI Workflow', 960, 100, 3000);

    // Try to interact with node categories
    const categories = ['AI', 'Data', 'Apps', 'Triggers'];
    for (const category of categories) {
      const categoryButton = page.locator(`button:has-text("${category}")`).first();
      if (await categoryButton.isVisible({ timeout: 1000 })) {
        await recorder.highlightElement(`button:has-text("${category}")`);
        await categoryButton.click();
        await page.waitForTimeout(1000);
        await recorder.addTooltip(
          `🎯 ${category} Components - Industry-leading AI models`,
          400,
          400,
          2000
        );
      }
    }

    // === SCENE 6: COMPETITIVE ADVANTAGES ===
    await recorder.addTooltip('💎 Why AI Workflow Studio Leads the Industry', 960, 100, 4000);

    const advantages = [
      '🧠 First AI-powered tutorial system in the industry',
      '🎮 Enterprise-grade gamification with real achievements',
      '📊 Advanced analytics with 15+ performance metrics',
      '🎬 Automated demo video infrastructure',
      '🔧 80%+ test coverage with enterprise quality',
    ];

    for (let i = 0; i < advantages.length; i++) {
      await recorder.addTooltip(advantages[i], 960, 200 + i * 50, 3000);
    }

    // === SCENE 7: CONCLUSION ===
    await recorder.addTooltip('🚀 Ready to revolutionize your AI automation?', 960, 100, 3000);
    await recorder.addTooltip('✨ Start your free trial today!', 960, 150, 3000);

    // Final highlight of the entire interface
    await recorder.highlightElement('body', 2000);

    console.log('✅ Demo recording completed successfully!');
    console.log('📹 Video saved to test-results directory');
    console.log('🎬 Duration: ~3 minutes of professional AI Workflow Studio showcase');
  });
});
