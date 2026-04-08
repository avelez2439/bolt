// spec: specs/plan.md – Section 9: Responsive Layout

import { test, expect } from '@playwright/test';

test.describe('Responsive Layout', () => {
  test('9.1 Desktop layout (1440 × 900) – no overflow', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('https://www.avtaller.com/');

    // Scroll through the page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    // No horizontal scrollbar (scrollWidth should not exceed viewport width)
    const hasHorizontalScroll = await page.evaluate(
      () => document.body.scrollWidth > window.innerWidth
    );
    expect(hasHorizontalScroll).toBe(false);
  });

  test('9.2 Tablet layout (768 × 1024) – no overflow', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('https://www.avtaller.com/');

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    const hasHorizontalScroll = await page.evaluate(
      () => document.body.scrollWidth > window.innerWidth
    );
    expect(hasHorizontalScroll).toBe(false);
  });

  test('9.3 Mobile layout (390 × 844) – hamburger menu and no overflow', async ({ page }) => {
    // Set mobile viewport (iPhone 14)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('https://www.avtaller.com/');

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    // No horizontal overflow
    const hasHorizontalScroll = await page.evaluate(
      () => document.body.scrollWidth > window.innerWidth
    );
    expect(hasHorizontalScroll).toBe(false);

    // Desktop nav should be hidden; a mobile toggle should exist
    const hamburger = page.locator(
      'button[aria-label*="menu" i], button[aria-expanded], [class*="hamburger"], [class*="menu-toggle"], [class*="nav-toggle"]'
    ).first();
    await expect(hamburger).toBeVisible();
  });
});
