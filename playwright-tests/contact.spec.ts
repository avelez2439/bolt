// spec: specs/plan.md – Section 6: Contact Page

import { test, expect } from '@playwright/test';

test.describe('Contact Page', () => {
  test('6.1 Contact page loads', async ({ page }) => {
    // Navigate to contact page
    const response = await page.goto('https://www.avtaller.com/contacto');
    expect(response?.status()).toBe(200);

    // Heading should contain "Contacto"
    await expect(page.locator('h1, h2').filter({ hasText: /contacto/i }).first()).toBeVisible();
  });

  test('6.2 Contact form is present with required fields', async ({ page }) => {
    // Navigate to contact page
    await page.goto('https://www.avtaller.com/contacto');

    // A form should be on the page
    const form = page.locator('form').first();
    await expect(form).toBeVisible();

    // Name, email, and message fields should exist
    const nameField = page.locator(
      'input[name*="name" i], input[placeholder*="nombre" i], input[id*="name" i]'
    ).first();
    const emailField = page.locator('input[type="email"]').first();
    const messageField = page.locator('textarea').first();
    const submitBtn = page.locator('button[type="submit"], input[type="submit"]').first();

    await expect(nameField).toBeVisible();
    await expect(emailField).toBeVisible();
    await expect(messageField).toBeVisible();
    await expect(submitBtn).toBeVisible();
  });

  test('6.3 Contact form validates required fields', async ({ page }) => {
    // Navigate to contact page
    await page.goto('https://www.avtaller.com/contacto');

    const currentUrl = page.url();

    // Click submit without filling anything
    const submitBtn = page.locator('button[type="submit"], input[type="submit"]').first();
    await submitBtn.click();

    // Should not navigate away
    expect(page.url()).toBe(currentUrl);

    // Either native HTML5 validation or a custom error should appear
    const hasValidationError = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input, textarea'));
      return inputs.some(
        el => (el as HTMLInputElement).validity && !(el as HTMLInputElement).validity.valid
      );
    });

    const customError = page.locator('[class*="error" i], [class*="invalid" i]').first();
    const hasCustomError = (await customError.count()) > 0;

    expect(hasValidationError || hasCustomError).toBe(true);
  });

  test('6.4 Contact form validates invalid email format', async ({ page }) => {
    // Navigate to contact page
    await page.goto('https://www.avtaller.com/contacto');

    // Fill in name and message, but use an invalid email
    const nameField = page.locator(
      'input[name*="name" i], input[placeholder*="nombre" i], input[id*="name" i]'
    ).first();
    const emailField = page.locator('input[type="email"]').first();
    const messageField = page.locator('textarea').first();

    await nameField.fill('Test User');
    await emailField.fill('not-an-email');
    await messageField.fill('This is a test message');

    const currentUrl = page.url();
    const submitBtn = page.locator('button[type="submit"], input[type="submit"]').first();
    await submitBtn.click();

    // Should stay on the page (not navigate away)
    expect(page.url()).toBe(currentUrl);

    // Email field should be invalid
    const emailInvalid = await emailField.evaluate(
      (el: HTMLInputElement) => el.validity && !el.validity.valid
    );
    expect(emailInvalid).toBe(true);
  });

  test('6.5 Contact form can be submitted with valid data', async ({ page }) => {
    // Navigate to contact page
    await page.goto('https://www.avtaller.com/contacto');

    const nameField = page.locator(
      'input[name*="name" i], input[placeholder*="nombre" i], input[id*="name" i]'
    ).first();
    const emailField = page.locator('input[type="email"]').first();
    const messageField = page.locator('textarea').first();
    const submitBtn = page.locator('button[type="submit"], input[type="submit"]').first();

    // Fill in valid data
    await nameField.fill('Playwright Test');
    await emailField.fill('playwright-test@example.com');
    await messageField.fill('Automated test message – please ignore');

    await submitBtn.click();

    // After submission: either a success message appears or the URL changes
    const successIndicator = page.locator(
      ':text-matches("gracias|enviado|éxito|success|thank", "i")'
    ).first();

    await expect(successIndicator).toBeVisible({ timeout: 10000 });
  });

  test('6.6 Studio contact information is displayed', async ({ page }) => {
    // Navigate to contact page
    await page.goto('https://www.avtaller.com/contacto');

    const bodyText = await page.locator('body').innerText();

    // Location (Medellín or Colombia) should be mentioned
    expect(/Medellín|Colombia/i.test(bodyText)).toBe(true);

    // An email address or social media link should be present
    const emailOrSocial =
      (await page.locator('a[href^="mailto:"]').count()) > 0 ||
      (await page.locator('a[href*="instagram"], a[href*="linkedin"]').count()) > 0 ||
      /@/.test(bodyText);

    expect(emailOrSocial).toBe(true);
  });
});
