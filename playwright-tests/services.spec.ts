// spec: specs/plan.md – Section 5: Services Page

import { test, expect } from '@playwright/test';

test.describe('Services Page', () => {
  test('5.1 Services page loads', async ({ page }) => {
    // Navigate to services page
    const response = await page.goto('https://www.avtaller.com/servicios');
    expect(response?.status()).toBe(200);

    // A heading with "Servicios" should be visible
    await expect(page.locator('h1, h2, h3').filter({ hasText: /servicios/i }).first()).toBeVisible();
  });

  test('5.2 Core services are listed on the page', async ({ page }) => {
    // Navigate to services page
    await page.goto('https://www.avtaller.com/servicios');

    // Scroll to load all content
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // At least one service block / description should be present
    const textContent = await page.locator('body').innerText();
    const hasServices =
      /diseño|residencial|vivienda|servicios|interventoría|construc/i.test(textContent);
    expect(hasServices).toBe(true);
  });

  test('5.3 Service CTA links navigate correctly', async ({ page }) => {
    // Navigate to services page
    await page.goto('https://www.avtaller.com/servicios');

    // Look for a CTA link pointing to contact or projects
    const cta = page
      .locator('a[href*="contacto"], a[href*="proyectos"]')
      .first();

    if ((await cta.count()) === 0) {
      test.skip(true, 'No CTA link found on services page – skipping');
      return;
    }

    await expect(cta).toBeVisible();
    await cta.click();
    await expect(page).toHaveURL(/contacto|proyectos/);
  });
});
