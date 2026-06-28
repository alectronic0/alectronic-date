/* ============================================================
   Alec's Dating Application — renderer + interactions
   ------------------------------------------------------------
   Reads window.CONTENT (from content.js) and builds the page,
   then wires up scroll-spy, the accordion and the lightbox.

   Rendering is data-driven: most sections are an array of typed
   "blocks" (see content.js). Each block type has a small renderer
   below; renderBlocks() routes by type. Adding a section is just
   adding data + a <… data-section="key"> container in index.html.
   ============================================================ */

(function () {
  'use strict';

  const C = window.CONTENT;

  /* ── tiny helpers ── */
  const esc = (s) =>
    String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const img = (src, alt, attrs = '') =>
    `<img src="${esc(src)}" alt="${esc(alt || '')}" loading="lazy" ${attrs}>`;

  // A tag can be a plain string or { label, variant }
  const tagHtml = (t) => {
    const label = typeof t === 'string' ? t : t.label;
    const variant = typeof t === 'string' ? '' : (t.variant || '');
    return `<span class="tag-item ${variant}">${esc(label)}</span>`;
  };

  /* ── block renderers (each returns an HTML string) ── */
  const blocks = {
    paragraph: (b) => `<p>${b.html ? b.html : esc(b.text)}</p>`,

    heading: (b) => `<h3>${esc(b.text)}</h3>`,

    note: (b) => `<div class="${esc(b.variant || 'growth-note')}">${esc(b.text)}</div>`,

    link: (b) =>
      `<a class="inline-link" href="${esc(b.href)}" target="_blank" rel="noopener">${esc(b.label)} →</a>`,

    tagRow: (b) => `<div class="tag-row">${b.tags.map(tagHtml).join('')}</div>`,

    photoGrid: (b) =>
      `<div class="photo-grid">${b.images.map((i) => img(i.src, i.alt)).join('')}</div>`,

    // Movie posters / book covers / game art — 2:3 cards with a title
    posterGrid: (b) =>
      `<div class="poster-grid">${b.posters
        .map(
          (p) =>
            `<figure class="poster">${img(p.image, p.title)}<figcaption>${esc(p.title)}</figcaption></figure>`
        )
        .join('')}</div>`,

    // Image + caption cards (Moments, Dislikes) — mirrors the Places pattern
    cardGrid: (b) =>
      `<div class="places-grid">${b.cards
        .map(
          (c) =>
            `<div class="place-card">${img(c.image, c.title)}<div class="place-card-body"><strong>${
              c.icon ? esc(c.icon) + ' ' : ''
            }${esc(c.title)}</strong>${
              c.caption ? `<div class="place-detail">${esc(c.caption)}</div>` : ''
            }</div></div>`
        )
        .join('')}</div>`,

    // Country place cards (Places visited / to visit)
    placeCards: (b) =>
      `<div class="places-grid">${b.cards
        .map(
          (c) =>
            `<div class="place-card">${img(c.image, c.name)}<div class="place-card-body"><strong>${esc(
              c.country
            )} ${esc(c.name)}</strong><div class="place-detail">${esc(c.detail)}</div></div></div>`
        )
        .join('')}</div>`,

    // Image-topped feature cards (Boyfriend mode / Looking for)
    featureGrid: (b) =>
      `<div class="feature-grid">${b.features
        .map(
          (f) =>
            `<div class="feature">${img(f.image, f.alt)}<div class="feature-body"><span class="feature-icon">${esc(
              f.icon
            )}</span><span class="feature-text">${esc(f.text)}</span></div></div>`
        )
        .join('')}</div>`,

    dateCards: (b) =>
      `<div class="date-menu">${b.cards
        .map(
          (c) =>
            `<div class="date-card">${img(c.image, c.alt)}<div class="date-card-body"><h3>${esc(
              c.title
            )}</h3><div class="date-pills">${c.pills
              .map((p) => `<span class="pill">${esc(p)}</span>`)
              .join('')}</div></div></div>`
        )
        .join('')}</div>`,

    valueCols: (b) =>
      `<div class="value-cols">${b.columns
        .map(
          (col) =>
            `<div class="value-card"><h3>${esc(col.title)}</h3><ul>${col.items
              .map((i) => `<li>${esc(i)}</li>`)
              .join('')}</ul></div>`
        )
        .join('')}</div>`,

    // Two columns, each holding one or more titled lists (gold bullets)
    listCols: (b) =>
      `<div class="two-cols">${b.columns
        .map(
          (col) =>
            `<div class="list-block">${col.groups
              .map(
                (g) =>
                  `<h3>${esc(g.title)}</h3><ul>${g.items
                    .map((i) => `<li>${esc(i)}</li>`)
                    .join('')}</ul>`
              )
              .join('')}</div>`
        )
        .join('')}</div>`,

    personaCards: (b) =>
      `<div class="persona-cards">${b.cards
        .map(
          (c) =>
            `<div class="persona-card"><div class="p-icon">${esc(c.icon)}</div><div class="p-title">${esc(
              c.title
            )}</div><div class="p-desc">${esc(c.desc)}</div></div>`
        )
        .join('')}</div>`,

    loveLangs: (b) =>
      `<div class="love-langs">${b.langs
        .map(
          (l) => `<div class="love-lang"><small>${esc(l.tier)}</small>${esc(l.label)}</div>`
        )
        .join('')}</div>`,

    podcastCards: (b) =>
      `<div class="podcast-cards">${b.cards
        .map(
          (c) =>
            `<div class="podcast-card"><img class="podcast-logo" src="${esc(c.logo)}" alt="${esc(
              c.title
            )}" loading="lazy"><div><strong>${esc(c.title)}</strong><p>${esc(
              c.description
            )}</p></div></div>`
        )
        .join('')}</div>`,

    logoGrid: (b) =>
      `<div class="logo-grid">${b.tiles
        .map(
          (t) =>
            `<div class="logo-tile">${img(t.image, t.label)}<span>${esc(t.label)}</span></div>`
        )
        .join('')}</div>`,

    detailList: (b) =>
      `<div class="detail-list">${b.items
        .map(
          (d) =>
            `<div class="detail-item"><span class="detail-icon">${esc(
              d.icon
            )}</span><div class="detail-text"><strong>${esc(d.title)}</strong>${esc(
              d.description
            )}</div></div>`
        )
        .join('')}</div>`
  };

  function renderBlocks(list) {
    return (list || [])
      .map((b) => {
        const fn = blocks[b.type];
        if (!fn) {
          console.warn(`Unknown block type: ${b.type}`);
          return '';
        }
        return fn(b);
      })
      .join('');
  }

  /* ── section-level renderers ── */

  // Every [data-section="key"] gets CONTENT.sections[key].blocks rendered into it.
  function renderSections() {
    if (!C || !C.sections) return;
    document.querySelectorAll('[data-section]').forEach((el) => {
      const key = el.getAttribute('data-section');
      const section = C.sections[key];
      if (!section) return; // some data-sections (hero/contact) are handled separately
      el.innerHTML = renderBlocks(section.blocks);
    });
  }

  function setText(sel, value) {
    const el = document.querySelector(sel);
    if (el) el.textContent = value;
  }
  function setHtml(sel, value) {
    const el = document.querySelector(sel);
    if (el) el.innerHTML = value;
  }

  function renderHero() {
    if (!C || !C.hero) return;
    const h = C.hero;
    setText('[data-hero="emoji"]', h.emoji);
    setHtml('[data-hero="headline"]', h.headline);
    setText('[data-hero="sub"]', h.subheading);
    setText('[data-hero="tagline"]', h.tagline);
    setText('[data-hero="cta"]', h.cta);
    setHtml('[data-hero="media"]', h.images.map((i) => img(i.src, i.alt)).join(''));
  }

  function renderProfile() {
    if (!C || !C.profile) return;
    const p = C.profile;
    setText('[data-profile="name"]', p.name);
    setText('[data-profile="tagline"]', p.tagline);
    setHtml('[data-profile="intro"]', p.intro.map((t) => `<p>${esc(t)}</p>`).join(''));
    setHtml('[data-profile="photo"]', img(p.photo.src, p.photo.alt, 'data-zoom'));
    setHtml(
      '[data-profile="facts"]',
      p.facts
        .map(
          (f) =>
            `<div class="fact${f.wide ? ' wide' : ''}"><span class="fact-icon">${esc(
              f.icon
            )}</span><div><div class="fact-label">${esc(f.label)}</div><div class="fact-value">${esc(
              f.value
            )}</div></div></div>`
        )
        .join('')
    );
  }

  function renderFaces() {
    if (!C || !C.faces) return;
    const photos = C.faces.photos;
    // Duplicate the set so the marquee can loop seamlessly (track animates -50%).
    const once = photos.map((p) => img(p.src, p.alt)).join('');
    const twice = photos.map((p) => img(p.src, '', 'aria-hidden="true"')).join('');
    setHtml('[data-faces="track"]', once + twice);
  }

  function renderContact() {
    if (!C || !C.contact) return;
    const linkHtml = (l) =>
      `<a class="contact-btn${l.primary ? ' primary' : ''}" href="${esc(l.href)}"${
        l.href.startsWith('mailto:') ? '' : ' target="_blank" rel="noopener"'
      }>${esc(l.icon)} ${esc(l.label)}</a>`;
    setHtml('[data-contact="links"]', C.contact.links.map(linkHtml).join(''));
  }

  /* ============================================================
     Interactions (run AFTER render so the DOM exists)
     ============================================================ */

  function initScrollSpy() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    if (!navLinks.length || !sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((a) => a.classList.remove('active'));
          const active = document.querySelector(`nav a[href="#${entry.target.id}"]`);
          if (!active) return;
          active.classList.add('active');
          active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
  }

  function initAccordion() {
    document.querySelectorAll('.acc-item').forEach((item) => {
      const header = item.querySelector('.acc-header');
      if (!header) return;
      item.classList.remove('open');
      header.setAttribute('aria-expanded', 'false');
      if (header._listenerAttached) return;
      header.addEventListener('click', () => {
        const isOpen = item.classList.toggle('open');
        header.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
      header._listenerAttached = true;
    });
  }

  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (!lightbox || !lightboxImg) return;

    const close = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };
    lightbox.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });

    const selectors =
      '[data-zoom], .mosaic-strip img, .poster-grid img, .photo-grid img, .feature img, .date-card img, .place-card img, .logo-tile img';

    // Delegated so it covers images injected after load.
    document.addEventListener('click', (e) => {
      const img = e.target.closest(selectors);
      if (!img || e.target.tagName !== 'IMG') return;
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  /* ── boot ── */
  function boot() {
    if (!C) {
      console.error('content.js did not load — window.CONTENT is undefined.');
      return;
    }
    renderHero();
    renderProfile();
    renderFaces();
    renderSections();
    renderContact();

    initScrollSpy();
    initAccordion();
    initLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
