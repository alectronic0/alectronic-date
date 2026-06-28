# Alec's Dating Application 🎮❤️

A personal website built to help me share who I am with potential partners — skipping the small talk and giving a real, honest picture of what dating me could look like.

Live at: [test.date.alectronic.co](https://test.date.alectronic.co)

---

## What is this?

This is a single-page dating profile / slide deck hosted on GitHub Pages. It covers:

- The basics (who I am, where I live, what I do)
- Photos and notable life moments
- What dating me looks like in practice
- What I'm looking for in a partner
- Date ideas, contact links
- Deeper stuff: personality, hobbies, travel, food, games, goals, warning label

The idea is to give someone a genuine sense of me before we even meet, so conversations can start somewhere real.

---

## Editing content

All site copy is in [`content.md`](content.md) — edit there first, then update `index.html` to match.

Styling lives in [`css/styles.css`](css/styles.css) and interactions in [`js/main.js`](js/main.js);
both are linked from `index.html` (no inline `<style>`/`<script>`).

Photos go in `img/` subfolders (named by section, e.g. `img/food/`, `img/moments/`). Each
deep-dive section pulls images from its matching folder; the `#photos` marquee uses `img/alec/`.

> **Privacy note:** strip GPS/location metadata from any new photo before adding it to `img/` — that folder is served publicly.

---

## Structure

```
.
├── index.html       # Single-page site
├── content.md       # All site text in editable markdown
├── img/             # All photos, grouped by section name
│   ├── alec/        # Photos of Alec (consolidated)
│   ├── basics/
│   ├── moments/
│   ├── other/       # Raw / uncategorised source photos
│   └── ...
├── css/styles.css   # All styling (warm-dark theme, cards, grids, accordion)
├── js/main.js       # Scroll-spy nav, accordion, lightbox
├── CNAME            # Custom domain config for GitHub Pages
└── .nojekyll        # Disables Jekyll so img/ folders are served correctly
```

---

## Deployment

Hosted via GitHub Pages on the `main` branch. Pushes to `main` deploy automatically.

Custom domain: `test.date.alectronic.co` (configured via `CNAME` and DNS).

> `.nojekyll` is required — without it, GitHub Pages' Jekyll build ignores any folder starting with `_` or numeric prefixes.

---

## Contact

Reach me at [date.alec@alectronic.co.uk](mailto:date.alec@alectronic.co.uk) or via the links on the site.
