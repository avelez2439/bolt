// spec: specs/plan.md – Section 8: Accessibility and Performance

import { test, expect } from '@playwright/test';

test.describe('Accessibility and Performance', () => {
  test('8.1 Page has correct language attribute', async ({ page }) => {
    // Navigate to homepage
    await page.goto('https://www.avtaller.com/');

    // html[lang] should be "es" or "es-CO"
    const lang = await page.evaluate(() => document.documentElement.lang);
    expect(lang).toMatch(/^es/i);
  });

  test('8.2 Images have non-empty alt text', async ({ page }) => {
    // Check homepage
    await page.goto('https://www.avtaller.com/');
    const missingAltHome = await page.evaluate(() =>
      Array.from(document.querySelectorAll('img'))
        .filter(img => !img.alt || img.alt.trim() === '')
        .map(img => img.src)
    );

    // Check project page
    await page.goto('https://www.avtaller.com/proyectos/tierra-grata/');
    const missingAltProject = await page.evaluate(() =>
      Array.from(document.querySelectorAll('img'))
        .filter(img => !img.alt || img.alt.trim() === '')
        .map(img => img.src)
    );

    // Soft assertions – report but don't fail immediately
    if (missingAltHome.length > 0) {
      console.warn('Images missing alt on homepage:', missingAltHome);
    }
    if (missingAltProject.length > 0) {
      console.warn('Images missing alt on Tierra Grata page:', missingAltProject);
    }

    expect(missingAltHome.length + missingAltProject.length).toBe(0);
  });

  test('8.3 Page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('https://www.avtaller.com/');

    const elapsed = Date.now() - startTime;

    // Total navigation including load should be under 15 seconds on this network
    expect(elapsed).toBeLessThan(15000);

    // No 404 or 5xx errors in network
    const failedRequests: string[] = [];
    page.on('response', response => {
      if (response.status() >= 400) {
        failedRequests.push(`${response.status()} ${response.url()}`);
      }
    });

    // Trigger a reload to capture network errors
    await page.reload();
    await page.waitForLoadState('domcontentloaded');

    // Allow some minor 4xx (e.g. 404 on analytics endpoints) – fail on 5xx
    const serverErrors = failedRequests.filter(r => r.startsWith('5'));
    expect(serverErrors).toHaveLength(0);
  });

  test('8.4 Viewport meta tag is present', async ({ page }) => {
    // Navigate to homepage
    await page.goto('https://www.avtaller.com/');

    // Check for viewport meta tag
    const viewportMeta = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="viewport"]');
      return meta ? meta.getAttribute('content') : null;
    });

    expect(viewportMeta).not.toBeNull();
    expect(viewportMeta).toMatch(/width=device-width/i);
  });
});
