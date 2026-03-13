// spec: specs/plan.md – Section 3: Projects Page

import { test, expect } from '@playwright/test';

test.describe('Projects Page', () => {
  test('3.1 Projects page loads', async ({ page }) => {
    // Navigate to projects listing
    const response = await page.goto('https://www.avtaller.com/proyectos');
    expect(response?.status()).toBe(200);

    // A heading or label with "Proyectos" should be visible
    await expect(page.locator('h1, h2, h3').filter({ hasText: /proyectos/i }).first()).toBeVisible();

    // At least one project card / thumbnail should exist
    const cards = page.locator('a[href*="proyectos/"], [class*="project"], [class*="card"]');
    await expect(cards.first()).toBeVisible();
  });

  test('3.2 Project cards display correctly', async ({ page }) => {
    // Navigate to projects listing
    await page.goto('https://www.avtaller.com/proyectos');

    // Scroll to load any lazy images
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // No broken project images
    const brokenImages = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs
        .filter(img => !img.complete || img.naturalWidth === 0)
        .map(img => img.src);
    });
    expect(brokenImages).toHaveLength(0);
  });

  test('3.3 Clicking a project card opens the detail page', async ({ page }) => {
    // Navigate to projects listing
    await page.goto('https://www.avtaller.com/proyectos');

    // Click on the first project link
    const firstCard = page.locator('a[href*="/proyectos/"]').first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    // URL should be a project detail path
    await expect(page).toHaveURL(/\/proyectos\/.+/);

    // Detail page should have a heading and at least one image
    await expect(page.locator('h1, h2').first()).toBeVisible();
    await expect(page.locator('img').first()).toBeVisible();
  });

  test('3.4 Tierra Grata project page loads correctly', async ({ page }) => {
    // Navigate directly to the known project page
    const response = await page.goto('https://www.avtaller.com/proyectos/tierra-grata/');
    expect(response?.status()).toBe(200);

    // Page title / heading should mention Tierra Grata
    await expect(page.locator('h1, h2').filter({ hasText: /tierra grata/i }).first()).toBeVisible();

    // At least one image should be present
    await expect(page.locator('img').first()).toBeVisible();
  });

  test('3.5 Back navigation from project detail returns to listing', async ({ page }) => {
    // Navigate to a project detail page
    await page.goto('https://www.avtaller.com/proyectos/tierra-grata/');

    // Navigate back
    await page.goBack();

    // Should land on the projects listing
    await expect(page).toHaveURL(/\/proyectos\/?$/);
  });
});
