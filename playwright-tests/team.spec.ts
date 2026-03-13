// spec: specs/plan.md – Section 4: The Team Page (El Equipo)

import { test, expect } from '@playwright/test';

test.describe('Team Page', () => {
  test('4.1 Team page loads', async ({ page }) => {
    // Navigate to team page
    const response = await page.goto('https://www.avtaller.com/el-equipo');
    expect(response?.status()).toBe(200);

    // Heading should mention "El Equipo" or "equipo"
    await expect(page.locator('h1, h2').filter({ hasText: /el equipo|equipo/i }).first()).toBeVisible();
  });

  test('4.2 Architect profile is displayed', async ({ page }) => {
    // Navigate to team page
    await page.goto('https://www.avtaller.com/el-equipo');

    // Architect's name should appear on the page
    await expect(page.getByText(/Alejandro/i).first()).toBeVisible();

    // A profile image should load without error
    const profileImg = page.locator('img').first();
    await expect(profileImg).toBeVisible();

    const broken = await profileImg.evaluate(
      (img: HTMLImageElement) => !img.complete || img.naturalWidth === 0
    );
    expect(broken).toBe(false);
  });

  test('4.3 Contact email is visible on the team page', async ({ page }) => {
    // Navigate to team page
    await page.goto('https://www.avtaller.com/el-equipo');

    // An email address or mailto link should be present
    const emailLink = page.locator('a[href^="mailto:"]').first();
    const emailText = page.getByText(/@/);

    const hasEmail = (await emailLink.count()) > 0 || (await emailText.count()) > 0;
    expect(hasEmail).toBe(true);
  });
});
