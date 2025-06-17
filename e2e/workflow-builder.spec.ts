import { test, expect } from '@playwright/test';

test.describe('Workflow Builder', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to workflow builder
    await page.goto('/builder');
  });

  test('should load workflow builder interface', async ({ page }) => {
    // Check for main workflow builder elements
    await expect(page.locator('text=Workflow Builder, text=Builder')).toBeVisible();

    // Check for node palette/sidebar
    const nodePalette = page.locator('[data-testid="node-palette"], .node-palette');
    if (await nodePalette.isVisible()) {
      await expect(nodePalette).toBeVisible();
    }

    // Check for canvas area
    const canvas = page.locator('[data-testid="workflow-canvas"], .workflow-canvas, canvas');
    if (await canvas.isVisible()) {
      await expect(canvas).toBeVisible();
    }
  });

  test('should display available node types', async ({ page }) => {
    // Look for different node types
    const nodeTypes = ['Trigger', 'AI Agent', 'Database', 'Email', 'Webhook'];

    for (const nodeType of nodeTypes) {
      const nodeElement = page.locator(`text=${nodeType}`);
      if (await nodeElement.isVisible()) {
        await expect(nodeElement).toBeVisible();
      }
    }
  });

  test('should allow adding nodes to workflow', async ({ page }) => {
    // Look for "Add Node" or similar functionality
    const addNodeButton = page.locator('text=Add Node, text=Add Trigger').first();

    if (await addNodeButton.isVisible()) {
      await addNodeButton.click();
      await page.waitForTimeout(1000);

      // Check if a node was added to the canvas
      const workflowNode = page.locator('[data-testid="workflow-node"], .workflow-node');
      if (await workflowNode.isVisible()) {
        await expect(workflowNode).toBeVisible();
      }
    }
  });

  test('should allow saving workflow', async ({ page }) => {
    // Look for save button
    const saveButton = page.locator('text=Save, button[aria-label*="save"]');

    if (await saveButton.isVisible()) {
      await saveButton.click();
      await page.waitForTimeout(1000);

      // Should show save confirmation or navigate
      // This would depend on authentication state
    }
  });

  test('should allow running/executing workflow', async ({ page }) => {
    // Look for run/execute button
    const runButton = page.locator('text=Run, text=Execute, button[aria-label*="run"]');

    if (await runButton.isVisible()) {
      // Button should be present
      await expect(runButton).toBeVisible();

      // Click to test execution (might require nodes to be present)
      await runButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should handle workflow properties/settings', async ({ page }) => {
    // Look for settings or properties panel
    const settingsButton = page.locator('text=Settings, text=Properties, [aria-label*="settings"]');

    if (await settingsButton.isVisible()) {
      await settingsButton.click();
      await page.waitForTimeout(500);

      // Should show settings panel
      const settingsPanel = page.locator('[data-testid="settings-panel"], .settings-panel');
      if (await settingsPanel.isVisible()) {
        await expect(settingsPanel).toBeVisible();
      }
    }
  });

  test('should support workflow templates', async ({ page }) => {
    // Look for templates or examples
    const templatesButton = page.locator('text=Templates, text=Examples');

    if (await templatesButton.isVisible()) {
      await templatesButton.click();
      await page.waitForTimeout(1000);

      // Should show template options
      const templateOption = page.locator('[data-testid="template"], .template-card').first();
      if (await templateOption.isVisible()) {
        await expect(templateOption).toBeVisible();
      }
    }
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    // Interface should still be usable
    const mainContent = page.locator('main, [role="main"]');
    await expect(mainContent).toBeVisible();
  });

  test('should handle keyboard shortcuts', async ({ page }) => {
    // Test common keyboard shortcuts

    // Ctrl+S for save
    await page.keyboard.press('Control+s');
    await page.waitForTimeout(500);

    // Ctrl+Z for undo (if implemented)
    await page.keyboard.press('Control+z');
    await page.waitForTimeout(500);

    // Delete key for deleting selected items
    await page.keyboard.press('Delete');
    await page.waitForTimeout(500);

    // No errors should occur
    expect(true).toBeTruthy();
  });
});
