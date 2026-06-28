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

    // Resolve a favicon for a URL's domain. Uses Google's favicon service so
    // every external service gets a crisp icon without hardcoding each one.
    const faviconFor = (url) => {
        try {
            const host = new URL(url).hostname; // '' for mailto: etc.
            return host ? `https://www.google.com/s2/favicons?domain=${host}&sz=64` : '';
        } catch (e) {
            return '';
        }
    };

    // A white SVG placeholder showing the alt text — used when an image is
    // missing, so gaps are visible (and fillable) rather than blank.
    const placeholderSvg = (text) => {
        const label = esc(text || '?????');
        const svg =
            '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">' +
            '<rect width="100%" height="100%" fill="#ffffff"/>' +
            '<text x="50%" y="35%" ' +
            'font-family="Poppins, system-ui, sans-serif" font-size="42" fill="#777" ' +
            'text-anchor="middle" dominant-baseline="middle">' +
            '404' +
            '</text>' +
            '<text x="50%" y="50%" ' +
            'font-family="Poppins, system-ui, sans-serif" font-size="42" ' +
            'fill="#777" ' +
            'text-anchor="middle" ' +
            'dominant-baseline="middle">' +
            '(' + label + ')' +
            '</text>' +
            '<text x="50%" y="65%" ' +
            'font-family="Poppins, system-ui, sans-serif" font-size="42" ' +
            'fill="#777" ' +
            'text-anchor="middle" ' +
            'dominant-baseline="middle">' +
            'Image not found' +
            '</text>' +
            '</svg>';
        return 'data:image/svg+xml,' + encodeURIComponent(svg);
    };

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

        // External link as a favicon chip ("🟢 Check out my Spotify →").
        // `icon` may be an explicit favicon URL; otherwise it's derived from the domain.
        link: (b) =>
            `<a class="link-chip" href="${esc(b.href)}" target="_blank" rel="noopener"><img class="link-chip-favicon" src="${esc(
                b.icon || faviconFor(b.href)
            )}" alt="" loading="lazy">${esc(b.label)} →</a>`,

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
        setHtml('[data-profile="facts"]', p.facts.map(factHtml).join(''));
    }

    // A fact value may be: a plain string, an array (one line each),
    // and/or carry an `href` to render the value as a link.
    function factValue(f) {
        const linkify = (text) =>
            f.href
                ? `<a class="fact-link" href="${esc(f.href)}" target="_blank" rel="noopener">${esc(text)}</a>`
                : esc(text);

        if (Array.isArray(f.value)) {
            return `<div class="fact-value fact-multiline">${f.value
                .map((v) => `<div>${linkify(String(v).trim())}</div>`)
                .join('')}</div>`;
        }
        return `<div class="fact-value">${linkify(f.value)}</div>`;
    }

    function factHtml(f) {
        return `<div class="fact${f.wide ? ' wide' : ''}"><span class="fact-icon">${esc(
            f.icon
        )}</span><div><div class="fact-label">${esc(f.label)}</div>${factValue(f)}</div></div>`;
    }

    function renderFaces() {
        if (!C || !C.faces) return;
        const photos = C.faces.photos;
        // Duplicate the set so the marquee can loop seamlessly (track animates -50%).
        const once = photos.map((p) => img(p.src, p.alt)).join('');
        const twice = photos.map((p) => img(p.src, '', 'aria-hidden="true"')).join('');
        setHtml('[data-faces="track"]', once + twice);
    }

    // A link's icon: prefer the site favicon, fall back to the emoji `icon` when
    // no domain favicon exists (e.g. the mailto: Email link). `cls` lets each
    // context (button vs footer) size its own favicon.
    const linkIcon = (l, cls) => {
        const fav = l.favicon || faviconFor(l.href);
        return fav
            ? `<img class="${cls}" src="${esc(fav)}" alt="" loading="lazy">`
            : `<span class="contact-emoji">${esc(l.icon || '')}</span>`;
    };

    // Open external links in a new tab; keep mailto in place.
    const linkTarget = (href) =>
        href.startsWith('mailto:') ? '' : ' target="_blank" rel="noopener"';

    // Shared "let's connect" card — used by both #contact and #outro. Same
    // component, different title/text. A card with no `links` reuses
    // contact.links so the buttons stay a single source of truth.
    function renderConnectCard(data, sel) {
        if (!data) return;
        const linkHtml = (l) =>
            `<a class="contact-btn${l.primary ? ' primary' : ''}" href="${esc(l.href)}"${linkTarget(
                l.href
            )}>${linkIcon(l, 'contact-favicon')} ${esc(l.label)}</a>`;

        const links = data.links && data.links.length ? data.links : (C.contact ? C.contact.links : []);
        const html =
            (data.tag ? `<div class="section-tag tag-purple">${esc(data.tag)}</div>` : '') +
            `<h2>${esc(data.heading)}</h2>` +
            `<p class="lead">${esc(data.lead)}</p>` +
            `<div class="contact-links">${links.map(linkHtml).join('')}</div>`;
        setHtml(sel, html);
    }

    // Footer links — same contact.links data, lighter text-link styling.
    function renderFooterLinks() {
        if (!C || !C.contact) return;
        const linkHtml = (l) =>
            `<a href="${esc(l.href)}"${linkTarget(l.href)}>${linkIcon(l, 'footer-favicon')}<span>${esc(
                l.label
            )}</span></a>`;
        setHtml('[data-footer="links"]', C.contact.links.map(linkHtml).join(''));
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
                    active.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'center'});
                });
            },
            {rootMargin: '-40% 0px -55% 0px'}
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

    // Swap any image that fails to load for a white placeholder showing its alt
    // text. Registered before render (capture phase, since error doesn't bubble)
    // so it also catches images injected by the renderers.
    function initImageFallback() {
        document.addEventListener(
            'error',
            (e) => {
                const el = e.target;
                if (!el || el.tagName !== 'IMG') return;
                if (el.dataset.fallback) return; // guard against loops
                el.dataset.fallback = '1';
                // Favicons are decorative — just hide a broken one rather than show a box.
                if (el.classList.contains('link-chip-favicon') || el.classList.contains('contact-favicon')) {
                    el.style.display = 'none';
                    return;
                }
                el.classList.add('img-missing');
                el.src = placeholderSvg(el.alt);
            },
            true
        );
    }

    /* ── boot ── */
    function boot() {
        if (!C) {
            console.error('content.js did not load — window.CONTENT is undefined.');
            return;
        }
        initImageFallback();
        renderHero();
        renderProfile();
        renderFaces();
        renderSections();
        renderConnectCard(C.contact, '[data-connect="contact"]');
        renderConnectCard(C.outro, '[data-connect="outro"]');

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
