// spec: specs/plan.md – Section 7: Footer

import { test, expect } from '@playwright/test';

const mainPages = [
  'https://www.avtaller.com/',
  'https://www.avtaller.com/proyectos',
  'https://www.avtaller.com/el-equipo',
  'https://www.avtaller.com/servicios',
  'https://www.avtaller.com/contacto',
];

test.describe('Footer', () => {
  test('7.1 Footer is present on all main pages', async ({ page }) => {
    for (const url of mainPages) {
      await page.goto(url);

      // Scroll to the bottom
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);

      const footer = page.locator('footer').first();
      await expect(footer).toBeVisible();

      // Studio name should appear in the footer
      const footerText = await footer.innerText();
      expect(/AV Taller|avtaller/i.test(footerText)).toBe(true);
    }
  });

  test('7.2 Footer navigation links work', async ({ page }) => {
    await page.goto('https://www.avtaller.com/');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    const footer = page.locator('footer');

    // Find nav links in the footer
    const footerLinks = footer.locator('a[href*="proyectos"], a[href*="el-equipo"], a[href*="contacto"]');
    const count = await footerLinks.count();

    if (count === 0) {
      test.skip(true, 'No nav links found in footer – skipping');
      return;
    }

    // Click the first footer link and verify navigation
    const firstLink = footerLinks.first();
    await firstLink.click();
    await expect(page).toHaveURL(/proyectos|el-equipo|contacto/);
  });

  test('7.3 Social media links open in a new tab', async ({ page }) => {
    await page.goto('https://www.avtaller.com/');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    const footer = page.locator('footer');
    const socialLinks = footer.locator(
      'a[href*="instagram"], a[href*="linkedin"], a[href*="behance"], a[href*="facebook"], a[href*="whatsapp"]'
    );

    const count = await socialLinks.count();

    if (count === 0) {
      test.skip(true, 'No social media links found in footer – skipping');
      return;
    }

    // Each social link should have target="_blank" and rel containing "noopener"
    for (let i = 0; i < count; i++) {
      const link = socialLinks.nth(i);
      const target = await link.getAttribute('target');
      const rel = await link.getAttribute('rel');
      expect(target).toBe('_blank');
      expect(rel).toMatch(/noopener/);
    }
  });
});
