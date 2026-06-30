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

    // Derive readable alt text from a descriptive filename when none is given
    // (e.g. "img/moments/alec-at-graduation.png" -> "Alec at graduation").
    // Numeric-only names (the faces marquee) fall back to a generic label.
    const altFromSrc = (src) => {
        const base = String(src == null ? '' : src)
            .split('/').pop()
            .replace(/\.[a-z0-9]+$/i, '')
            .replace(/[-_]+/g, ' ')
            .trim();
        if (!base || /^\d+$/.test(base)) return 'Alec Doran-Twyford';
        return base.charAt(0).toUpperCase() + base.slice(1);
    };

    const img = (src, alt, attrs = '') =>
        `<img src="${esc(src)}" alt="${esc(alt || altFromSrc(src))}" loading="lazy" ${attrs}>`;

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

    // Official brand logos for the share buttons — single-path marks (Simple
    // Icons) in their real brand colours, inline so they're crisp, need no
    // extra request, and never fall back to a generic FontAwesome glyph. `x`
    // and `link` use light/currentColor so they read on the dark buttons.
    const BRAND_ICONS = {
        whatsapp: ['#25D366', 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.582 0 11.94-5.359 11.944-11.893a11.821 11.821 0 00-3.487-8.413z'],
        facebook: ['#1877F2', 'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z'],
        linkedin: ['#0A66C2', 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'],
        telegram: ['#26A5E4', 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z'],
        reddit: ['#FF4500', 'M24 11.779c0-1.459-1.192-2.645-2.657-2.645-.715 0-1.363.286-1.84.746-1.81-1.191-4.259-1.949-6.971-2.046l1.483-4.669 4.016.941-.006.058c0 1.193.975 2.163 2.174 2.163 1.198 0 2.172-.97 2.172-2.163s-.975-2.164-2.172-2.164c-.92 0-1.704.574-2.021 1.379l-4.329-1.015c-.189-.046-.381.063-.44.249l-1.654 5.207c-2.838.034-5.409.798-7.3 2.025-.474-.438-1.103-.712-1.799-.712-1.465 0-2.656 1.187-2.656 2.646 0 1.066.638 1.986 1.552 2.402-.04.26-.064.522-.064.787 0 3.999 4.659 7.249 10.385 7.249s10.386-3.25 10.386-7.249c0-.256-.022-.509-.06-.758.943-.403 1.602-1.34 1.602-2.43zM7.276 14.515c0-.911.71-1.652 1.583-1.652.873 0 1.583.741 1.583 1.652s-.71 1.651-1.583 1.651-1.583-.74-1.583-1.651zm9.434 3.65c-1.118 1.118-3.255 1.205-3.881 1.205-.625 0-2.762-.087-3.879-1.205a.424.424 0 0 1 0-.601.422.422 0 0 1 .599 0c.704.705 2.207.95 3.28.95 1.075 0 2.578-.245 3.282-.95a.42.42 0 0 1 .599 0 .425.425 0 0 1 0 .601zm-.327-1.998c-.873 0-1.583-.741-1.583-1.652s.71-1.652 1.583-1.652.583.741 1.583 1.652-.71 1.652-1.583 1.652z'],
        link: ['currentColor', 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z'],
        share: ['currentColor', 'M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z'],
    };

    // Render a share-button glyph: the Gmail logo, a brand logo, or nothing.
    const shareIcon = (key, cls) => {
        if (key === 'gmail') return gmailLogo(cls);
        const b = BRAND_ICONS[key];
        return b
            ? `<svg class="${cls}" viewBox="0 0 24 24" fill="${b[0]}" aria-hidden="true" focusable="false"><path d="${b[1]}"/></svg>`
            : '';
    };

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
    // Two-letter region code -> English country name (e.g. "au" -> "Australia"),
    // used for flag alt text. Falls back to the upper-cased code if unsupported.
    let regionNames;
    try { regionNames = new Intl.DisplayNames(['en'], { type: 'region' }); } catch (e) { /* noop */ }
    const countryName = (cc) => {
        try { return (regionNames && regionNames.of(cc.toUpperCase())) || cc.toUpperCase(); }
        catch (e) { return cc.toUpperCase(); }
    };

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
            `srcset="https://flagcdn.com/48x36/${cc}.png 2x" width="24" height="18" ` +
            `alt="${esc(countryName(cc))} flag" loading="lazy">` +
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
            )}" alt="${esc(b.label)} logo" loading="lazy">${esc(b.label)} →</a>`,

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
            ? `<img class="${cls}" src="${esc(fav)}" alt="${esc(l.label || '')} logo" loading="lazy">`
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

        // The contact card carries the ice-breaker prompts between its lead and
        // links; renderPrompts() fills this mount afterwards.
        const withPrompts = sel === '[data-connect="contact"]' && C.prompts;
        const promptsMount = withPrompts ? '<div class="prompt-block" data-prompts="root"></div>' : '';

        let links = data.links && data.links.length ? data.links : (C.contact ? C.contact.links : []);
        // The prompts' "Email me your answers" button is the email path on this
        // card, so drop the duplicate Email button here (kept in #outro/footer).
        if (withPrompts) links = links.filter((l) => !/^mailto:/i.test(l.href || ''));

        const host = document.querySelector(sel);
        const anchor = host ? (host.closest('[id]') || {}).id || '' : '';
        const html =
            (data.tag ? `<div class="section-tag tag-purple">${esc(data.tag)}</div>` : '') +
            `<h2>${esc(data.heading)}${headingLink(anchor, data.heading)}</h2>` +
            `<p class="lead">${esc(data.lead)}</p>` +
            (data.note ? `<p class="contact-note">${esc(data.note)}</p>` : '') +
            promptsMount +
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

        const icon = (o) => shareIcon(o.icon, 'share-logo');
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
            ? `<button type="button" class="share-btn share-native primary">${shareIcon(
                'share',
                'share-logo'
            )}<span>Share…</span></button>`
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
        if (!document.querySelector('[data-prompts="root"]')) return; // no mount → nothing to do
        const html =
            (p.intro ? `<p class="prompt-intro">${esc(p.intro)}</p>` : '') +
            `<ol class="prompt-cards" data-prompts="cards"></ol>` +
            `<div class="prompt-actions">` +
            `<button type="button" class="prompt-shuffle"><i class="fa-solid fa-shuffle" aria-hidden="true"></i>` +
            `<span>${esc(p.shuffleLabel || 'Shuffle')}</span></button>` +
            `<a class="prompt-answer" href="#"><i class="fa-solid fa-envelope" aria-hidden="true"></i>` +
            `<span>${esc(p.answerLabel || 'Email me your answers')}</span></a>` +
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

    // Konami code easter egg: ↑ ↑ ↓ ↓ ← → ← → B A reveals a hidden 1-UP toast
    // — "It's a secret to everybody." A nod to Zelda + every cheat-code childhood.
    function initKonami() {
        const seq = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'
        ];
        let pos = 0;
        document.addEventListener('keydown', (e) => {
            const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            pos = key === seq[pos] ? pos + 1 : (key === seq[0] ? 1 : 0);
            if (pos === seq.length) {
                pos = 0;
                revealSecret();
            }
        });
    }

    // The 1-UP reveal — a celebratory toast + a shower of hearts. Self-removing,
    // and guarded so spamming the code doesn't stack duplicates.
    function revealSecret() {
        if (document.querySelector('.konami-toast')) return;
        const toast = document.createElement('div');
        toast.className = 'konami-toast';
        toast.innerHTML =
            '<span class="konami-1up">1-UP!</span>' +
            "<strong>It's a secret to everybody.</strong>" +
            '<span class="konami-sub">🍄 +30 lives · you found the cheat code 🎮</span>';
        document.body.appendChild(toast);

        for (let i = 0; i < 14; i++) {
            const h = document.createElement('div');
            h.className = 'konami-heart';
            h.textContent = ['❤️', '🍄', '⭐', '🎮'][i % 4];
            h.style.left = Math.random() * 100 + 'vw';
            h.style.animationDelay = Math.random() * 0.6 + 's';
            document.body.appendChild(h);
            setTimeout(() => h.remove(), 2600);
        }
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 4200);
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
        renderConnectCard(C.contact, '[data-connect="contact"]');
        renderPrompts();
        renderShare();
        renderConnectCard(C.outro, '[data-connect="outro"]');
        renderFooterLinks();

        initScrollSpy();
        initAccordion();
        initDeepLinks();
        initShare();
        initPrompts();
        initLightbox();
        initKonami();

        openFromHash();
        window.addEventListener('hashchange', openFromHash);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
