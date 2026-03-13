// spec: specs/plan.md – Section 2: Navigation and Menu

import { test, expect } from '@playwright/test';

test.describe('Navigation and Menu', () => {
  test('2.1 Navigation bar is present and visible', async ({ page }) => {
    // Navigate to homepage
    await page.goto('https://www.avtaller.com/');

    // Header / nav element should be present
    const header = page.locator('header, nav, [role="navigation"]').first();
    await expect(header).toBeVisible();

    // Studio name should appear in the header
    const logo = page.locator('header a, nav a').filter({ hasText: /AV Taller|avtaller/i }).first();
    await expect(logo).toBeVisible();
  });

  test('2.2 Main navigation links are present', async ({ page }) => {
    // Navigate to homepage
    await page.goto('https://www.avtaller.com/');

    const nav = page.locator('header, nav, [role="navigation"]').first();

    // Each expected section link should exist
    await expect(nav.locator('a[href*="proyectos"]')).toBeVisible();
    await expect(nav.locator('a[href*="el-equipo"]')).toBeVisible();
    await expect(nav.locator('a[href*="contacto"]')).toBeVisible();
  });

  test('2.3 Navigation links navigate to the correct pages', async ({ page }) => {
    // 2.3a – Proyectos
    await page.goto('https://www.avtaller.com/');
    await page.locator('header a[href*="proyectos"], nav a[href*="proyectos"]').first().click();
    await expect(page).toHaveURL(/proyectos/);

    // 2.3b – El Equipo
    await page.goto('https://www.avtaller.com/');
    await page.locator('header a[href*="el-equipo"], nav a[href*="el-equipo"]').first().click();
    await expect(page).toHaveURL(/el-equipo/);

    // 2.3c – Contacto
    await page.goto('https://www.avtaller.com/');
    await page.locator('header a[href*="contacto"], nav a[href*="contacto"]').first().click();
    await expect(page).toHaveURL(/contacto/);
  });

  test('2.4 Active navigation state on El Equipo page', async ({ page }) => {
    // Navigate directly to El Equipo
    await page.goto('https://www.avtaller.com/el-equipo');

    // The current nav link should have some active indicator
    const activeLink = page.locator(
      'header a[href*="el-equipo"], nav a[href*="el-equipo"]'
    ).first();
    await expect(activeLink).toBeVisible();

    // Check it has an active class or aria-current attribute
    const ariaCurrent = await activeLink.getAttribute('aria-current');
    const className = await activeLink.getAttribute('class');
    const isActive =
      ariaCurrent === 'page' ||
      (className !== null && /active|current|selected/i.test(className));
    expect(isActive).toBe(true);
  });

  test('2.5 Mobile hamburger menu opens and navigates', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('https://www.avtaller.com/');

    // Find and click hamburger / toggle button
    const hamburger = page.locator(
      'button[aria-label*="menu" i], button[aria-expanded], [class*="hamburger"], [class*="menu-toggle"], [class*="nav-toggle"]'
    ).first();
    await expect(hamburger).toBeVisible();
    await hamburger.click();

    // Mobile nav links should become visible
    const mobileLink = page.locator('a[href*="proyectos"]').first();
    await expect(mobileLink).toBeVisible();

    // Click a link and verify navigation
    await mobileLink.click();
    await expect(page).toHaveURL(/proyectos/);
  });

  test('2.6 Logo links back to the homepage', async ({ page }) => {
    // Start on a sub-page
    await page.goto('https://www.avtaller.com/el-equipo');

    // Find logo link in header
    const logo = page.locator('header a[href="/"], header a[href="https://www.avtaller.com"]').first();
    await expect(logo).toBeVisible();
    await logo.click();

    await expect(page).toHaveURL(/^https:\/\/www\.avtaller\.com\/?$/);
  });
});
