# Test info

- Name: AI Workflow Studio Demo Recording >> Record complete demo video
- Location: C:\Users\robia\Desktop\AiFlow\tests\e2e\record-demo.spec.ts:20:3

# Error details

```
TimeoutError: page.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('button[value="triggers"]')

    at AutomatedDemoRecorder.executeAction (C:\Users\robia\Desktop\AiFlow\demo-video\automated-demo-recorder.ts:120:29)
    at AutomatedDemoRecorder.executeStep (C:\Users\robia\Desktop\AiFlow\demo-video\automated-demo-recorder.ts:102:7)
    at AutomatedDemoRecorder.executeDemo (C:\Users\robia\Desktop\AiFlow\demo-video\automated-demo-recorder.ts:77:7)
    at recordDemo (C:\Users\robia\Desktop\AiFlow\demo-video\automated-demo-recorder.ts:473:3)
    at C:\Users\robia\Desktop\AiFlow\tests\e2e\record-demo.spec.ts:24:23
```

# Page snapshot

```yaml
- region "Notifications (F8)":
    - list
- region "Notifications alt+T"
- navigation:
    - button "Navigate to home page":
        - img
        - text: AI Flow
    - navigation "Main":
        - list:
            - listitem:
                - link "Platform":
                    - /url: /platform-showcase
            - listitem:
                - link "Templates":
                    - /url: /workflow-templates
            - listitem:
                - link "Pricing":
                    - /url: /pricing
            - listitem:
                - link "Features":
                    - /url: /features
            - listitem:
                - link "Documentation":
                    - /url: /documentation
    - button "Login":
        - img
        - text: Login
    - button "Start Free Trial":
        - img
        - text: Start Free Trial
- main:
    - img
    - heading "Welcome Back" [level=1]
    - paragraph: Sign in to your Bot Architect Studio account
    - button "Sign In":
        - img
        - text: Sign In
    - button "Sign Up":
        - img
        - text: Sign Up
    - text: Email Address
    - img
    - textbox "Email Address"
    - text: Password
    - img
    - textbox "Password"
    - button:
        - img
    - button "Sign In":
        - img
        - text: Sign In
        - img
    - link "Forgot your password?":
        - /url: /auth#/forgot-password
    - paragraph:
        - text: By signing in, you agree to our
        - link "Terms of Service":
            - /url: /terms
        - text: and
        - link "Privacy Policy":
            - /url: /privacy
- contentinfo:
    - button "AI Flow":
        - img
        - text: AI Flow
    - paragraph: Seamlessly integrate advanced AI to automate and innovate.
    - heading "Platform" [level=4]
    - list:
        - listitem:
            - link "Features":
                - /url: /
        - listitem:
            - link "Templates":
                - /url: /templates
        - listitem:
            - link "Pricing":
                - /url: /pricing
        - listitem:
            - link "My Agents":
                - /url: /my-agents
    - heading "Resources" [level=4]
    - list:
        - listitem:
            - link "Documentation":
                - /url: /documentation
        - listitem:
            - link "Tutorials":
                - /url: /tutorials
        - listitem:
            - link "Community":
                - /url: /community
    - heading "Company" [level=4]
    - list:
        - listitem:
            - link "About Us":
                - /url: /about
        - listitem:
            - link "Contact":
                - /url: /contact
        - listitem:
            - link "Privacy Policy":
                - /url: /privacy
        - listitem:
            - link "Terms of Service":
                - /url: /terms
    - paragraph: © 2025 AI Flow Inc. All rights reserved.
    - link "Telegram":
        - /url: '#telegram'
        - img
    - link "X (Twitter)":
        - /url: '#twitter'
        - img
    - link "GitHub":
        - /url: '#github'
        - img
```

# Test source

```ts
   20 |   };
   21 |   visualEffects?: VisualEffect[];
   22 | }
   23 |
   24 | export interface DemoAction {
   25 |   type: 'navigate' | 'click' | 'drag' | 'type' | 'wait' | 'highlight' | 'zoom' | 'scroll';
   26 |   selector?: string;
   27 |   text?: string;
   28 |   coordinates?: { x: number; y: number };
   29 |   duration?: number;
   30 |   optional?: boolean;
   31 |   options?: Record<string, unknown>;
   32 | }
   33 |
   34 | export interface VisualEffect {
   35 |   type: 'highlight' | 'zoom' | 'annotation' | 'overlay';
   36 |   selector?: string;
   37 |   text?: string;
   38 |   style?: Record<string, string | number>;
   39 |   duration?: number;
   40 | }
   41 |
   42 | export class AutomatedDemoRecorder {
   43 |   private page: Page;
   44 |   private isRecording: boolean = false;
   45 |   private currentStep: number = 0;
   46 |   private recordingData: Array<{
   47 |     timestamp: number;
   48 |     step: string;
   49 |     title: string;
   50 |     narration: { english: string; romanian: string };
   51 |   }> = [];
   52 |
   53 |   constructor(page: Page) {
   54 |     this.page = page;
   55 |   }
   56 |
   57 |   async startRecording(): Promise<void> {
   58 |     this.isRecording = true;
   59 |     this.currentStep = 0;
   60 |     this.recordingData = [];
   61 |
   62 |     // Set up high-quality recording
   63 |     await this.page.setViewportSize({ width: 1920, height: 1080 });
   64 |
   65 |     // Start screen recording
   66 |     await this.page.video()?.path();
   67 |
   68 |     console.log('🎬 Demo recording started...');
   69 |   }
   70 |
   71 |   async executeDemo(steps: DemoStep[]): Promise<void> {
   72 |     if (!this.isRecording) {
   73 |       throw new Error('Recording not started. Call startRecording() first.');
   74 |     }
   75 |
   76 |     for (const step of steps) {
   77 |       await this.executeStep(step);
   78 |       this.currentStep++;
   79 |     }
   80 |   }
   81 |
   82 |   private async executeStep(step: DemoStep): Promise<void> {
   83 |     console.log(`🎯 Executing step: ${step.title}`);
   84 |
   85 |     // Add step marker for editing
   86 |     this.recordingData.push({
   87 |       timestamp: Date.now(),
   88 |       step: step.id,
   89 |       title: step.title,
   90 |       narration: step.narration
   91 |     });
   92 |
   93 |     // Execute visual effects first
   94 |     if (step.visualEffects) {
   95 |       for (const effect of step.visualEffects) {
   96 |         await this.applyVisualEffect(effect);
   97 |       }
   98 |     }
   99 |
  100 |     // Execute actions
  101 |     for (const action of step.actions) {
  102 |       await this.executeAction(action);
  103 |     }
  104 |
  105 |     // Wait for step duration
  106 |     await this.page.waitForTimeout(step.duration * 1000);
  107 |   }
  108 |
  109 |   private async executeAction(action: DemoAction): Promise<void> {
  110 |     switch (action.type) {
  111 |       case 'navigate':
  112 |         await this.page.goto(action.text!);
  113 |         await this.page.waitForLoadState('networkidle');
  114 |         break;
  115 |
  116 |       case 'click':
  117 |         if (action.selector) {
  118 |           try {
  119 |             await this.highlightElement(action.selector);
> 120 |             await this.page.click(action.selector, { timeout: action.optional ? 5000 : 30000 });
      |                             ^ TimeoutError: page.click: Timeout 30000ms exceeded.
  121 |           } catch (error) {
  122 |             if (action.optional) {
  123 |               console.log(`⚠️ Optional action skipped: ${action.selector} - ${error.message}`);
  124 |               return;
  125 |             }
  126 |             throw error;
  127 |           }
  128 |         } else if (action.coordinates) {
  129 |           await this.page.mouse.click(action.coordinates.x, action.coordinates.y);
  130 |         }
  131 |         break;
  132 |
  133 |       case 'drag':
  134 |         if (action.selector && action.coordinates) {
  135 |           const element = await this.page.locator(action.selector);
  136 |           const box = await element.boundingBox();
  137 |           if (box) {
  138 |             await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  139 |             await this.page.mouse.down();
  140 |             await this.page.mouse.move(action.coordinates.x, action.coordinates.y, { steps: 20 });
  141 |             await this.page.mouse.up();
  142 |           }
  143 |         }
  144 |         break;
  145 |
  146 |       case 'type':
  147 |         if (action.selector && action.text) {
  148 |           await this.page.fill(action.selector, action.text);
  149 |         }
  150 |         break;
  151 |
  152 |       case 'wait':
  153 |         await this.page.waitForTimeout(action.duration || 1000);
  154 |         break;
  155 |
  156 |       case 'highlight':
  157 |         if (action.selector) {
  158 |           try {
  159 |             await this.highlightElement(action.selector, action.duration || 2000);
  160 |           } catch (error) {
  161 |             if (action.optional) {
  162 |               console.log(`⚠️ Optional highlight skipped: ${action.selector} - ${error.message}`);
  163 |               return;
  164 |             }
  165 |             throw error;
  166 |           }
  167 |         }
  168 |         break;
  169 |
  170 |       case 'zoom':
  171 |         if (action.selector) {
  172 |           await this.zoomToElement(action.selector);
  173 |         }
  174 |         break;
  175 |
  176 |       case 'scroll':
  177 |         if (action.selector) {
  178 |           await this.page.locator(action.selector).scrollIntoViewIfNeeded();
  179 |         } else if (action.coordinates) {
  180 |           await this.page.mouse.wheel(0, action.coordinates.y);
  181 |         }
  182 |         break;
  183 |     }
  184 |
  185 |     // Small delay between actions for natural feel
  186 |     await this.page.waitForTimeout(300);
  187 |   }
  188 |
  189 |   private async applyVisualEffect(effect: VisualEffect): Promise<void> {
  190 |     switch (effect.type) {
  191 |       case 'highlight':
  192 |         if (effect.selector) {
  193 |           await this.highlightElement(effect.selector, effect.duration);
  194 |         }
  195 |         break;
  196 |
  197 |       case 'zoom':
  198 |         if (effect.selector) {
  199 |           await this.zoomToElement(effect.selector);
  200 |         }
  201 |         break;
  202 |
  203 |       case 'annotation':
  204 |         if (effect.selector && effect.text) {
  205 |           await this.addAnnotation(effect.selector, effect.text);
  206 |         }
  207 |         break;
  208 |
  209 |       case 'overlay':
  210 |         await this.addOverlay(effect.text || '', effect.style);
  211 |         break;
  212 |     }
  213 |   }
  214 |
  215 |   private async highlightElement(selector: string, duration: number = 2000): Promise<void> {
  216 |     await this.page.evaluate(
  217 |       ({ selector, duration }) => {
  218 |         const element = document.querySelector(selector);
  219 |         if (element) {
  220 |           const highlight = document.createElement('div');
```
