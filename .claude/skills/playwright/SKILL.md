---
name: playwright
description: End-to-end browser testing with Playwright. Use when the user wants to write, run, fix, or generate Playwright tests for a web application. TRIGGER when user asks to test a website, create browser automation tests, fix failing Playwright tests, or generate a test plan. DO NOT TRIGGER for unit tests or non-browser testing.
---

# Playwright Skill

Help users create, run, and maintain end-to-end Playwright tests for web applications.

## When to Use This Skill

TRIGGER when the user:
- Wants to write or generate Playwright tests
- Has failing Playwright tests that need fixing
- Wants a test plan for a web application or specific page
- Needs to set up Playwright in a project
- Asks to automate browser interactions or validate web UI behavior

## Workflow

Make a todo list for all tasks in this workflow and work through them one at a time.

### 1. Understand the Project

Examine the repository structure to understand what kind of project this is:
- Read `package.json` to check if Playwright is already installed
- Look for existing test files (`*.spec.ts`, `*.test.ts`, `playwright.config.ts`)
- Read the README to understand the application
- Identify how to start the dev server (e.g., `npm run dev`, `npm start`)

### 2. Set Up Playwright (if not already installed)

If Playwright is not in `package.json`, install and configure it:

```bash
npm init playwright@latest
```

This creates:
- `playwright.config.ts` — configuration file
- `tests/` — directory for test files
- `.github/workflows/playwright.yml` — CI workflow (optional)

If the project already has Playwright, skip to step 3.

**Verify the setup works:**
```bash
npx playwright test --list
```

### 3. Determine the Task

Based on the user's request, choose the appropriate path:

| User wants... | Use agent |
|---|---|
| A test plan / test scenarios for a page | `planner` agent |
| New tests generated from a test plan | `generator` agent |
| Failing tests fixed | `healer` agent |
| Full flow (plan → generate → fix) | All three in sequence |

### 4a. Create a Test Plan (planner agent)

Use the `planner` agent when the user wants to explore a URL and create comprehensive test scenarios.

The planner agent will:
1. Navigate to the target URL
2. Explore the interface and map user flows
3. Design test scenarios (happy path, edge cases, error handling)
4. Save the test plan as a markdown file (e.g., `specs/plan.md`)

**Trigger phrase for agent:** "Use the planner agent to navigate to [URL] and create a comprehensive test plan"

### 4b. Generate Tests from a Plan (generator agent)

Use the `generator` agent to turn a test plan into actual Playwright test files.

The generator agent will:
1. Read the test plan
2. Manually execute each step in a real browser using Playwright tools
3. Capture the generated test code from the log
4. Write `.spec.ts` files for each scenario

**Trigger phrase for agent:** "Use the generator agent to implement the tests from [plan file]"

Each generated test file:
- Contains a single `test.describe` block matching the plan section
- Has a comment before each step
- Uses Playwright best practices (locators, assertions, no `networkidle`)

### 4c. Fix Failing Tests (healer agent)

Use the `healer` agent when existing Playwright tests are failing.

The healer agent will:
1. Run all tests to identify failures
2. Debug each failing test step-by-step
3. Inspect the live browser state at the point of failure
4. Fix selectors, timing issues, and assertion failures
5. Re-run to verify the fix
6. Mark as `test.fixme()` only if unfixable (with explanation)

**Trigger phrase for agent:** "Use the healer agent to debug and fix the failing Playwright tests"

### 5. Run the Tests

After generating or fixing tests, run them to confirm everything passes:

```bash
# Run all tests
npx playwright test

# Run a specific test file
npx playwright test tests/login.spec.ts

# Run with UI mode (interactive)
npx playwright test --ui

# Run headed (shows browser)
npx playwright test --headed

# Show report after run
npx playwright show-report
```

### 6. Commit and Push

Once tests pass, commit the changes:

```bash
git add .
git commit -m "Add Playwright tests for [feature/page]"
git push
```

## Playwright Best Practices

**Locators** — prefer role-based and semantic locators:
```ts
page.getByRole('button', { name: 'Submit' })
page.getByLabel('Email')
page.getByPlaceholder('Enter your name')
page.getByText('Welcome back')
page.getByTestId('login-form')
```

**Assertions** — use `expect` with auto-waiting:
```ts
await expect(page.getByRole('heading')).toBeVisible()
await expect(page.getByText('Success')).toBeVisible()
await expect(page).toHaveURL('/dashboard')
await expect(page).toHaveTitle(/Dashboard/)
```

**Test structure**:
```ts
import { test, expect } from '@playwright/test'

test.describe('Login Flow', () => {
  test('should log in with valid credentials', async ({ page }) => {
    await page.goto('/')
    await page.getByLabel('Email').fill('user@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Log in' }).click()
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })
})
```

**Avoid:**
- `page.waitForTimeout()` — use `expect().toBeVisible()` or `waitFor()` instead
- `networkidle` — deprecated and unreliable
- CSS selectors for structure (`.btn-primary`) — use semantic locators
- Hard-coded `sleep` or arbitrary waits

## Wrap Up

In your final message to the user, provide:

* Summary of what was done (setup, plan created, tests generated, tests fixed)
* Test results:
  1. ✅/‼️ Playwright setup (if applicable)
  2. ✅/‼️ Test plan created (if applicable, include file path)
  3. ✅/‼️ Tests generated (list files created)
  4. ✅/‼️ Tests passing (include count and any skipped/fixme)
* Next steps the user should take (e.g., run in CI, add more scenarios)
