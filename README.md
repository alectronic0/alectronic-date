# Alec's Dating Application 🎮❤️

A personal website built to help me share who I am with potential partners — skipping the small talk and giving a real, honest picture of what dating me could look like.

**🔗 Official site: [date.alectronic.co](https://date.alectronic.co)**

---

## What is this?

This is a single-page dating profile / slide deck for **Alec Doran-Twyford** — a loveable nerd and Software Engineer based in Welwyn Garden City, "looking for his player 2. No swiping required." It's hosted on GitHub Pages and gives someone a genuine sense of me before we even meet, so conversations can start somewhere real.

The page walks through:

- **Who I Am** — the basics: profession, age, pronouns, nationality, location and more
- **Faces** — a marquee of photos from my life
- **What I Can Be** — what dating me could actually look like
- **Looking For** — what I hope to find in a partner (an invitation, not a checklist)
- **Date Ideas** — pick our first adventure: foodie, chill, active, intellectual, creative or a video-game session
- **Contact** — email, Linktree, Instagram, LinkedIn and Telegram
- **The Deep Dive** — a grid of topic buttons that pop up modals with everything else: notable moments, personality & a week in the life (coming soon), radical transparency / growth, hobbies, bucket list, places, movies & TV, video games, food, music (with embedded Spotify playlists), books, podcasts, sports, politics & religion, gentle dislikes, future goals, plus favourite plants & creatures

There's also a floating 🎧 **site soundtrack** player (bottom corner) with a cosy gaming-lofi playlist to scroll to.

---

## Editing content

All site copy is the single source of truth in [`content.js`](content.js) — it sets `window.CONTENT`, and [`main.js`](main.js) reads it and renders the page from data (no `fetch`, so it also works when opening `index.html` directly via `file://`).

Most sections are arrays of typed "blocks" (e.g. `paragraph`, `photoGrid`, `cardGrid`, `featureGrid`, `posterGrid`, `link`). To add or duplicate a section, copy a block and change its data — no HTML/JS edits needed.

Styling lives in [`styles.css`](styles.css) and interactions (scroll-spy nav, deep-dive modals, lightbox, soundtrack player) in [`main.js`](main.js); both are linked from `index.html` (no inline `<style>`/`<script>`).

Photos go in `img/` subfolders (named by section, e.g. `img/moments/`, `img/dates/`). Each deep-dive section pulls images from its matching folder; the `#photos` marquee uses `img/alec/`.

> **Privacy note:** strip GPS/location metadata from any new photo before adding it to `img/` — that folder is served publicly.

---

## Automated Poster Generator

You can automatically generate marketing materials (OG images, TikTok/IG Reels, IG Posts, and physical posters with a QR code) directly from the site's hero content.

1. `cd scripts/poster`
2. `npm install`
3. `npm run generate`

This uses Playwright to render `poster.html` and saves high-resolution JPGs into the `/outputs` folder. The print format automatically injects a scannable QR code directing people to the site.

---

## Structure

```
.
├── index.html       # Single-page site (shell; content is injected by main.js)
├── content.js       # All site content as data (window.CONTENT) — edit here first
├── main.js          # Renders content, scroll-spy nav, deep-dive modals, lightbox
├── styles.css       # All styling (warm-dark theme, cards, grids, modals)
├── img/             # All photos, grouped by section name
│   ├── alec/        # Photos of Alec (hero + faces marquee)
│   ├── moments/
│   ├── dates/
│   ├── bucket-list/
│   ├── movies-tv/
│   └── ...
├── CNAME            # Custom domain config for GitHub Pages
└── .nojekyll        # Disables Jekyll so img/ folders are served correctly
```

---

## Deployment

Hosted via GitHub Pages on the `main` branch. Pushes to `main` deploy automatically.

Custom domain: **[date.alectronic.co](https://date.alectronic.co)** (configured via `CNAME` and DNS).

> `.nojekyll` is required — without it, GitHub Pages' Jekyll build ignores any folder starting with `_` or numeric prefixes.

---

## Contact

Reach me at [date.alec@alectronic.co.uk](mailto:date.alec@alectronic.co.uk) or via the links on the site — [Linktree](https://linktr.ee/Alectronic), [Instagram](https://www.instagram.com/alectronic0/), [LinkedIn](https://www.linkedin.com/in/alectronic0/) and [Telegram](https://t.me/alectronic0).
