# Site Refactoring Summary

This document describes the architectural changes made to standardize the Alec's Dating Application project.

## MVC Architecture
- **Model** (`js/content.js`): All page copy, structured data, and configuration live here. HTML files no longer contain hardcoded data, functioning purely as layout templates.
- **View** (`.html` files): Simple, consistent markup that relies on CSS for styling and JS for data population. Structural components (header, nav, footer) have been unified.
- **Controller** (`js/app.js`): Handles the logic to read from the Model and inject data into the View, as well as managing interactions (modals, scroll spy, dynamic layout injection).

## Unified Layout Injection
To avoid duplicating the site layout across multiple pages (`index.html`, `404.html`, `cookies.html`, etc.), the `app.js` script dynamically injects the shared `<header>`, `<nav>`, and `<footer>` elements on load. Pages only need to include the core layout tags or wait for `app.js` to build them.

## Cookie Consent Strategy
The site now uses a unified `js/cookie.js` that contains both the Vanilla CookieConsent library (v3) and its configuration setup. This replaces multiple scattered scripts and centralizes cookie management logic, maintaining GDPR compliance without clutter.
