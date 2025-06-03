import { Page } from '@playwright/test';

// Import NodeCategory enum for correct selectors
enum NodeCategory {
  AI_MODELS = 'ai-models',
  DATA_PROCESSING = 'data-processing',
  INTEGRATIONS = 'integrations',
  TRIGGERS = 'triggers',
}

export interface DemoStep {
  id: string;
  title: string;
  description: string;
  duration: number; // seconds
  actions: DemoAction[];
  narration: {
    english: string;
    romanian: string;
  };
  visualEffects?: VisualEffect[];
}

export interface DemoAction {
  type: 'navigate' | 'click' | 'drag' | 'type' | 'wait' | 'highlight' | 'zoom' | 'scroll';
  selector?: string;
  text?: string;
  coordinates?: { x: number; y: number };
  duration?: number;
  optional?: boolean;
  options?: Record<string, unknown>;
}

export interface VisualEffect {
  type: 'highlight' | 'zoom' | 'annotation' | 'overlay';
  selector?: string;
  text?: string;
  style?: Record<string, string | number>;
  duration?: number;
}

export class AutomatedDemoRecorder {
  private page: Page;
  private isRecording: boolean = false;
  private currentStep: number = 0;
  private recordingData: Array<{
    timestamp: number;
    step: string;
    title: string;
    narration: { english: string; romanian: string };
  }> = [];

  constructor(page: Page) {
    this.page = page;
  }

  async startRecording(): Promise<void> {
    this.isRecording = true;
    this.currentStep = 0;
    this.recordingData = [];

    // Set up high-quality recording
    await this.page.setViewportSize({ width: 1920, height: 1080 });

    // Start screen recording
    await this.page.video()?.path();

    console.log('🎬 Demo recording started...');
  }

  async executeDemo(steps: DemoStep[]): Promise<void> {
    if (!this.isRecording) {
      throw new Error('Recording not started. Call startRecording() first.');
    }

    for (const step of steps) {
      await this.executeStep(step);
      this.currentStep++;
    }
  }

  private async executeStep(step: DemoStep): Promise<void> {
    console.log(`🎯 Executing step: ${step.title}`);

    // Add step marker for editing
    this.recordingData.push({
      timestamp: Date.now(),
      step: step.id,
      title: step.title,
      narration: step.narration,
    });

    // Execute visual effects first
    if (step.visualEffects) {
      for (const effect of step.visualEffects) {
        await this.applyVisualEffect(effect);
      }
    }

    // Execute actions
    for (const action of step.actions) {
      await this.executeAction(action);
    }

    // Wait for step duration
    await this.page.waitForTimeout(step.duration * 1000);
  }

  private async executeAction(action: DemoAction): Promise<void> {
    switch (action.type) {
      case 'navigate':
        await this.page.goto(action.text!);
        await this.page.waitForLoadState('networkidle');
        break;

      case 'click':
        if (action.selector) {
          try {
            await this.highlightElement(action.selector);
            await this.page.click(action.selector, { timeout: action.optional ? 5000 : 30000 });
          } catch (error) {
            if (action.optional) {
              console.log(`⚠️ Optional action skipped: ${action.selector} - ${error.message}`);
              return;
            }
            throw error;
          }
        } else if (action.coordinates) {
          await this.page.mouse.click(action.coordinates.x, action.coordinates.y);
        }
        break;

      case 'drag':
        if (action.selector && action.coordinates) {
          const element = await this.page.locator(action.selector);
          const box = await element.boundingBox();
          if (box) {
            await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            await this.page.mouse.down();
            await this.page.mouse.move(action.coordinates.x, action.coordinates.y, { steps: 20 });
            await this.page.mouse.up();
          }
        }
        break;

      case 'type':
        if (action.selector && action.text) {
          await this.page.fill(action.selector, action.text);
        }
        break;

      case 'wait':
        await this.page.waitForTimeout(action.duration || 1000);
        break;

      case 'highlight':
        if (action.selector) {
          try {
            await this.highlightElement(action.selector, action.duration || 2000);
          } catch (error) {
            if (action.optional) {
              console.log(`⚠️ Optional highlight skipped: ${action.selector} - ${error.message}`);
              return;
            }
            throw error;
          }
        }
        break;

      case 'zoom':
        if (action.selector) {
          await this.zoomToElement(action.selector);
        }
        break;

      case 'scroll':
        if (action.selector) {
          await this.page.locator(action.selector).scrollIntoViewIfNeeded();
        } else if (action.coordinates) {
          await this.page.mouse.wheel(0, action.coordinates.y);
        }
        break;
    }

    // Small delay between actions for natural feel
    await this.page.waitForTimeout(300);
  }

  private async applyVisualEffect(effect: VisualEffect): Promise<void> {
    switch (effect.type) {
      case 'highlight':
        if (effect.selector) {
          await this.highlightElement(effect.selector, effect.duration);
        }
        break;

      case 'zoom':
        if (effect.selector) {
          await this.zoomToElement(effect.selector);
        }
        break;

      case 'annotation':
        if (effect.selector && effect.text) {
          await this.addAnnotation(effect.selector, effect.text);
        }
        break;

      case 'overlay':
        await this.addOverlay(effect.text || '', effect.style);
        break;
    }
  }

  private async highlightElement(selector: string, duration: number = 2000): Promise<void> {
    await this.page.evaluate(
      ({ selector, duration }) => {
        const element = document.querySelector(selector);
        if (element) {
          const highlight = document.createElement('div');
          highlight.style.cssText = `
            position: absolute;
            border: 3px solid #3B82F6;
            border-radius: 8px;
            pointer-events: none;
            z-index: 10000;
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
            animation: pulse 1s infinite;
          `;

          const rect = element.getBoundingClientRect();
          highlight.style.left = `${rect.left - 5}px`;
          highlight.style.top = `${rect.top - 5}px`;
          highlight.style.width = `${rect.width + 10}px`;
          highlight.style.height = `${rect.height + 10}px`;

          document.body.appendChild(highlight);

          setTimeout(() => {
            if (highlight.parentNode) {
              highlight.parentNode.removeChild(highlight);
            }
          }, duration);
        }
      },
      { selector, duration }
    );
  }

  private async zoomToElement(selector: string): Promise<void> {
    const element = await this.page.locator(selector);
    const box = await element.boundingBox();

    if (box) {
      // Smooth zoom animation
      await this.page.evaluate(({ x, y, width, height }) => {
        const scale = Math.min(
          window.innerWidth / (width * 1.5),
          window.innerHeight / (height * 1.5)
        );
        const centerX = x + width / 2;
        const centerY = y + height / 2;

        document.body.style.transform = `scale(${scale}) translate(${
          (window.innerWidth / 2 - centerX) / scale
        }px, ${(window.innerHeight / 2 - centerY) / scale}px)`;
        document.body.style.transformOrigin = '0 0';
        document.body.style.transition = 'transform 1s ease-in-out';
      }, box);

      await this.page.waitForTimeout(1500);

      // Reset zoom
      await this.page.evaluate(() => {
        document.body.style.transform = '';
        document.body.style.transition = '';
      });
    }
  }

  private async addAnnotation(selector: string, text: string): Promise<void> {
    await this.page.evaluate(
      ({ selector, text }) => {
        const element = document.querySelector(selector);
        if (element) {
          const annotation = document.createElement('div');
          annotation.textContent = text;
          annotation.style.cssText = `
            position: absolute;
            background: #1E293B;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10001;
            pointer-events: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          `;

          const rect = element.getBoundingClientRect();
          annotation.style.left = `${rect.right + 10}px`;
          annotation.style.top = `${rect.top}px`;

          document.body.appendChild(annotation);

          setTimeout(() => {
            if (annotation.parentNode) {
              annotation.parentNode.removeChild(annotation);
            }
          }, 3000);
        }
      },
      { selector, text }
    );
  }

  private async addOverlay(text: string, style?: Record<string, string | number>): Promise<void> {
    await this.page.evaluate(
      ({ text, style }) => {
        const overlay = document.createElement('div');
        overlay.textContent = text;
        overlay.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 20px 40px;
          border-radius: 12px;
          font-size: 24px;
          font-weight: 600;
          z-index: 10002;
          text-align: center;
          ${
            style
              ? Object.entries(style)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join('; ')
              : ''
          }
        `;

        document.body.appendChild(overlay);

        setTimeout(() => {
          if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
        }, 2000);
      },
      { text, style }
    );
  }

  async stopRecording(): Promise<string> {
    this.isRecording = false;

    const videoPath = await this.page.video()?.path();

    // Save recording metadata
    const metadata = {
      duration: Date.now() - this.recordingData[0]?.timestamp,
      steps: this.recordingData,
      totalSteps: this.currentStep,
      recordingDate: new Date().toISOString(),
    };

    console.log('🎬 Demo recording completed!');
    console.log(`📁 Video saved to: ${videoPath}`);
    console.log(`📊 Metadata:`, metadata);

    return videoPath || '';
  }
}

// Demo steps configuration
export const demoSteps: DemoStep[] = [
  {
    id: 'intro',
    title: 'Welcome to AI Workflow Studio',
    description: 'Show the main interface and value proposition',
    duration: 5,
    actions: [
      { type: 'navigate', text: 'http://localhost:8080/workflow-builder' },
      { type: 'wait', duration: 2000 },
    ],
    narration: {
      english: 'Meet AI Workflow Studio - the most advanced no-code AI automation platform.',
      romanian:
        'Întâlnește AI Workflow Studio - cea mai avansată platformă de automatizare AI fără cod.',
    },
    visualEffects: [{ type: 'overlay', text: 'AI Workflow Studio', duration: 3000 }],
  },
  {
    id: 'drag_drop_demo',
    title: 'Drag and Drop Interface',
    description: 'Demonstrate the intuitive workflow creation',
    duration: 15,
    actions: [
      { type: 'highlight', selector: '.w-80.border-r' },
      { type: 'click', selector: `button[value="${NodeCategory.TRIGGERS}"]` },
      { type: 'wait', duration: 1000 },
      { type: 'drag', selector: '.cursor-grab', coordinates: { x: 600, y: 300 } },
      { type: 'wait', duration: 1000 },
      { type: 'click', selector: `button[value="${NodeCategory.AI_MODELS}"]` },
      { type: 'wait', duration: 1000 },
      { type: 'drag', selector: '.cursor-grab', coordinates: { x: 800, y: 300 } },
      { type: 'wait', duration: 2000 },
    ],
    narration: {
      english: 'Simply drag nodes from our library and connect them to build powerful workflows.',
      romanian:
        'Pur și simplu trage nodurile din biblioteca noastră și conectează-le pentru a construi fluxuri de lucru puternice.',
    },
    visualEffects: [{ type: 'annotation', selector: '.cursor-grab', text: 'Drag any node' }],
  },
  {
    id: 'tutorial_system',
    title: 'Comprehensive Tutorial System',
    description: 'Show the new interactive tutorial features',
    duration: 10,
    actions: [
      { type: 'click', selector: 'button[title="Start comprehensive tutorial"]' },
      { type: 'wait', duration: 2000 },
      { type: 'highlight', selector: '.fixed.inset-0.z-50' },
      { type: 'wait', duration: 3000 },
      { type: 'click', selector: 'button:has-text("Next")' },
      { type: 'wait', duration: 2000 },
      { type: 'click', selector: 'button[aria-label="Close"]' },
    ],
    narration: {
      english:
        'Our comprehensive tutorial system guides you through every step of workflow creation.',
      romanian:
        'Sistemul nostru comprehensiv de tutorial te ghidează prin fiecare pas al creării fluxurilor de lucru.',
    },
  },
  {
    id: 'execution_demo',
    title: 'Real-time Execution',
    description: 'Show workflow execution and results',
    duration: 8,
    actions: [
      { type: 'click', selector: 'button:has-text("Execute")' },
      { type: 'wait', duration: 3000 },
      { type: 'highlight', selector: '.bg-green-50' },
      { type: 'wait', duration: 2000 },
    ],
    narration: {
      english: 'Execute workflows instantly and see real-time results with detailed analytics.',
      romanian:
        'Execută fluxurile de lucru instantaneu și vezi rezultate în timp real cu analize detaliate.',
    },
  },
  {
    id: 'call_to_action',
    title: 'Get Started Today',
    description: 'Final call to action',
    duration: 5,
    actions: [{ type: 'wait', duration: 2000 }],
    narration: {
      english: 'Ready to revolutionize your business with AI? Start your free trial today!',
      romanian:
        'Gata să-ți revoluționezi afacerea cu AI? Începe perioada de probă gratuită astăzi!',
    },
    visualEffects: [{ type: 'overlay', text: 'Start Free Trial', duration: 3000 }],
  },
];

// Usage example
export async function recordDemo(page: Page): Promise<string> {
  const recorder = new AutomatedDemoRecorder(page);

  await recorder.startRecording();
  await recorder.executeDemo(demoSteps);
  const videoPath = await recorder.stopRecording();

  return videoPath;
}
