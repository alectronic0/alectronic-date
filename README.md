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

Photos go in `img/` subfolders (named by section, e.g. `img/basics/`, `img/moments/`). The gallery section (`#photos`) expects images added manually to the `<div class="photo-flow">` in `index.html`.

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
├── css/             # Stylesheets (if split out)
├── js/              # Scripts (if split out)
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
