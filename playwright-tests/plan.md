# AV Taller – Playwright Test Plan

## Application Overview

**AV Taller** (https://www.avtaller.com) is the website of a Colombian architecture and interior design studio led by Arq. Alejandro Vélez Restrepo, based in Medellín, Colombia. The firm specialises in residential, multi-family, commercial, and corporate projects, offering design, construction supervision (*interventoría*), and virtual-tour pre-visualisation services.

### Key pages identified

| URL path | Purpose |
|---|---|
| `/` | Homepage (Inicio) |
| `/el-equipo` | About the team |
| `/proyectos` | Projects gallery |
| `/proyectos/tierra-grata/` | Individual project page (Tierra Grata) |
| `/servicios` | Services offered |
| `/contacto` | Contact / enquiry form |

### Technology notes

- Base URL: `https://www.avtaller.com`
- Language: Spanish (es-CO)
- Assumed platform: modern static/CMS site (Webflow-style)
- Tests are run with Playwright against Chromium (Desktop Chrome profile)

---

## Test Scenarios

---

### 1. Homepage

#### 1.1 Page Loads Successfully

**Steps:**
1. Navigate to `https://www.avtaller.com/`.
2. Wait for the page to reach `networkidle` state.

**Expected Results:**
- HTTP response status is 200.
- The page title contains `"AV Taller"` or `"Inicio"`.
- No JavaScript errors appear in the browser console.

---

#### 1.2 Hero Section Is Visible

**Steps:**
1. Navigate to `https://www.avtaller.com/`.
2. Observe the above-the-fold content.

**Expected Results:**
- A full-width hero/banner section is visible.
- The hero contains the studio name or a headline communicating the studio's value proposition (architecture / interior design in Colombia).
- Any hero image or background video loads without broken-image placeholders.

---

#### 1.3 Key Sections Are Present

**Steps:**
1. Navigate to `https://www.avtaller.com/`.
2. Scroll through the entire page.

**Expected Results:**
- At minimum the following content blocks appear on the page (in any order):
  - Studio introduction / tagline.
  - Featured projects or portfolio preview.
  - Brief services description.
  - A call-to-action (CTA) button or link directing the visitor to contact the studio or view projects.
- All images load correctly (no broken `img` elements with empty `src`).

---

#### 1.4 Primary CTA Button Works

**Steps:**
1. Navigate to `https://www.avtaller.com/`.
2. Locate the primary CTA button (e.g., "Ver proyectos", "Contáctanos", or similar).
3. Click the CTA button.

**Expected Results:**
- The browser navigates to the relevant destination page (e.g., `/proyectos` or `/contacto`).
- The destination page loads with a 200 status and renders content.

---

### 2. Navigation and Menu

#### 2.1 Navigation Bar Is Present and Visible

**Steps:**
1. Navigate to `https://www.avtaller.com/`.
2. Observe the top of the page.

**Expected Results:**
- A navigation bar (header) is visible.
- The studio logo or name "AV Taller" appears in the header.
- Navigation links are readable and not overlapping any content.

---

#### 2.2 All Main Navigation Links Are Present

**Steps:**
1. Navigate to `https://www.avtaller.com/`.
2. Inspect the navigation bar for links.

**Expected Results:**
- The navigation contains links to at least the following sections (in Spanish):
  - Inicio (Home) — `/`
  - Proyectos (Projects) — `/proyectos`
  - El Equipo (The Team) — `/el-equipo`
  - Servicios (Services) — `/servicios`
  - Contacto (Contact) — `/contacto`
- Each link is focusable via keyboard.

---

#### 2.3 Navigation Links Navigate to Correct Pages

**Steps:**
1. Navigate to `https://www.avtaller.com/`.
2. Click the "Proyectos" navigation link.
3. Verify the URL changes to `/proyectos`.
4. Navigate back, then click "El Equipo".
5. Verify the URL changes to `/el-equipo`.
6. Navigate back, then click "Servicios".
7. Verify the URL changes to `/servicios`.
8. Navigate back, then click "Contacto".
9. Verify the URL changes to `/contacto`.

**Expected Results:**
- Each link click results in a page navigation with a 200 status.
- The correct page title/heading loads for each destination.
- The browser URL updates to reflect the expected path.

---

#### 2.4 Active Navigation State

**Steps:**
1. Navigate to `https://www.avtaller.com/el-equipo`.
2. Inspect the navigation bar.

**Expected Results:**
- The "El Equipo" link is visually distinguished from other navigation links (e.g., different colour, underline, or bold weight), indicating the current page.

---

#### 2.5 Mobile Navigation (Hamburger Menu)

**Steps:**
1. Navigate to `https://www.avtaller.com/`.
2. Resize the viewport to a mobile width (e.g., 390 × 844 — iPhone 14).
3. Locate the hamburger menu icon.
4. Click the hamburger icon.
5. Observe the menu.
6. Click a menu item (e.g., "Proyectos").
7. Verify navigation occurs correctly.

**Expected Results:**
- At mobile widths the full navigation links are hidden and replaced with a hamburger/toggle icon.
- Clicking the icon reveals the navigation links in a drawer or dropdown.
- Clicking a link within the mobile menu navigates to the correct page and closes the menu.

---

#### 2.6 Logo Links Back to Homepage

**Steps:**
1. Navigate to `https://www.avtaller.com/el-equipo`.
2. Click the studio logo in the header.

**Expected Results:**
- The browser navigates to `https://www.avtaller.com/` (the homepage).
- The homepage loads successfully.

---

### 3. Projects Page

#### 3.1 Projects Page Loads

**Steps:**
1. Navigate to `https://www.avtaller.com/proyectos`.

**Expected Results:**
- The page returns a 200 status.
- A heading or label containing "Proyectos" (or "Projects") is visible.
- At least one project card / thumbnail is displayed.

---

#### 3.2 Project Cards Are Displayed Correctly

**Steps:**
1. Navigate to `https://www.avtaller.com/proyectos`.
2. Scroll through the projects listing.

**Expected Results:**
- Each project card shows at minimum: a project image, a project name/title.
- All project images load without error (no broken `img` elements).
- Project cards are arranged in a consistent grid or list layout.

---

#### 3.3 Individual Project Page Loads

**Steps:**
1. Navigate to `https://www.avtaller.com/proyectos`.
2. Click on the first project card (e.g., "Tierra Grata").
3. Wait for the project detail page to load.

**Expected Results:**
- The URL changes to the project's unique path (e.g., `/proyectos/tierra-grata/`).
- The project detail page displays: project title, at least one high-resolution image, and a text description of the project.
- All images load without error.

---

#### 3.4 Known Project Page – Tierra Grata

**Steps:**
1. Navigate directly to `https://www.avtaller.com/proyectos/tierra-grata/`.

**Expected Results:**
- Page title or heading contains "Tierra Grata".
- The page includes project description mentioning location (Envigado, Colombia) and year (2022).
- Gallery or image slider showing the apartment interiors is present.
- All images and media load correctly.

---

#### 3.5 Back Navigation from Project Detail

**Steps:**
1. Navigate to `https://www.avtaller.com/proyectos/tierra-grata/`.
2. Click the browser Back button or any "back to projects" link on the page.

**Expected Results:**
- The browser returns to the projects listing page (`/proyectos`).
- The projects listing page renders correctly without reloading from scratch (or with a full reload that is still successful).

---

### 4. The Team Page (El Equipo)

#### 4.1 Team Page Loads

**Steps:**
1. Navigate to `https://www.avtaller.com/el-equipo`.

**Expected Results:**
- The page returns a 200 status.
- A heading containing "El Equipo" or "El equipo" is visible.

---

#### 4.2 Architect Profile Is Displayed

**Steps:**
1. Navigate to `https://www.avtaller.com/el-equipo`.
2. Scroll through the page content.

**Expected Results:**
- The name "Alejandro Vélez Restrepo" is visible on the page.
- The title "Arq." or "Arquitecto" appears alongside his name.
- A profile photo or portrait image loads without error.
- A brief biography or professional description is present.

---

#### 4.3 Contact Email Is Visible and Correct

**Steps:**
1. Navigate to `https://www.avtaller.com/el-equipo`.
2. Locate any email address displayed on the page.

**Expected Results:**
- The email address `a.velez2439@uniandes.edu.co` (or the studio's official email) is displayed.
- The email renders as a `mailto:` link OR is clearly readable as text.

---

### 5. Services Page

#### 5.1 Services Page Loads

**Steps:**
1. Navigate to `https://www.avtaller.com/servicios`.

**Expected Results:**
- The page returns a 200 status.
- A heading or section title mentioning "Servicios" is present.

---

#### 5.2 Core Services Are Listed

**Steps:**
1. Navigate to `https://www.avtaller.com/servicios`.
2. Scroll through the entire page.

**Expected Results:**
- At least the following service categories are described on the page:
  - Residential / housing design (vivienda, apartamentos).
  - Multi-family or commercial project design.
  - Construction supervision (*interventoría*).
  - Virtual tour / pre-visualisation service.
- Each service has a title and descriptive text.

---

#### 5.3 Service CTA Links Work

**Steps:**
1. Navigate to `https://www.avtaller.com/servicios`.
2. Locate any CTA button or link within a service block (e.g., "Contáctanos", "Saber más").
3. Click the CTA.

**Expected Results:**
- The browser navigates to the appropriate destination (e.g., `/contacto` or `/proyectos`).
- The destination page loads without errors.

---

### 6. Contact Page

#### 6.1 Contact Page Loads

**Steps:**
1. Navigate to `https://www.avtaller.com/contacto`.

**Expected Results:**
- The page returns a 200 status.
- A heading containing "Contacto" is visible.

---

#### 6.2 Contact Form Is Present

**Steps:**
1. Navigate to `https://www.avtaller.com/contacto`.
2. Scroll to the contact section.

**Expected Results:**
- A contact form is visible with at least the following fields:
  - Name (`Nombre`) — text input.
  - Email (`Correo electrónico`) — email input.
  - Message (`Mensaje`) — textarea.
- A submit button (e.g., "Enviar" or "Contactar") is present.

---

#### 6.3 Contact Form – Required Field Validation

**Steps:**
1. Navigate to `https://www.avtaller.com/contacto`.
2. Leave all form fields blank.
3. Click the submit button.

**Expected Results:**
- The form does not submit.
- Validation messages appear on the empty required fields (native HTML5 validation or custom error messages).
- The page does not navigate away.

---

#### 6.4 Contact Form – Invalid Email Validation

**Steps:**
1. Navigate to `https://www.avtaller.com/contacto`.
2. Fill in the Name field with `"Test User"`.
3. Fill in the Email field with an invalid value: `"not-an-email"`.
4. Fill in the Message field with `"This is a test message"`.
5. Click the submit button.

**Expected Results:**
- The form does not submit.
- An error message or browser tooltip indicates that the email field requires a valid email address.

---

#### 6.5 Contact Form – Successful Submission

**Steps:**
1. Navigate to `https://www.avtaller.com/contacto`.
2. Fill in the Name field with `"Playwright Test"`.
3. Fill in the Email field with `"playwright-test@example.com"`.
4. Fill in the Message field with `"Automated test message – please ignore"`.
5. Click the submit button.
6. Wait for the page to respond.

**Expected Results:**
- A success confirmation message is displayed (e.g., "¡Gracias por tu mensaje!", "Tu mensaje fue enviado", or similar).
- The form fields are cleared or the form is replaced by the confirmation message.
- The page does not display a server error.

---

#### 6.6 Studio Contact Information Is Displayed

**Steps:**
1. Navigate to `https://www.avtaller.com/contacto`.
2. Scroll through the page.

**Expected Results:**
- The studio's contact email address is visible on the page.
- Location information (Medellín, Colombia) is mentioned.
- Any social media links (Instagram, LinkedIn, Behance) present are functional and open the correct profile in a new tab.

---

### 7. Footer

#### 7.1 Footer Is Present on All Main Pages

**Steps:**
1. Navigate to each of the following URLs in turn and scroll to the bottom:
   - `https://www.avtaller.com/`
   - `https://www.avtaller.com/proyectos`
   - `https://www.avtaller.com/el-equipo`
   - `https://www.avtaller.com/servicios`
   - `https://www.avtaller.com/contacto`

**Expected Results:**
- A footer section is present at the bottom of every page.
- The footer includes the studio name "AV Taller".
- Copyright notice or year is displayed (e.g., `© 2024 AV Taller`).

---

#### 7.2 Footer Navigation Links

**Steps:**
1. Navigate to `https://www.avtaller.com/`.
2. Scroll to the footer.
3. Identify any navigation links present in the footer.
4. Click each footer link.

**Expected Results:**
- Footer links navigate to their respective pages (Proyectos, El Equipo, Servicios, Contacto).
- Each destination page loads with a 200 status.

---

#### 7.3 Social Media Links Open in New Tab

**Steps:**
1. Navigate to `https://www.avtaller.com/`.
2. Scroll to the footer.
3. Locate any social media icons/links (Instagram, LinkedIn, Behance, WhatsApp, etc.).
4. Check the `target` attribute of each social media link.

**Expected Results:**
- Each social media link has `target="_blank"` and `rel` containing `"noopener"` for security.
- Clicking a social media link opens the correct external profile in a new browser tab without closing the AV Taller site.

---

### 8. Accessibility and Performance

#### 8.1 Page Language Attribute

**Steps:**
1. Navigate to `https://www.avtaller.com/`.
2. Inspect the `<html>` element's `lang` attribute.

**Expected Results:**
- The `lang` attribute is set to `"es"` or `"es-CO"` reflecting the Spanish-language content.

---

#### 8.2 Images Have Alt Text

**Steps:**
1. Navigate to `https://www.avtaller.com/`.
2. Query all `<img>` elements on the page.
3. Navigate to `https://www.avtaller.com/proyectos/tierra-grata/` and repeat.

**Expected Results:**
- Every `<img>` element has a non-empty `alt` attribute.
- Alt text is descriptive (not simply `"image"` or empty strings).

---

#### 8.3 Page Loads Within Acceptable Time

**Steps:**
1. Navigate to `https://www.avtaller.com/`.
2. Measure the time to `DOMContentLoaded` and `load` events.

**Expected Results:**
- `DOMContentLoaded` fires within 5 seconds on a standard broadband connection.
- `load` event fires within 10 seconds.
- No resources return 404 or 5xx errors in the network log.

---

#### 8.4 Viewport Meta Tag (Mobile Ready)

**Steps:**
1. Navigate to `https://www.avtaller.com/`.
2. Inspect the `<head>` for a viewport meta tag.

**Expected Results:**
- A `<meta name="viewport" content="width=device-width, initial-scale=1">` tag (or equivalent) is present.

---

### 9. Cross-Browser and Responsive Layout

#### 9.1 Layout on Desktop (1440 × 900)

**Steps:**
1. Set the viewport to 1440 × 900.
2. Navigate to `https://www.avtaller.com/`.
3. Scroll through the full page.

**Expected Results:**
- No horizontal scrollbar appears.
- Text is legible and no content overflows outside its container.
- Images and layout blocks are correctly proportioned.

---

#### 9.2 Layout on Tablet (768 × 1024)

**Steps:**
1. Set the viewport to 768 × 1024.
2. Navigate to `https://www.avtaller.com/`.
3. Scroll through the full page.

**Expected Results:**
- No horizontal scrollbar appears.
- Navigation adapts correctly (either a full nav bar or a tablet-appropriate collapsed menu).
- Content columns reflow to suit the narrower width without overlapping.

---

#### 9.3 Layout on Mobile (390 × 844 – iPhone 14)

**Steps:**
1. Set the viewport to 390 × 844.
2. Navigate to `https://www.avtaller.com/`.
3. Scroll through the full page.

**Expected Results:**
- No horizontal scrollbar appears.
- A hamburger or toggle menu replaces the desktop navigation bar.
- All text is legible without requiring pinch-to-zoom.
- All buttons and links are at least 44 × 44 CSS pixels (touch-target minimum).

---

## Summary of Pages and Features Covered

| Area | Scenarios |
|---|---|
| Homepage | 1.1 – 1.4 |
| Navigation / Menu | 2.1 – 2.6 |
| Projects listing | 3.1 – 3.2 |
| Project detail page | 3.3 – 3.5 |
| Team page | 4.1 – 4.3 |
| Services page | 5.1 – 5.3 |
| Contact form | 6.1 – 6.6 |
| Footer | 7.1 – 7.3 |
| Accessibility & Performance | 8.1 – 8.4 |
| Responsive layout | 9.1 – 9.3 |
