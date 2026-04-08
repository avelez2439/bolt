// spec: specs/plan.md – Section 1: Homepage

import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('1.1 Page loads successfully', async ({ page }) => {
    // Navigate to the homepage
    const response = await page.goto('https://www.avtaller.com/');
    expect(response?.status()).toBe(200);

    // Page title contains studio name
    await expect(page).toHaveTitle(/AV Taller|Inicio/i);
  });

  test('1.2 Hero section is visible', async ({ page }) => {
    // Navigate to homepage
    await page.goto('https://www.avtaller.com/');

    // Hero / banner area should be in the viewport
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // No broken images in the above-the-fold area
    const brokenImages = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs
        .filter(img => !img.complete || img.naturalWidth === 0)
        .map(img => img.src);
    });
    expect(brokenImages).toHaveLength(0);
  });

  test('1.3 Key sections are present on the page', async ({ page }) => {
    // Navigate and scroll through homepage
    await page.goto('https://www.avtaller.com/');

    // Scroll to the bottom to trigger lazy-loaded content
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // No broken images anywhere on the page
    const brokenImages = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs
        .filter(img => !img.complete || img.naturalWidth === 0)
        .map(img => img.src);
    });
    expect(brokenImages).toHaveLength(0);

    // A link to projects or contact exists somewhere on the page
    const ctaLink = page.locator('a[href*="proyectos"], a[href*="contacto"]').first();
    await expect(ctaLink).toBeVisible();
  });

  test('1.4 Primary CTA button navigates correctly', async ({ page }) => {
    // Navigate to homepage
    await page.goto('https://www.avtaller.com/');

    // Find a prominent CTA link (projects or contact)
    const cta = page.locator('a[href*="proyectos"], a[href*="contacto"]').first();
    await expect(cta).toBeVisible();

    // Click and verify navigation
    await cta.click();
    await expect(page).toHaveURL(/proyectos|contacto/);
  });
});
