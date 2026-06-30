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

    // The official multicolour Gmail logo as inline SVG. FontAwesome's free set
    // only ships a generic envelope, so we use the real brand mark for Email
    // links. `cls` sizes it to match whatever icon sits beside it.
    const gmailLogo = (cls) =>
        `<svg class="${cls}" viewBox="52 42 88 66" aria-hidden="true" focusable="false">` +
        '<path fill="#4285f4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6"/>' +
        '<path fill="#34a853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15"/>' +
        '<path fill="#fbbc04" d="M120 64v10l20-15v-3.5c0-9.27-10.58-14.55-18-9l-2 1.5"/>' +
        '<path fill="#ea4335" d="M72 74V48l24 18 24-18v26L96 92"/>' +
        '<path fill="#c5221f" d="M52 55.5V59l20 15V48l-2-1.5c-7.42-5.55-18-.27-18 9"/>' +
        '</svg>';

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

    // Windows Chrome has no flag-emoji font, so 🇬🇷 shows as "GR". Swap a
    // leading flag emoji (two regional-indicator chars) for a real flag image
    // from flagcdn.com. Any other text (including non-flag emoji like 🎄) is
    // returned esc()'d and unchanged, so this is safe to run on every label.
    const flagify = (text) => {
        const s = String(text == null ? '' : text);
        const m = s.match(/^([\u{1F1E6}-\u{1F1FF}]{2})\s*/u);
        if (!m) return esc(s);
        const cc = [...m[1]]
            .map((ch) => String.fromCharCode(ch.codePointAt(0) - 0x1f1e6 + 65))
            .join('')
            .toLowerCase();
        const rest = esc(s.slice(m[0].length));
        return (
            `<img class="flag" src="https://flagcdn.com/24x18/${cc}.png" ` +
            `srcset="https://flagcdn.com/48x36/${cc}.png 2x" width="24" height="18" alt="" loading="lazy">` +
            (rest ? ' ' + rest : '')
        );
    };

    // A tag can be a plain string or { label, variant }
    const tagHtml = (t) => {
        const label = typeof t === 'string' ? t : t.label;
        const variant = typeof t === 'string' ? '' : (t.variant || '');
        return `<span class="tag-item ${variant}">${flagify(label)}</span>`;
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

        // Interest "story" cards — an icon + title, a short "why I like it"
        // paragraph, an optional strip of personal photos, and tag pills. Every
        // field but icon/title is optional, so a card can be photo-rich or just
        // text + tags.
        interestCards: (b) =>
            `<div class="interest-cards">${b.cards
                .map(
                    (c) =>
                        `<div class="interest-card"><div class="interest-card-head"><span class="interest-card-icon">${esc(
                            c.icon
                        )}</span><span class="interest-card-title">${esc(c.title)}</span></div>${
                            c.body ? `<p class="interest-card-body">${esc(c.body)}</p>` : ''
                        }${
                            c.images && c.images.length
                                ? `<div class="interest-card-photos">${c.images
                                      .map((i) => img(i.src, i.alt))
                                      .join('')}</div>`
                                : ''
                        }${
                            c.tags && c.tags.length
                                ? `<div class="tag-row">${c.tags.map(tagHtml).join('')}</div>`
                                : ''
                        }</div>`
                )
                .join('')}</div>`,

        photoGrid: (b) =>
            `<div class="photo-grid">${b.images.map((i) => img(i.src, i.alt)).join('')}</div>`,

        // Movie posters / book covers / game art — 2:3 cards with a title
        posterGrid: (b) =>
            `<div class="poster-grid">${b.posters
                .map(
                    (p) =>
                        `<figure class="poster">${img(p.src, p.title)}<figcaption>${esc(p.title)}</figcaption></figure>`
                )
                .join('')}</div>`,

        // Image + caption cards (Moments, Dislikes) — mirrors the Places pattern
        cardGrid: (b) =>
            `<div class="places-grid">${b.cards
                .map(
                    (c) =>
                        `<div class="place-card">${img(c.src, c.title)}
<!--<a href="${esc(c.href)}" target="_blank">-->
<div class="place-card-body">
<strong>${
                            c.icon ? esc(c.icon) + ' ' : ''
                        }${esc(c.title)}</strong>${
                            c.caption ? `<div class="place-detail">${esc(c.caption)}</div>` : ''
                        }</div>
</div>
<!--</a>-->
`
                )
                .join('')}</div>`,

        // Country place cards (Places visited / to visit)
        placeCards: (b) =>
            `<div class="places-grid">${b.cards
                .map(
                    (c) =>
                        `<div class="place-card">${img(c.src, c.name)}<div class="place-card-body"><strong>${flagify(
                            c.country
                        )} ${esc(c.name)}</strong><div class="place-detail">${esc(c.detail)}</div></div></div>`
                )
                .join('')}</div>`,

        // Image-topped feature cards (Boyfriend mode / Looking for)
        featureGrid: (b) =>
            `<div class="feature-grid">${b.features
                .map(
                    (f) =>
                        `<div class="feature">${img(f.src, f.alt)}<div class="feature-body"><span class="feature-icon">${esc(
                            f.icon
                        )}</span><span class="feature-text">${esc(f.text)}</span></div></div>`
                )
                .join('')}</div>`,

        dateCards: (b) =>
            `<div class="date-menu">${b.cards
                .map(
                    (c) =>
                        `<div class="date-card">${img(c.src, c.alt)}<div class="date-card-body"><h3>${esc(
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
                        `<div class="logo-tile">${img(t.src, t.label)}<span>${esc(t.label)}</span></div>`
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

    // A 🔗 copy-deep-link chip that targets the element id `anchor` (e.g. #dates).
    // Wired up by initDeepLinks(). Returns '' when there's no anchor to point at.
    const headingLink = (anchor, label) =>
        anchor
            ? ` <span class="deep-link" role="button" tabindex="0" data-anchor="${esc(anchor)}" aria-label="Copy link to ${esc(
                label || 'this section'
            )}" title="Copy link to this section">🔗</span>`
            : '';

    // A section header (tag + heading + lead) — only the parts that exist. Lets
    // the headings live in content.js so they can be edited/reordered as data.
    // Deep-dive accordion sections carry none of these, so they render nothing.
    // `anchor` is the enclosing section's id, used for the 🔗 deep link.
    function sectionHeaderHtml(s, anchor) {
        let h = '';
        if (s.tag) h += `<div class="section-tag ${esc(s.tagClass || 'tag-purple')}">${esc(s.tag)}</div>`;
        if (s.heading) h += `<h2>${esc(s.heading)}${headingLink(anchor, s.heading)}</h2>`;
        if (s.lead) h += `<p class="lead">${esc(s.lead)}</p>`;
        return h;
    }

    // Every [data-section="key"] gets the section header + blocks rendered into it.
    function renderSections() {
        if (!C || !C.sections) return;
        document.querySelectorAll('[data-section]').forEach((el) => {
            const key = el.getAttribute('data-section');
            const section = C.sections[key];
            if (!section) return; // some data-sections (hero/contact) are handled separately
            const host = el.closest('[id]'); // the enclosing <section> / <article>
            el.innerHTML = sectionHeaderHtml(section, host ? host.id : '') + renderBlocks(section.blocks);
        });
    }

    // Build the deep-dive accordion shell from CONTENT.accordion. Each card gets
    // id=key so a URL hash (…#food) can open it; its body is a data-section
    // container that renderSections() fills afterwards.
    function renderAccordion() {
        if (!C || !C.accordion) return;
        const wrap = document.querySelector('.accordion');
        if (!wrap) return;
        wrap.innerHTML = C.accordion
            .map(
                (a) =>
                    `<article class="acc-item" id="${esc(a.key)}">` +
                    '<button class="acc-header" aria-expanded="false">' +
                    `<span class="acc-emoji">${esc(a.emoji)}</span>` +
                    `<span class="acc-title">${esc(a.title)}${
                        a.hint ? ` <span class="acc-hint">${esc(a.hint)}</span>` : ''
                    }</span>` +
                    `<span class="acc-link" role="button" tabindex="0" aria-label="Copy link to ${esc(
                        a.title
                    )}" title="Copy link to this section">🔗</span>` +
                    '<span class="acc-chevron">▾</span>' +
                    '</button>' +
                    `<div class="acc-body"><div class="acc-body-inner"><div class="acc-content" data-section="${esc(
                        a.key
                    )}"></div></div></div>` +
                    '</article>'
            )
            .join('');
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
        setHtml('[data-profile="name"]', esc(p.name) + headingLink('about', p.name));
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
        setHtml('[data-faces="header"]', sectionHeaderHtml(C.faces, 'photos'));
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
        if (l.icon === 'gmail') return gmailLogo(cls);
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
        const host = document.querySelector(sel);
        const anchor = host ? (host.closest('[id]') || {}).id || '' : '';
        const html =
            (data.tag ? `<div class="section-tag tag-purple">${esc(data.tag)}</div>` : '') +
            `<h2>${esc(data.heading)}${headingLink(anchor, data.heading)}</h2>` +
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

    // The canonical, hash-free URL to share. Falls back to the live domain when
    // the page is opened from disk (file://) so share links are never broken.
    const shareUrl = () => {
        const here = location.href.split('#')[0];
        return /^https?:/.test(here) ? here : 'https://date.alectronic.co/';
    };

    // Turn a share `type` + the page url/text into a service share link.
    // `copy` and `native` have no URL — they're handled by initShare().
    function buildShareUrl(type, url, text) {
        const u = encodeURIComponent(url);
        const t = encodeURIComponent(text);
        const tu = encodeURIComponent(text + ' ' + url);
        switch (type) {
            case 'email':
                return `mailto:?subject=${t}&body=${tu}`;
            case 'whatsapp':
                return `https://wa.me/?text=${tu}`;
            case 'twitter':
                return `https://twitter.com/intent/tweet?text=${t}&url=${u}`;
            case 'facebook':
                return `https://www.facebook.com/sharer/sharer.php?u=${u}`;
            case 'linkedin':
                return `https://www.linkedin.com/sharing/share-offsite/?url=${u}`;
            case 'telegram':
                return `https://t.me/share/url?url=${u}&text=${t}`;
            case 'reddit':
                return `https://www.reddit.com/submit?url=${u}&title=${t}`;
            default:
                return '';
        }
    }

    // "Not your vibe? Share with a friend" card — share buttons for each option
    // in CONTENT.share. Copy/native are buttons; the rest are real share links.
    function renderShare() {
        if (!C || !C.share) return;
        const s = C.share;
        const url = shareUrl();
        const text = s.text || '';

        const icon = (o) =>
            o.icon === 'gmail'
                ? gmailLogo('share-logo')
                : `<i class="${esc(o.icon || '')}" aria-hidden="true"></i>`;
        const optionHtml = (o) => {
            if (o.type === 'copy') {
                return `<button type="button" class="share-btn share-${esc(o.type)}" data-copy="${esc(
                    url
                )}">${icon(o)}<span>${esc(o.label)}</span></button>`;
            }
            const href = buildShareUrl(o.type, url, text);
            const target = o.type === 'email' ? '' : ' target="_blank" rel="noopener"';
            return `<a class="share-btn share-${esc(o.type)}" href="${esc(
                href
            )}"${target}>${icon(o)}<span>${esc(o.label)}</span></a>`;
        };

        // A prominent "Share…" button using the device's native share sheet —
        // only shown when the browser supports it (mostly mobile). initShare wires it.
        const nativeBtn = navigator.share
            ? `<button type="button" class="share-btn share-native primary"><i class="fa-solid fa-share-nodes" aria-hidden="true"></i><span>Share…</span></button>`
            : '';

        const html =
            (s.tag ? `<div class="section-tag tag-rose">${esc(s.tag)}</div>` : '') +
            `<h2>${esc(s.heading)}</h2>` +
            `<p class="lead">${esc(s.lead)}</p>` +
            `<div class="share-links">${nativeBtn}${s.options.map(optionHtml).join('')}</div>`;
        setHtml('[data-share="share"]', html);
    }

    /* ── Prompt cards (ice-breaker questions) ──
       Draw a few of Alec's go-to questions at random from CONTENT.prompts and
       offer to mail the answers back. Re-rolled by the 🎲 shuffle button. */

    // Fisher–Yates shuffle, then take the first `n` — `n` distinct random items.
    const sample = (arr, n) => {
        const pool = arr.slice();
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        return pool.slice(0, Math.max(0, Math.min(n, pool.length)));
    };

    // The email to reach Alec — explicit in content, else taken from the first
    // mailto: in the contact links so it stays a single source of truth.
    const promptEmail = (p) => {
        if (p.email) return p.email;
        const links = (C.contact && C.contact.links) || [];
        const m = links.find((l) => /^mailto:/i.test(l.href || ''));
        return m ? m.href.replace(/^mailto:/i, '').split('?')[0] : '';
    };

    // A mailto: whose body lists the given questions with room to answer.
    const promptMailto = (p, questions) => {
        const intro = p.emailIntro ? p.emailIntro + '\n\n' : '';
        const body = intro + questions.map((q, i) => `${i + 1}. ${q}\n\n\n`).join('');
        const subject = encodeURIComponent(p.emailSubject || document.title);
        return `mailto:${promptEmail(p)}?subject=${subject}&body=${encodeURIComponent(body)}`;
    };

    // Pick a fresh set of questions and sync the "answer" button's mailto to them.
    function drawPrompts() {
        if (!C || !C.prompts) return;
        const p = C.prompts;
        const picks = sample(p.questions || [], p.count || 3);
        const cards = picks
            .map(
                (q, i) =>
                    `<li class="prompt-card"><span class="prompt-num">${i + 1}</span>` +
                    `<span class="prompt-q">${esc(q)}</span></li>`
            )
            .join('');
        setHtml('[data-prompts="cards"]', cards);
        const answer = document.querySelector('.prompt-answer');
        if (answer) answer.setAttribute('href', promptMailto(p, picks));
    }

    function renderPrompts() {
        if (!C || !C.prompts) return;
        const p = C.prompts;
        const host = document.querySelector('[data-prompts="root"]');
        const anchor = host ? (host.closest('[id]') || {}).id || '' : '';
        const html =
            (p.tag ? `<div class="section-tag tag-gold">${esc(p.tag)}</div>` : '') +
            `<h2>${esc(p.heading)}${headingLink(anchor, p.heading)}</h2>` +
            `<p class="lead">${esc(p.lead)}</p>` +
            `<ol class="prompt-cards" data-prompts="cards"></ol>` +
            `<div class="prompt-actions">` +
            `<button type="button" class="prompt-shuffle"><i class="fa-solid fa-shuffle" aria-hidden="true"></i>` +
            `<span>${esc(p.shuffleLabel || 'Shuffle')}</span></button>` +
            `<a class="prompt-answer" href="#"><i class="fa-solid fa-paper-plane" aria-hidden="true"></i>` +
            `<span>${esc(p.answerLabel || 'Send me your answers')}</span></a>` +
            `</div>`;
        setHtml('[data-prompts="root"]', html);
        drawPrompts();
    }

    function initPrompts() {
        const btn = document.querySelector('.prompt-shuffle');
        if (!btn || btn._listenerAttached) return;
        btn.addEventListener('click', drawPrompts);
        btn._listenerAttached = true;
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

    // Full deep-link URL for a card id, base-relative so it works on file:// too.
    const linkFor = (id) => location.href.split('#')[0] + (id ? '#' + id : '');

    function openItem(item) {
        if (!item) return;
        item.classList.add('open');
        const header = item.querySelector('.acc-header');
        if (header) header.setAttribute('aria-expanded', 'true');
    }

    // Copy text to the clipboard, with a tiny ✓ flash on the 🔗 button. Falls
    // back to a hidden textarea for non-secure contexts (e.g. file://).
    function copyLink(url, el) {
        const flash = () => {
            el.classList.add('copied');
            el.textContent = '✓';
            setTimeout(() => {
                el.textContent = '🔗';
                el.classList.remove('copied');
            }, 1200);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(flash, () => fallbackCopy(url, flash));
        } else {
            fallbackCopy(url, flash);
        }
    }

    function fallbackCopy(text, done) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            if (done) done();
        } catch (e) {
            /* clipboard unavailable — silently skip */
        }
        document.body.removeChild(ta);
    }

    function initAccordion() {
        document.querySelectorAll('.acc-item').forEach((item) => {
            const header = item.querySelector('.acc-header');
            if (!header) return;
            item.classList.remove('open');
            header.setAttribute('aria-expanded', 'false');

            if (!header._listenerAttached) {
                header.addEventListener('click', () => {
                    const isOpen = item.classList.toggle('open');
                    header.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                    // Reflect the open card in the URL so a refresh returns here.
                    if (isOpen && item.id) history.replaceState(null, '', '#' + item.id);
                });
                header._listenerAttached = true;
            }

            // 🔗 button: open the card, point the URL at it, copy the deep link.
            const link = item.querySelector('.acc-link');
            if (link && !link._listenerAttached) {
                const activate = (e) => {
                    e.preventDefault();
                    e.stopPropagation(); // don't toggle the card underneath
                    openItem(item);
                    if (item.id) history.replaceState(null, '', '#' + item.id);
                    copyLink(linkFor(item.id), link);
                };
                link.addEventListener('click', activate);
                link.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') activate(e);
                });
                link._listenerAttached = true;
            }
        });
    }

    // Open (and scroll to) the accordion card named in the URL hash, e.g. …#food.
    // Runs on load and on hashchange (e.g. clicking a #food anchor elsewhere).
    function openFromHash() {
        const id = decodeURIComponent((location.hash || '').replace(/^#/, ''));
        if (!id) return;
        const item = document.getElementById(id);
        if (!item || !item.classList.contains('acc-item')) return;
        openItem(item);
        requestAnimationFrame(() => item.scrollIntoView({behavior: 'smooth', block: 'start'}));
    }

    // Section-heading 🔗 chips: point the URL at the section's id and copy the
    // deep link. Native browser scrolling handles the jump on the next load.
    function initDeepLinks() {
        document.querySelectorAll('.deep-link').forEach((link) => {
            if (link._listenerAttached) return;
            const activate = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const id = link.getAttribute('data-anchor');
                if (id) history.replaceState(null, '', '#' + id);
                copyLink(linkFor(id), link);
            };
            link.addEventListener('click', activate);
            link.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') activate(e);
            });
            link._listenerAttached = true;
        });
    }

    // Share card: wire the native "Share…" button and the "Copy link" button.
    function initShare() {
        const native = document.querySelector('.share-native');
        if (native && navigator.share && !native._listenerAttached) {
            native.addEventListener('click', () => {
                const s = C.share || {};
                navigator
                    .share({title: document.title, text: s.text || '', url: shareUrl()})
                    .catch(() => {}); // user cancelled or unsupported — ignore
            });
            native._listenerAttached = true;
        }

        document.querySelectorAll('.share-btn[data-copy]').forEach((btn) => {
            if (btn._listenerAttached) return;
            const span = btn.querySelector('span');
            btn.addEventListener('click', () => {
                const done = () => {
                    if (!span) return;
                    const original = span.textContent;
                    btn.classList.add('copied');
                    span.textContent = 'Copied!';
                    setTimeout(() => {
                        span.textContent = original;
                        btn.classList.remove('copied');
                    }, 1200);
                };
                const url = btn.getAttribute('data-copy');
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(url).then(done, () => fallbackCopy(url, done));
                } else {
                    fallbackCopy(url, done);
                }
            });
            btn._listenerAttached = true;
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
            '[data-zoom], .mosaic-strip img, .poster-grid img, .photo-grid img, .feature img, .date-card img, .place-card img, .logo-tile img, .interest-card-photos img';

        // Delegated so it covers images injected after load.
        document.addEventListener('click', (e) => {
            const img = e.target.closest(selectors);
            if (!img || e.target.tagName !== 'IMG') return;
            if (img.classList.contains('flag')) return; // tiny inline flags aren't zoomable
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
                // Favicons & flags are decorative — just hide a broken one rather than show a box.
                if (
                    el.classList.contains('link-chip-favicon') ||
                    el.classList.contains('contact-favicon') ||
                    el.classList.contains('footer-favicon') ||
                    el.classList.contains('flag')
                ) {
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
        renderAccordion();
        renderSections();
        renderPrompts();
        renderConnectCard(C.contact, '[data-connect="contact"]');
        renderShare();
        renderConnectCard(C.outro, '[data-connect="outro"]');
        renderFooterLinks();

        initScrollSpy();
        initAccordion();
        initDeepLinks();
        initShare();
        initPrompts();
        initLightbox();

        openFromHash();
        window.addEventListener('hashchange', openFromHash);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
