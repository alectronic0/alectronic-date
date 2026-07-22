/* ============================================================
   Alec's Dating Application — renderer + interactions
   ------------------------------------------------------------
   Reads window.CONTENT (from content.js) and builds the page,
   then wires up scroll-spy, the deep-dive modals and the lightbox.

   Rendering is data-driven: most sections are an array of typed
   "blocks" (see content.js). Each block type has a small renderer
   below; renderBlocks() routes by type. Adding a section is just
   adding data + a <… data-section="key"> container in index.html.
   ============================================================ */

(function () {
    'use strict';

    const C = window.CONTENT;

    /* ── analytics helper ── */
    function trackEvent(name, params = {}) {
        if (typeof window.gtag === 'function') {
            window.gtag('event', name, params);
        }
    }

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

    // `opts.w`/`opts.h` render width/height attributes so the browser can
    // reserve the image's box before it loads (avoids layout shift).
    // `opts.eager` skips loading="lazy" and `opts.priority` adds
    // fetchpriority="high" — used for the hero image, which is the LCP
    // element and shouldn't be deprioritised or discovered late.
    const img = (src, alt, attrs = '', opts = {}) => {
        const dims = opts.w && opts.h ? `width="${opts.w}" height="${opts.h}" ` : '';
        const loading = opts.eager ? '' : 'loading="lazy" ';
        const priority = opts.priority ? 'fetchpriority="high" ' : '';
        return `<img src="${esc(src)}" alt="${esc(alt || altFromSrc(src))}" ${dims}${loading}${priority}${attrs}>`;
    };

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

    const whatsappLogo = (cls) =>
        `<svg class="${cls}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" focusable="false">` +
        '<path fill="#25D366" d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>' +
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
        const hint = typeof t === 'object' && t.hint ? t.hint : '';
        return `<span class="tag-item ${variant}" data-label="${esc(label)}"${hint ? ` data-hint="${esc(hint)}"` : ''}>${flagify(label)}</span>`;
    };

    const renderValueCard = (c, collapsible = false) => {
        if (collapsible) {
            return `<div class="value-card value-card-collapsible collapsed">
                <div class="value-card-header">
                    <h3>${esc(c.title)}</h3>
                    <span class="value-card-chevron"><svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
                </div>
                <div class="value-card-content">
                    ${c.text ? `<p class="value-card-text">${esc(c.text)}</p>` : ''}
                    ${c.tags && c.tags.length ? `<div class="tag-row">${c.tags.map(tagHtml).join('')}</div>` : ''}
                    ${c.items && c.items.length ? `<ul>${c.items.map((i) => `<li>${i && i.html ? i.html : esc(i)}</li>`).join('')}</ul>` : ''}
                </div>
            </div>`;
        }

        return `<div class="value-card">
            <h3>${esc(c.title)}</h3>
            ${c.text ? `<p class="value-card-text">${esc(c.text)}</p>` : ''}
            ${c.tags && c.tags.length ? `<div class="tag-row">${c.tags.map(tagHtml).join('')}</div>` : ''}
            ${c.items && c.items.length ? `<ul>${c.items.map((i) => `<li>${i && i.html ? i.html : esc(i)}</li>`).join('')}</ul>` : ''}
        </div>`;
    };

    /* ── block renderers (each returns an HTML string) ── */
    const blocks = {
        paragraph: (b) => `<p>${b.html ? b.html : esc(b.text)}</p>`,

        locationInput: (b) =>
            `<div class="location-input-container">` +
            `<label for="rough-location">${esc(b.label || 'Your rough location:')}</label>` +
            `<div class="location-input-wrapper">` +
            `<input type="text" id="rough-location" placeholder="${esc(b.placeholder || 'e.g. Postcode, town, or train station')}" autocomplete="off">` +
            `<div id="location-suggestions" class="location-suggestions"></div>` +
            (b.subtext ? `<div class="location-subtext">${esc(b.subtext)}</div>` : '') +
            `</div>` +
            `</div>`,

        heading: (b) => `<h3>${esc(b.text)}</h3>`,

        note: (b) =>
            `<div class="${esc(b.variant || 'growth-note')}">${b.title ? `<h3 style="margin-bottom:8px;">${esc(b.title)}</h3>` : ''}<p style="margin:0;">${esc(b.text)}</p>${b.tags && b.tags.length ? `<div class="tag-row" style="margin-top:14px;">${b.tags.map(tagHtml).join('')}</div>` : ''}</div>`,

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
        interestCards: (b) => {
            let modals = '';
            const cardsHtml = b.cards
                .map(
                    (c) =>
                        `<div class="interest-card"><div class="interest-card-head"><span class="interest-card-icon">${esc(
                            c.icon
                        )}</span><span class="interest-card-title">${esc(c.title)}${c.subtitle ? ` <span class="interest-card-subtitle">${esc(c.subtitle)}</span>` : ''}</span></div>${
                            c.body ? `<p class="interest-card-body">${esc(c.body)}</p>` : ''
                        }${
                            c.imageGroups && c.imageGroups.length
                                ? (() => {
                                      const allImages = c.imageGroups.reduce((acc, g) => acc.concat(g.images), []);
                                      const total = allImages.length;
                                      const shuffled = [...allImages].sort(() => 0.5 - Math.random());
                                      const highlights = shuffled.slice(0, 4);
                                      const cardPhotos = `<div class="interest-card-photos">` +
                                          highlights.map((i, idx) => {
                                              if (total > 4 && idx === 3) {
                                                  return `<div class="photo-overlay-container" data-open-gallery="photography">${img(i.src, i.alt)}<div class="photo-overlay">+${total - 3}</div></div>`;
                                              } else {
                                                  return img(i.src, i.alt, `data-open-gallery="photography"`);
                                              }
                                          }).join('') +
                                          `</div>`;

                                      const modalHtml = `<dialog class="deep-modal" id="photography-gallery-modal" aria-label="Photography Gallery">
                                          <div class="deep-modal-inner">
                                              <div class="deep-modal-head">
                                                  <span class="deep-modal-emoji" aria-hidden="true">📷</span>
                                                  <h3 class="deep-modal-title">Photography Gallery</h3>
                                                  <button class="deep-modal-close" type="button" aria-label="Close">×</button>
                                              </div>
                                              <div class="deep-modal-body">
                                                  ${c.imageGroups
                                                      .map(
                                                          (g) =>
                                                              `<div class="interest-card-group">
                                                                  <h4 class="interest-card-group-title">${esc(g.title)}</h4>
                                                                  <div class="interest-card-photos">
                                                                      ${g.images.map((im) => img(im.src, im.alt)).join('')}
                                                                  </div>
                                                              </div>`
                                                      )
                                                      .join('')}
                                              </div>
                                          </div>
                                      </dialog>`;

                                      modals += modalHtml;
                                      return cardPhotos;
                                  })()
                                : c.images && c.images.length
                                ? `<div class="interest-card-photos">${c.images
                                      .map((i, idx) => {
                                          if (c.images.length > 4 && idx === 3) {
                                              return `<div class="photo-overlay-container">${img(i.src, i.alt)}<div class="photo-overlay">+${c.images.length - 3}</div></div>`;
                                          } else if (idx > 3) {
                                              return img(i.src, i.alt, 'style="display: none;"');
                                          } else {
                                              return img(i.src, i.alt);
                                          }
                                      })
                                      .join('')}</div>`
                                : ''
                        }${
                            c.details && c.details.length
                                ? `<div class="interest-card-list">${c.details
                                      .map(
                                          (d) =>
                                              `<div class="interest-card-list-item"><span class="ic-icon">${esc(
                                                  d.icon
                                              )}</span><span class="ic-text"><strong>${esc(
                                                  d.label
                                              )}</strong>${d.note ? ` — ${esc(d.note)}` : ''}</span></div>`
                                      )
                                      .join('')}</div>`
                                : ''
                        }${
                            c.tags && c.tags.length
                                ? `<div class="tag-row">${c.tags.map(tagHtml).join('')}</div>`
                                : ''
                        }</div>`
                )
                .join('');
            return `<div class="interest-cards">${cardsHtml}</div>` + modals;
        },

        photoGrid: (b) =>
            `<div class="photo-grid">${b.images.map((i) => img(i.src, i.alt)).join('')}</div>`,

        labeledPhotoGrid: (b) =>
            `<div class="labeled-photo-grid">${b.images
                .map(
                    (i) =>
                        `<div class="labeled-photo-card">${img(i.src, i.alt)}<div class="labeled-photo-label">${esc(
                            i.alt
                        )}</div></div>`
                )
                .join('')}</div>`,

        // GIFs keep their natural aspect ratio (no square cropping) — they're
        // externally hosted (Giphy/Tenor), so no width/height attributes.
        gifGrid: (b) =>
            `<div class="gif-grid">${b.gifs.map((g) => img(g.src, g.alt || 'A GIF I love')).join('')}</div>`,

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
                        `<${c.href ? `a href="${esc(c.href)}" target="_blank" style="text-decoration: none; color: inherit;"` : 'div'} class="place-card">${img(c.src, c.title)}
<div class="place-card-body">
<strong>${
                            c.icon ? esc(c.icon) + ' ' : ''
                        }${esc(c.title)}</strong>${
                            c.caption ? `<div class="place-detail">${esc(c.caption)}</div>` : ''
                        }</div>
</${c.href ? 'a' : 'div'}>`
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
                        `<div class="feature">${img(f.src, f.alt)}<div class="feature-body" style="gap: 0;"><div>${f.title ? `<strong style="display:block; margin-bottom:4px; font-size:1.05rem;">${f.icon ? `${esc(f.icon)} ` : ''}${esc(f.title)}</strong>` : ''}<span class="feature-text">${f.html ? f.html : esc(f.text)}</span></div></div></div>`
                )
                .join('')}</div>`,

        dateCards: (b) =>
            `<div class="date-menu">${b.cards
                .map(
                    (c) =>
                        `<div class="date-card">${img(c.src, c.alt)}<div class="date-card-body"><h3>${esc(
                            c.title
                        )}</h3><div class="date-pills">${c.pills
                            .map((p) => {
                                const isSelected = p === "☕ Coffee & Walk";
                                return `<button type="button" class="pill date-idea-pill${isSelected ? ' selected' : ''}" data-idea="${esc(p)}">${esc(p)}</button>`;
                            })
                            .join('')}</div></div></div>`
                )
                .join('')}</div>`,

        // Items are plain strings (escaped) or {html} objects for trusted markup,
        // mirroring the paragraph block's text/html split. A column can also
        // carry an intro `text` line and a `tags` chip row instead of items.
        valueCols: (b) =>
            `<div class="value-cols">${b.columns.map(c => renderValueCard(c, false)).join('')}</div>`,

        valueGrid: (b) =>
            `<div class="value-cols">${b.columns
                .map((col) => `<div class="value-col">${col.cards ? col.cards.map(c => renderValueCard(c, true)).join('') : ''}</div>`)
                .join('')}</div>`,

        // Two columns, each holding one or more titled lists (gold bullets)
        listCols: (b) =>
            `<div class="two-cols">${b.columns
                .map(
                    (col) =>
                        `<div class="list-block">${col.groups
                            .map(
                                (g) =>
                                    `<h3>${esc(g.title)}</h3>` +
                                    (g.items && g.items.length ? `<ul>${g.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : '') +
                                    (g.charities && g.charities.length ? `<div class="charity-grid-wrapper">${blocks.charityGrid({tiles: g.charities})}</div>` : '')
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
                        `<a class="podcast-card" href="${esc(c.url || `https://open.spotify.com/search/${encodeURIComponent(c.title + ' podcast')}`)}" target="_blank" style="text-decoration: none; color: inherit;"><img class="podcast-logo" src="${esc(c.logo)}" alt="${esc(
                            c.title
                        )}" loading="lazy"><div><strong>${esc(c.title)}</strong><p>${esc(
                            c.description
                        )}</p></div></a>`
                )
                .join('')}</div>`,

        logoGrid: (b) =>
            `<div class="logo-grid">${b.tiles
                .map(
                    (t) =>
                        `<div class="logo-tile">${img(t.src, t.label)}<span>${esc(t.label)}</span></div>`
                )
                .join('')}</div>`,

        charityGrid: (b) =>
            `<div class="charity-grid">${b.tiles
                .map(
                    (t) =>
                        `<a class="charity-tile" href="${esc(t.url)}" target="_blank" rel="noopener noreferrer" title="Donate / support ${esc(t.label)}">
                            <img class="charity-logo" src="${esc(t.logo || faviconFor(t.url))}" alt="${esc(t.label)} logo" loading="lazy">
                            <span class="charity-name">${esc(t.label)}</span>
                        </a>`
                )
                .join('')}</div>`,

        redFlags: (b) =>
            `<div class="red-flags-grid">${b.cards
                .map(
                    (c) =>
                        `<div class="red-flag-card">
                            <span class="rf-icon">${esc(c.icon || "🚩")}</span>
                            <div class="rf-content">
                                <strong class="rf-title">${esc(c.title)}</strong>
                                <p class="rf-desc">${esc(c.desc)}</p>
                            </div>
                        </div>`
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
                .join('')}</div>`,

        detailCols: (b) =>
            `<div class="two-cols">${b.columns
                .map(
                    (col) =>
                        `<div class="list-block"><h3>${esc(col.title)}</h3>${blocks.detailList({items: col.items})}</div>`
                )
                .join('')}</div>`,

        // Spotify embed (playlist / album / track). `src` is an
        // open.spotify.com/embed/… URL; `height` follows Spotify's presets
        // (152 = compact player, 352 = player with track list).
        spotify: (b) =>
            `<div class="spotify-embed"><iframe src="${esc(b.src)}" title="${esc(
                b.title || 'Spotify player'
            )}" width="100%" height="${Number(b.height) || 152}" frameborder="0" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe></div>`,

        testimonialRows: (b) =>
            `<div class="testimonial-rows">${b.items
                .map((item, idx) => {
                    const imgPos = item.imagePosition || (idx % 2 === 0 ? 'left' : 'right');
                    const imgHtml = item.src ? `<div class="testimonial-img-wrapper">${img(item.src, item.alt)}</div>` : '';
                    const bodyHtml = `<div class="testimonial-body">
                        ${item.title ? `<h3>${item.icon ? `${esc(item.icon)} ` : ''}${esc(item.title)}</h3>` : ''}
                        <p class="testimonial-text">${esc(item.text)}</p>
                        ${item.signature ? `<span class="testimonial-signature">${esc(item.signature)}</span>` : ''}
                    </div>`;
                    return `<div class="testimonial-row img-${imgPos}">
                        ${imgPos === 'left' ? imgHtml + bodyHtml : bodyHtml + imgHtml}
                    </div>`;
                })
                .join('')}</div>`,

        // 🚧 placeholder banner for sections that aren't written yet.
        construction: (b) =>
            '<div class="construction-banner">' +
            (b.gif ? `<img class="c-gif" src="${esc(b.gif)}" alt="${esc(b.title || 'Under construction')}" loading="lazy">` : '<div class="c-emoji">🚧</div>') +
            `<strong>${esc(b.title || 'Under Construction')}</strong>` +
            `<p>${esc(b.text || 'This section is still being built — check back soon!')}</p></div>`,

        calloutBanner: (b) =>
            `<div class="callout-banner">` +
            (b.emoji ? `<span class="callout-emoji" aria-hidden="true">${esc(b.emoji)}</span>` : '') +
            (b.title ? `<span class="callout-title">${esc(b.title)}</span>` : '') +
            (b.text ? `<span class="callout-tagline">${esc(b.text)}</span>` : '') +
            `</div>`,

        socialCampaign: (b) => {
            const profilesHtml = b.profiles
                ? `<div class="social-profile-grid">${b.profiles
                      .map(
                          (p) => `<a class="social-profile-card" href="${esc(p.href)}" target="_blank" rel="noopener noreferrer">
                              <img class="social-card-logo" src="${esc(faviconFor(p.href))}" alt="${esc(p.platform)} logo" loading="lazy">
                              <div class="social-card-info">
                                  <strong>${esc(p.platform)}</strong>
                                  <span class="social-card-handle">${esc(p.handle)}</span>
                              </div>
                              <span class="social-card-cta">${esc(p.cta || 'Follow')} ↗</span>
                          </a>`
                      )
                      .join('')}</div>`
                : '';

            const clipsHtml = b.clips && b.clips.length
                ? `<div class="social-clips-grid">${b.clips
                      .map((clip) => {
                          if (clip.embedUrl) {
                              return `<div class="social-clip-card">
                                  <div class="social-clip-embed">
                                      <iframe src="${esc(clip.embedUrl)}" title="${esc(clip.title || 'Clip')}" frameborder="0" allowfullscreen loading="lazy"></iframe>
                                  </div>
                                  ${clip.title ? `<p class="social-clip-title">${esc(clip.title)}</p>` : ''}
                              </div>`;
                          }
                          return `<a class="social-clip-card link-card" href="${esc(clip.href || clip.link || '#')}" target="_blank" rel="noopener noreferrer">
                              <div class="social-clip-thumb">${clip.src ? img(clip.src, clip.title) : `<span class="thumb-emoji">${clip.platform === 'TikTok' ? '🎵' : '📸'}</span>`}</div>
                              <div class="social-clip-info">
                                  <strong>${esc(clip.title || 'Watch Clip')}</strong>
                                  <span>${esc(clip.caption || 'Watch on ' + (clip.platform || 'social'))} ↗</span>
                              </div>
                          </a>`;
                      })
                      .join('')}</div>`
                : `<div class="social-clips-placeholder">
                      <div class="placeholder-badge">🎥 Clips Dropping Soon</div>
                      <p>Clips for the <strong>"Date Me" Campaign</strong> are dropping on social media!</p>
                      <p class="placeholder-sub">Follow below to catch every episode, date test, and vlog as the adventure unfolds.</p>
                  </div>`;

            return `<div class="social-campaign-block">${profilesHtml}${clipsHtml}</div>`;
        },
        
        fadingCollage: (b) => {
            if (!b.images || !b.images.length) return '';
            return `<div class="fading-collage" data-images='${esc(JSON.stringify(b.images))}'></div>`;
        }
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
    // Tag + heading ride in a sticky .section-head wrapper so they stay pinned
    // below the nav while the section scrolls; the lead scrolls away normally.
    function sectionHeaderHtml(s, anchor) {
        let head = '';
        if (s.tag) head += `<div class="section-tag ${esc(s.tagClass || 'tag-purple')}">${esc(s.tag)}</div>`;
        if (s.heading) head += `<h2>${esc(s.heading)}${headingLink(anchor, s.heading)}</h2>`;
        let h = head ? `<div class="section-head">${head}</div>` : '';
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

    // Build the deep-dive topic grid + one <dialog> modal per topic from
    // CONTENT.accordion. Each modal gets id=key so a URL hash (…#food) can
    // open it; its body is a data-section container that renderSections()
    // fills afterwards. Topics flagged `wip: true` get a 🚧 badge.
    function renderDeepDive() {
        if (!C || !C.accordion) return;
        const grid = document.querySelector('.deep-grid');
        if (!grid) return;
        grid.innerHTML = C.accordion
            .map(
                (a) =>
                    a.type === 'heading'
                        ? `<h3 class="deep-group-header">${esc(a.text)}</h3>`
                        : `<button class="deep-card" type="button" data-modal="${esc(
                        a.key
                    )}" aria-haspopup="dialog">` +
                    (a.wip ? '<span class="deep-card-badge">🚧 WIP</span>' : '') +
                    `<span class="deep-card-emoji" aria-hidden="true">${esc(a.emoji)}</span>` +
                    `<span class="deep-card-title">${esc(a.title)}</span>` +
                    (a.hint
                        ? `<span class="deep-card-hint">${esc(String(a.hint).replace(/^—\s*/, ''))}</span>`
                        : '') +
                    '</button>'
            )
            .join('');

        // Modals live directly under <body> so no section styling leaks in.
        let host = document.getElementById('deep-modals');
        if (!host) {
            host = document.createElement('div');
            host.id = 'deep-modals';
            document.body.appendChild(host);
        }
        host.innerHTML = C.accordion
            .filter((a) => a.type !== 'heading')
            .map(
                (a) =>
                    `<dialog class="deep-modal" id="${esc(a.key)}" aria-label="${esc(a.title)}">` +
                    '<div class="deep-modal-inner">' +
                    '<div class="deep-modal-head">' +
                    `<span class="deep-modal-emoji" aria-hidden="true">${esc(a.emoji)}</span>` +
                    `<h3 class="deep-modal-title">${esc(a.title)}</h3>` +
                    `<span class="deep-link" role="button" tabindex="0" data-anchor="${esc(
                        a.key
                    )}" aria-label="Copy link to ${esc(a.title)}" title="Copy link to this section">🔗</span>` +
                    '<button class="deep-modal-close" type="button" aria-label="Close">×</button>' +
                    '</div>' +
                    `<div class="deep-modal-body" data-section="${esc(a.key)}"></div>` +
                    '</div>' +
                    '</dialog>'
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
        
        const taglineEl = document.querySelector('[data-hero="tagline"]');
        if (taglineEl) {
            if (h.taglineSlots && h.taglineSlots.length > 0) {
                const slots = h.taglineSlots;
                const n = slots.length - 1;
                const step = 100 / n;
                const pauseTime = step * 0.75;
                
                let keyframes = `@keyframes slot-spin {\n`;
                for (let i = 0; i <= n; i++) {
                    if (i === n) {
                        keyframes += `  100% { transform: translateY(-${i * 1.5}em); }\n`;
                    } else {
                        const start = i * step;
                        const end = start + pauseTime;
                        keyframes += `  ${start.toFixed(2)}%, ${end.toFixed(2)}% { transform: translateY(-${i * 1.5}em); }\n`;
                    }
                }
                keyframes += `}\n`;
                
                let styleEl = document.getElementById('slot-machine-style');
                if (!styleEl) {
                    styleEl = document.createElement('style');
                    styleEl.id = 'slot-machine-style';
                    document.head.appendChild(styleEl);
                }
                styleEl.innerHTML = keyframes;
                
                const animDuration = n * 3; // 3 seconds per item
                let taglineHtml = `${esc(h.taglineStart || "")}<span class="slot-machine"><span class="slot-machine-inner" style="animation-duration: ${animDuration}s">${slots.map(s => `<span>${esc(s)}</span>`).join('')}</span></span>`;
                if (h.taglineEnd) {
                    taglineHtml += `<br><span class="hero-tagline-end">${esc(h.taglineEnd)}</span>`;
                }
                taglineEl.innerHTML = taglineHtml;
            } else {
                setText('[data-hero="tagline"]', h.tagline);
            }
        }

        if (h.cta) {
            setHtml('#hero-cta-container', `<a href="#about" class="hero-cta" data-hero="cta">${esc(h.cta)}</a>`);
        }
        // All three are visible without scrolling, so none should be lazy;
        // the first is the LCP element and gets fetchpriority="high" too.
        setHtml(
            '[data-hero="media"]',
            h.images
                .map((i, idx) => img(i.src, i.alt, '', { w: i.w, h: i.h, eager: true, priority: idx === 0 }))
                .join('')
        );
    }

    function renderProfile() {
        if (!C || !C.profile) return;
        const p = C.profile;
        setHtml('[data-profile="name"]', esc(p.name) + headingLink('about', p.name));
        const taglineEl = document.querySelector('[data-profile="tagline"]');
        if (taglineEl) {
            if (p.tagline) {
                taglineEl.textContent = p.tagline;
                taglineEl.style.display = '';
            } else {
                taglineEl.textContent = '';
                taglineEl.style.display = 'none';
            }
        }
        setHtml('[data-profile="intro"]', p.intro.map((t) => `<p>${t}</p>`).join(''));
        setHtml('[data-profile="photo"]', img(p.photo.src, p.photo.alt, '', { w: p.photo.w, h: p.photo.h }));
        setHtml('[data-profile="facts"]', p.facts.map(factHtml).join(''));
    }

    function getActiveContainer() {
        const openDialogs = document.querySelectorAll('dialog[open]');
        if (openDialogs.length > 0) {
            return openDialogs[openDialogs.length - 1];
        }
        return document.body;
    }

    function rainEmoji(emoji) {
        const container = getActiveContainer();
        for (let i = 0; i < 15; i++) {
            const el = document.createElement('div');
            el.className = 'emoji-rain-drop';
            el.textContent = emoji;
            el.style.left = Math.random() * 100 + 'vw';
            el.style.animationDelay = Math.random() * 0.8 + 's';
            el.style.fontSize = (1.2 + Math.random() * 0.8) + 'rem';
            container.appendChild(el);
            setTimeout(() => el.remove(), 2600);
        }
    }

    let activeFactToast = null;
    function showFactToast(message) {
        if (activeFactToast) {
            activeFactToast.remove();
            activeFactToast = null;
        }
        const container = getActiveContainer();
        const toast = document.createElement('div');
        toast.className = 'fact-toast';
        toast.innerHTML = `<span>${esc(message)}</span>`;
        container.appendChild(toast);
        activeFactToast = toast;

        requestAnimationFrame(() => toast.classList.add('show'));

        setTimeout(() => {
            if (activeFactToast === toast) {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (toast.parentNode) toast.remove();
                    if (activeFactToast === toast) activeFactToast = null;
                }, 400);
            }
        }, 4000);
    }

    function initFactClicks() {
        // Global delegate for clicking any tag-item, fact, or chip
        document.body.addEventListener('click', (e) => {
            const el = e.target.closest('.tag-item, .fact, .chip');
            if (!el) return;
            if (el.classList.contains('date-idea-pill')) return;

            const hint = el.getAttribute('data-hint') || el.getAttribute('data-toast');
            if (hint) {
                showFactToast(hint);
            }

            const iconEl = el.querySelector('.fact-icon');
            let emoji = iconEl ? iconEl.textContent.trim() : '';
            if (!emoji) {
                const label = el.getAttribute('data-label') || el.textContent.trim();
                const m = label.match(/^(\p{Extended_Pictographic})/u);
                emoji = m ? m[1] : '';
            }
            if (emoji) {
                rainEmoji(emoji);
            }
        });
    }

    // Age auto-calculates from a fact's `dob` (YYYY-MM-DD) so it's always
    // correct on page load — no more hand-editing the number every year.
    function calcAge(dobStr) {
        const dob = new Date(dobStr);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const hasHadBirthdayThisYear =
            today.getMonth() > dob.getMonth() ||
            (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
        if (!hasHadBirthdayThisYear) age--;
        return age;
    }

    // A fact value may be: a plain string, an array (joined with a · dot),
    // a `dob` (age + birthday computed at render time), and/or carry an
    // `href` to render the value as a link.
    function factValue(f) {
        const linkify = (text) =>
            f.href
                ? `<a class="fact-link" href="${esc(f.href)}" target="_blank" rel="noopener">${esc(text)}</a>`
                : esc(text);
        if (f.dob) {
            const birthday = new Date(f.dob).toLocaleDateString('en-GB', {day: 'numeric', month: 'long'});
            return `<span class="fact-value">${linkify(`${calcAge(f.dob)} (${birthday})`)}</span>`;
        }
        const vals = Array.isArray(f.value) ? f.value : [f.value];
        return `<span class="fact-value">${vals
            .map((v) => linkify(String(v).trim()))
            .join('<span class="fact-sep" aria-hidden="true"> / </span>')}</span>`;
    }

    // Each fact is a compact Bumble-style chip: icon + value. The label isn't
    // shown (the icon carries it) but stays for screen readers, plus a title
    // tooltip for mouse users.
    function factHtml(f) {
        const toastAttr = f.toast ? ` data-toast="${esc(f.toast)}"` : '';
        return `<span class="fact"${toastAttr} title="${esc(f.label)}"><span class="fact-icon" aria-hidden="true">${esc(
            f.icon
        )}</span><span class="sr-only">${esc(f.label)}: </span>${factValue(f)}</span>`;
    }

    // A link's icon: prefer the site favicon, fall back to the emoji `icon` when
    // no domain favicon exists (e.g. the mailto: Email link). `cls` lets each
    // context (button vs footer) size its own favicon.
    const linkIcon = (l, cls) => {
        if (l.icon === 'gmail') return gmailLogo(cls);
        if (l.icon === 'whatsapp') return whatsappLogo(cls);
        const fav = l.favicon || faviconFor(l.href);
        return fav
            ? `<img class="${cls}" src="${esc(fav)}" alt="${esc(l.label || '')} logo" loading="lazy">`
            : `<span class="contact-emoji">${esc(l.icon || '')}</span>`;
    };

    // Open external links in a new tab; keep mailto in place.
    const linkTarget = (href) =>
        href.startsWith('mailto:') || href.startsWith('#') || href.startsWith('javascript:') ? '' : ' target="_blank" rel="noopener"';

    // Shared "let's connect" card — used by both #contact and #outro. Same
    // component, different title/text. A card with no `links` reuses
    // contact.links so the buttons stay a single source of truth.
    function renderConnectCard(data, sel) {
        if (!data) return;
        const linkHtml = (l) => {
            const cls = `contact-btn${l.primary ? ' primary' : ''}${l.disabled ? ' disabled' : ''}`;
            const content = `${linkIcon(l, 'contact-favicon')} <span class="btn-label">${esc(l.label)}</span>${l.sublabel ? `<span class="btn-sublabel">${esc(l.sublabel)}</span>` : ''}`;
            if (l.disabled) {
                return `<span class="${cls}">${content}</span>`;
            }
            return `<a class="${cls}" href="${esc(l.href)}"${linkTarget(l.href)}>${content}</a>`;
        };

        // The contact card carries the ice-breaker prompts between its lead and
        // links; renderPrompts() fills this mount afterwards.
        const withPrompts = sel === '[data-connect="contact"]' && C.prompts;
        const promptsMount = withPrompts ? '<div class="prompt-block" data-prompts="root"></div>' : '';
        const withAdventures = sel === '[data-connect="contact"]';
        const adventuresMount = withAdventures ? '<div class="selected-adventures-block" data-adventures="root"></div>' : '';

        let links = data.links && data.links.length ? data.links : (C.contact ? C.contact.links : []);
        // The prompts' "Email me your answers" button is the email path on this
        // card, so drop the duplicate Email button here (kept in #outro/footer).
        if (withPrompts) links = links.filter((l) => !/^mailto:/i.test(l.href || ''));

        const host = document.querySelector(sel);
        const anchor = host ? (host.closest('[id]') || {}).id || '' : '';
        const html =
            (data.tag ? `<div class="section-tag tag-purple">${esc(data.tag)}</div>` : '') +
            `<h2>${esc(data.heading)}${headingLink(anchor, data.heading)}</h2>` +
            `<p class="lead">${(data.lead || '').replace(/\n/g, '<br>')}</p>` +
            (data.note ? `<p class="contact-note">${esc(data.note)}</p>` : '') +
            adventuresMount +
            promptsMount +
            `<div class="contact-links">${links.map(linkHtml).join('')}</div>`;
        setHtml(sel, html);
    }

    // Footer links — same contact.links data, lighter text-link styling.
    function renderFooterLinks() {
        if (!C || !C.contact) return;
        const linkHtml = (l) => {
            const content = `${linkIcon(l, 'footer-favicon')}<span>${esc(l.label)}</span>`;
            if (l.disabled) {
                return `<span class="footer-link disabled">${content}</span>`;
            }
            return `<a href="${esc(l.href)}"${linkTarget(l.href)}>${content}</a>`;
        };
        const footerLinks = [
            ...(C.contact.links || []),
            { label: 'Cookie Settings', icon: '🍪', href: 'javascript:Cookiebot.renew()' },
            { label: 'Cookie Vault', icon: '🍪', href: 'cookies.html' }
        ];
        setHtml('[data-footer="links"]', footerLinks.map(linkHtml).join(''));
    }

    // The canonical, hash-free URL to share. Falls back to the live domain when
    // the page is opened from disk (file://) so share links are never broken.
    const shareUrl = () => {
        const here = location.href.split('#')[0];
        const fallback = (C && C.meta && C.meta.domainFallback) || 'https://date.alec.today/';
        return /^https?:/.test(here) ? here : fallback;
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
    // Takes a mount selector so the same card renders both in #contact and in
    // the "Go on a date" modal.
    function renderShare(sel) {
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
        setHtml(sel, html);
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

    const getCompiledBody = (questions) => {
        const p = C.prompts || {};
        const selectedAdventures = Array.from(document.querySelectorAll('.date-idea-pill.selected'))
                                        .map(el => el.getAttribute('data-idea'));
        const locationVal = document.getElementById('rough-location') ? document.getElementById('rough-location').value.trim() : '';
        let locText = '';
        if (locationVal) {
            const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationVal)}`;
            locText = `My rough location is: ${locationVal} (${mapLink})\n\n`;
        }
        const advPS = `P.S. For our first adventure, I'm thinking:\n` + 
            (selectedAdventures.length ? selectedAdventures.map(a => `- ${a}`).join('\n') : '- 🫣 Surprise me!');
        const intro = p.emailIntro ? p.emailIntro + '\n\n' : '';
        const questionsText = questions.map((q, i) => `${i + 1}. ${q}\n\n`).join('').trim();
        return intro + locText + questionsText + '\n\n' + advPS;
    };

    // A mailto: whose body lists the given questions with room to answer.
    const promptMailto = (p, questions) => {
        const body = getCompiledBody(questions);
        const subject = encodeURIComponent(p.emailSubject || document.title);
        return `mailto:${promptEmail(p)}?subject=${subject}&body=${encodeURIComponent(body)}`;
    };

    let currentPromptPicks = [];

    // Pick a fresh set of questions and sync the "answer" button's mailto to them.
    function drawPrompts(forceShuffle = true) {
        if (!C || !C.prompts) return;
        const p = C.prompts;
        const count = p.count || 3;

        if (forceShuffle || !currentPromptPicks.length) {
            const allPool = p.questions || [];

            // Initialize if empty
            if (!currentPromptPicks.length) {
                try {
                    const savedPicks = JSON.parse(localStorage.getItem('alec-date-prompts'));
                    if (savedPicks && Array.isArray(savedPicks) && savedPicks.length === count) {
                        currentPromptPicks = savedPicks;
                    }
                } catch(e) {}

                if (!currentPromptPicks.length) {
                    const initial = sample(allPool, count);
                    currentPromptPicks = initial.map(q => ({ text: q, held: false }));
                }
            } else {
                // Re-roll the non-held ones
                const currentTexts = currentPromptPicks.map(item => item.text);
                const availablePool = allPool.filter(q => !currentTexts.includes(q));
                const shuffledPool = sample(availablePool, availablePool.length);

                currentPromptPicks = currentPromptPicks.map(item => {
                    if (item.held) return item; // Keep held
                    if (shuffledPool.length > 0) {
                        return { text: shuffledPool.pop(), held: false };
                    }
                    return item; // Fallback
                });
            }
        }

        // Draw the cards (always draw to update hold buttons, disabled states, and active classes)
        const heldCount = currentPromptPicks.filter(item => item.held).length;
        const container = document.querySelector('[data-prompts="cards"]');
        
        if (container && container.querySelectorAll('.prompt-card').length === count) {
            // Incremental update to only animate cards whose text actually changes
            const existingCards = container.querySelectorAll('.prompt-card');
            currentPromptPicks.forEach((item, i) => {
                const card = existingCards[i];
                const qSpan = card.querySelector('.prompt-q');
                const holdBtn = card.querySelector('.prompt-hold-btn');
                const isHeld = item.held;
                const canHold = isHeld || heldCount < (count - 1);

                const oldText = qSpan.textContent;
                const newText = item.text;

                if (oldText !== newText) {
                    qSpan.textContent = newText;
                    // Trigger reflow to restart CSS fade-in animation
                    card.style.animation = 'none';
                    void card.offsetWidth;
                    card.style.animation = '';
                }

                if (isHeld) {
                    card.classList.add('active');
                    holdBtn.classList.add('active');
                    holdBtn.textContent = '🔒 Held';
                } else {
                    card.classList.remove('active');
                    holdBtn.classList.remove('active');
                    holdBtn.textContent = '🔓 Hold';
                }

                if (canHold) {
                    holdBtn.removeAttribute('disabled');
                    holdBtn.removeAttribute('title');
                } else {
                    holdBtn.setAttribute('disabled', 'true');
                    holdBtn.setAttribute('title', 'Cannot hold all questions');
                }
            });
        } else if (container) {
            // Initial render
            const cards = currentPromptPicks
                .map((item, i) => {
                    const isHeld = item.held;
                    const canHold = isHeld || heldCount < (count - 1);
                    const activeClass = isHeld ? ' active' : '';
                    const disabledAttr = canHold ? '' : ' disabled title="Cannot hold all questions"';
                    return `<li class="prompt-card${activeClass}" data-index="${i}">` +
                        `<span class="prompt-num">${i + 1}</span>` +
                        `<span class="prompt-q">${esc(item.text)}</span>` +
                        `<button type="button" class="prompt-hold-btn${activeClass}" ${disabledAttr}>` +
                        `${isHeld ? '🔒 Held' : '🔓 Hold'}` +
                        `</button>` +
                        `</li>`;
                })
                .join('');
            setHtml('[data-prompts="cards"]', cards);
        }

        const answer = document.querySelector('.prompt-answer');
        if (answer) answer.setAttribute('href', promptMailto(p, currentPromptPicks.map(item => item.text)));

        try {
            localStorage.setItem('alec-date-prompts', JSON.stringify(currentPromptPicks));
        } catch(e) {}
    }

    function renderPrompts() {
        if (!C || !C.prompts) return;
        const p = C.prompts;
        if (!document.querySelector('[data-prompts="root"]')) return; // no mount → nothing to do
        const html =
            (p.intro ? `<p class="prompt-intro">${esc(p.intro)}</p>` : '') +
            `<div class="prompt-header-action">` +
            `<button type="button" class="prompt-shuffle"><i class="prompt-icon" aria-hidden="true">🃏</i>` +
            `<span>${esc(p.shuffleLabel || 'Shuffle')}</span></button>` +
            `</div>` +
            `<ol class="prompt-cards" data-prompts="cards"></ol>` +
            `<div class="prompt-actions">` +
            `<a class="prompt-answer" href="#"><i class="prompt-icon" aria-hidden="true">✉️</i>` +
            `<span>${esc(p.answerLabel || 'Email me your responses')}</span></a>` +
            `<button type="button" class="prompt-copy-btn"><i class="prompt-icon" aria-hidden="true">📋</i>` +
            `<span>Copy responses</span></button>` +
            `</div>`;
        setHtml('[data-prompts="root"]', html);
        drawPrompts();
    }

    function initPrompts() {
        const btn = document.querySelector('.prompt-shuffle');
        if (!btn || btn._listenerAttached) return;
        
        btn.addEventListener('click', () => {
            rainEmoji('🃏');
            drawPrompts(true);
        });

        // Delegate Hold button clicks
        const cardsContainer = document.querySelector('[data-prompts="cards"]');
        if (cardsContainer) {
            cardsContainer.addEventListener('click', (e) => {
                const holdBtn = e.target.closest('.prompt-hold-btn');
                if (!holdBtn || holdBtn.disabled) return;

                const card = holdBtn.closest('.prompt-card');
                if (!card) return;

                const idx = parseInt(card.getAttribute('data-index'), 10);
                if (currentPromptPicks[idx]) {
                    currentPromptPicks[idx].held = !currentPromptPicks[idx].held;
                    drawPrompts(false); // Update button states and classes
                }
            });
        }

        // Copy responses button event listener
        const copyBtn = document.querySelector('.prompt-copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const body = getCompiledBody(currentPromptPicks.map(item => item.text));
                navigator.clipboard.writeText(body).then(() => {
                    const span = copyBtn.querySelector('span');
                    const origText = span.textContent;
                    span.textContent = 'Copied! ✅';
                    const prevBorder = copyBtn.style.borderColor;
                    copyBtn.style.borderColor = 'var(--gold)';
                    setTimeout(() => {
                        span.textContent = origText;
                        copyBtn.style.borderColor = prevBorder;
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy text:', err);
                });
            });
        }

        btn._listenerAttached = true;
    }

    function renderSelectedAdventures() {
        const mount = document.querySelector('[data-adventures="root"]');
        if (!mount) return;

        const selected = Array.from(new Set(Array.from(document.querySelectorAll('.date-idea-pill.selected'))
                              .map(el => el.getAttribute('data-idea'))));

        const locationInput = document.getElementById('rough-location');
        const locationVal = locationInput ? locationInput.value.trim() : '';

        let locHtml = '';
        if (locationVal) {
            const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationVal)}`;
            locHtml = `
                <div class="picked-location-section">
                    <div class="picked-location-row">
                        <span class="location-icon">📍</span>
                        <strong>Rough Location:</strong>
                        <a href="${esc(mapLink)}" target="_blank" rel="noopener" class="location-link">${esc(locationVal)}</a>
                        <button type="button" class="change-location-btn">Change location ⬆️</button>
                    </div>
                </div>
            `;
        } else {
            locHtml = `
                <div class="picked-location-section empty-location-prompt">
                    <div class="picked-location-row" style="color: var(--muted); font-size: 0.82rem;">
                        <span class="location-icon">📍</span>
                        <span>No location entered yet.</span>
                        <button type="button" class="change-location-btn" style="color: var(--gold); border-color: var(--gold); background: rgba(230, 169, 121, 0.05); margin-left: 8px;">Add location ⬆️</button>
                    </div>
                </div>
            `;
        }

        let listContent = '';
        if (selected.length > 0) {
            listContent = `
                <div class="adventure-chips">
                    ${selected.map(item => `
                        <span class="adventure-chip">
                            ${esc(item)}
                            <button type="button" class="remove-adventure-btn" data-idea="${esc(item)}" aria-label="Remove ${esc(item)}">×</button>
                        </span>
                    `).join('')}
                </div>
            `;
        } else {
            listContent = `
                <p class="no-dates-selected-warning" style="margin: 0; font-size: 0.82rem; color: var(--muted); line-height: 1.5; display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.2rem; flex-shrink: 0;">😢</span>
                    <span>No date ideas selected yet! Go scroll up to <a href="#dates" style="color: var(--gold); text-decoration: underline; font-weight: 600;">Date Ideas</a> and pick a few things you'd like to try!</span>
                </p>
            `;
        }

        mount.innerHTML = `
            <h4 class="picked-adventures-title" style="margin: 0 0 10px;">🗺️ Your Picked Adventures:</h4>
            ${locHtml}
            <div class="selected-adventures-list">
                ${listContent}
            </div>
            <div class="change-adventures-row" style="margin-top: 12px; display: flex; justify-content: center;">
                <button type="button" class="change-adventures-btn">Choose other options? ⬆️</button>
            </div>
        `;
    }

    function updateDatesState() {
        if (typeof drawPrompts === 'function') {
            drawPrompts(false); 
        }

        const selected = Array.from(new Set(Array.from(document.querySelectorAll('.date-idea-pill.selected'))
                      .map(el => el.getAttribute('data-idea'))));



        const emailTemplate = (C && C.contact && C.contact.emailTemplate) || {};
        const subject = emailTemplate.subject || "RE: Alec Dating Application";
        const intro = emailTemplate.body || "Hi Alec! I'm ready to shoot my shot.";
        const locationVal = document.getElementById('rough-location') ? document.getElementById('rough-location').value.trim() : '';
        let locText = '';
        if (locationVal) {
            const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationVal)}`;
            locText = `My rough location is: ${locationVal} (${mapLink})\n\n`;
        }
        const advText = `${intro}\n\n${locText}For our first adventure, I'd love to do:\n` + 
            (selected.length ? selected.map(a => `- ${a}`).join('\n') : '- 🫣 Surprise me!') + `\n\n`;

        document.querySelectorAll('.contact-btn[href^="mailto:"]').forEach(link => {
            if (link.classList.contains('prompt-answer')) return; // handled by drawPrompts
            const base = link.getAttribute('href').split('?')[0];
            const subj = encodeURIComponent(subject);
            const body = advText ? `&body=${encodeURIComponent(advText)}` : '';
            link.setAttribute('href', `${base}?subject=${subj}${body}`);
        });

        renderSelectedAdventures();
    }

    function initDatePills() {
        if (document._datePillsDelegated) return;

        // Restore state from localStorage if available
        try {
            const savedPills = JSON.parse(localStorage.getItem('alec-date-pills'));
            if (savedPills && Array.isArray(savedPills)) {
                document.querySelectorAll('.date-idea-pill').forEach(el => {
                    const idea = el.getAttribute('data-idea');
                    if (savedPills.includes(idea)) {
                        el.classList.add('selected');
                    } else {
                        el.classList.remove('selected');
                    }
                });
            }
            const savedLoc = localStorage.getItem('alec-date-location');
            if (savedLoc !== null) {
                const input = document.getElementById('rough-location');
                if (input) input.value = savedLoc;
            }
        } catch(e) {
            console.warn('Failed to restore state from localStorage', e);
        }

        // Handle pill selection
        document.addEventListener('click', (e) => {
            const p = e.target.closest('.date-idea-pill');
            if (!p) return;

            // Rain emoji when clicking!
            const m = p.textContent.trim().match(/^(\p{Extended_Pictographic})/u);
            const emoji = m ? m[1] : '';
            if (emoji) {
                rainEmoji(emoji);
            }

            const idea = p.getAttribute('data-idea');
            const isSelected = p.classList.contains('selected');
            
            // Sync all pills with the same idea (e.g. main page and lightbox)
            document.querySelectorAll('.date-idea-pill').forEach(el => {
                if (el.getAttribute('data-idea') === idea) {
                    if (isSelected) {
                        el.classList.remove('selected');
                    } else {
                        el.classList.add('selected');
                    }
                }
            });

            updateDatesState();
        });

        // Handle adventure chip removal (delegated)
        document.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('.remove-adventure-btn');
            if (!removeBtn) return;

            const idea = removeBtn.getAttribute('data-idea');
            document.querySelectorAll('.date-idea-pill').forEach(p => {
                if (p.getAttribute('data-idea') === idea) {
                    p.classList.remove('selected');
                }
            });
            updateDatesState();
        });

        // Handle change location click (scroll up to input)
        document.addEventListener('click', (e) => {
            const changeBtn = e.target.closest('.change-location-btn');
            if (!changeBtn) return;

            const input = document.getElementById('rough-location');
            if (input) {
                input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => input.focus(), 500);
            }
        });

        // Handle change adventures click (scroll up to dates section)
        document.addEventListener('click', (e) => {
            const changeAdvBtn = e.target.closest('.change-adventures-btn');
            if (!changeAdvBtn) return;

            const datesSec = document.getElementById('dates');
            if (datesSec) {
                datesSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        document._datePillsDelegated = true;
    }

    function initLocationAutocomplete() {
        const input = document.getElementById('rough-location');
        const suggestionsBox = document.getElementById('location-suggestions');
        if (!input || !suggestionsBox) return;

        let debounceTimer;
        input.addEventListener('input', () => {
            updateDatesState();
            clearTimeout(debounceTimer);
            const query = input.value.trim();
            if (query.length < 3) {
                suggestionsBox.innerHTML = '';
                suggestionsBox.style.display = 'none';
                return;
            }

            debounceTimer = setTimeout(() => {
                const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&countrycodes=gb,us,nz,ca,au`;
                
                fetch(url, {
                    headers: {
                        'Accept-Language': 'en'
                    }
                })
                .then(res => res.json())
                .then(data => {
                    suggestionsBox.innerHTML = '';
                    if (data && data.length) {
                        data.forEach(item => {
                            const btn = document.createElement('button');
                            btn.type = 'button';
                            btn.className = 'suggestion-item';
                            
                            const parts = [];
                            const addr = item.address || {};
                            const main = addr.road || addr.suburb || addr.quarter || addr.neighbourhood || addr.railway || '';
                            const city = addr.city || addr.town || addr.village || addr.city_district || '';
                            const county = addr.county || addr.state || '';
                            const postcode = addr.postcode || '';
                            if (main) parts.push(main);
                            if (city) parts.push(city);
                            if (county) parts.push(county);
                            if (postcode) parts.push(postcode);
                            
                            const text = parts.length ? parts.join(', ') : item.display_name;
                            btn.textContent = text;
                            
                            btn.addEventListener('click', () => {
                                input.value = text;
                                suggestionsBox.innerHTML = '';
                                suggestionsBox.style.display = 'none';
                                updateDatesState();
                            });
                            suggestionsBox.appendChild(btn);
                        });
                        suggestionsBox.style.display = 'block';
                    } else {
                        suggestionsBox.style.display = 'none';
                    }
                })
                .catch(err => {
                    console.error('Error fetching location suggestions:', err);
                });
            }, 300);
        });

        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !suggestionsBox.contains(e.target)) {
                suggestionsBox.innerHTML = '';
                suggestionsBox.style.display = 'none';
            }
        });
        
        input.addEventListener('change', () => {
            updateDatesState();
        });
    }

    /* ── Floating site soundtrack (Spotify mini-player) ──
       A fixed corner widget so visitors can put on some background music
       while they scroll. The iframe is only injected the first time the
       panel is opened (keeps the initial page light), and the panel is
       hidden with CSS visibility — never removed — so the music keeps
       playing when the panel is tucked away. */
    function renderSoundtrack() {
        if (!C || !C.soundtrack) return;
        const s = C.soundtrack;
        const wrap = document.createElement('div');
        wrap.className = 'soundtrack';
        wrap.innerHTML =
            '<div class="soundtrack-panel">' +
            `<div class="soundtrack-head"><span>${esc(s.title)}</span>` +
            '<button class="soundtrack-close" type="button" aria-label="Hide player">×</button></div>' +
            '<div class="soundtrack-frame"></div>' +
            '</div>' +
            `<button class="soundtrack-toggle" type="button" aria-expanded="false" aria-label="${esc(
                s.label
            )}">` +
            `<span aria-hidden="true">🎧</span><span class="soundtrack-label">${esc(s.label)}</span>` +
            '</button>';
        document.body.appendChild(wrap);

        const toggle = wrap.querySelector('.soundtrack-toggle');
        const frame = wrap.querySelector('.soundtrack-frame');
        let loaded = false;
        const setOpen = (open) => {
            if (open && !loaded) {
                loaded = true;
                frame.innerHTML =
                    `<iframe src="${esc(s.embed)}" title="${esc(s.title)}" width="100%" height="${
                        Number(s.height) || 152
                    }" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
            }
            wrap.classList.toggle('open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            trackEvent('soundtrack_toggle', { 'open': open });
        };
        toggle.addEventListener('click', () => setOpen(!wrap.classList.contains('open')));
        wrap.querySelector('.soundtrack-close').addEventListener('click', () => setOpen(false));
        // Starting to scroll tucks the panel away again (the music keeps
        // playing — the panel is hidden, never removed).
        window.addEventListener(
            'scroll',
            () => {
                if (wrap.classList.contains('open')) setOpen(false);
            },
            { passive: true }
        );
    }

    /* ============================================================
       Interactions (run AFTER render so the DOM exists)
       ============================================================ */

    function renderNav() {
        if (!C || !C.nav || !C.nav.links) return;
        const html = C.nav.links.map(l => `<a href="${esc(l.href)}">${esc(l.label)}</a>`).join('');
        setHtml('#nav-menu', html);
    }

    // Hamburger nav (all screen sizes): toggles the fold-down link menu.
    // Tapping a link, pressing Escape, tapping outside the nav or starting
    // to scroll all close it.
    function initMobileNav() {
        const nav = document.querySelector('nav');
        const burger = document.querySelector('.nav-burger');
        if (!nav || !burger) return;
        const setOpen = (open) => {
            nav.classList.toggle('open', open);
            burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        };
        burger.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
        nav.querySelectorAll('a').forEach((a) =>
            a.addEventListener('click', () => setOpen(false))
        );
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') setOpen(false);
        });
        document.addEventListener('click', (e) => {
            if (nav.classList.contains('open') && !nav.contains(e.target)) setOpen(false);
        });
        // Scrolling the page dismisses the open menu — but only after real
        // movement (>24px from where it was opened), so the layout shift of
        // the fold-down itself can't instantly close it.
        let openedAtY = 0;
        burger.addEventListener('click', () => { openedAtY = window.scrollY; });
        window.addEventListener(
            'scroll',
            () => {
                if (nav.classList.contains('open') && Math.abs(window.scrollY - openedAtY) > 24) {
                    setOpen(false);
                }
            },
            { passive: true }
        );
    }

    function initScrollSpy() {
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        const sections = document.querySelectorAll('section[id]');
        if (!navLinks.length || !sections.length) return;

        let activeSectionId = null;
        let sectionTimer = null;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    navLinks.forEach((a) => a.classList.remove('active'));
                    const active = document.querySelector(`nav a[href="#${entry.target.id}"]`);
                    if (!active) return;
                    active.classList.add('active');
                    
                    const sectionId = entry.target.id;
                    if (sectionId !== activeSectionId) {
                        activeSectionId = sectionId;
                        clearTimeout(sectionTimer);
                        sectionTimer = setTimeout(() => {
                            trackEvent('section_view', { 'section_id': sectionId });
                        }, 1500);
                    }
                });
            },
            {rootMargin: '-40% 0px -55% 0px'}
        );
        sections.forEach((s) => observer.observe(s));
    }

    // Full deep-link URL for a card id, base-relative so it works on file:// too.
    const linkFor = (id) => location.href.split('#')[0] + (id ? '#' + id : '');

    // Open a deep-dive modal by key and reflect it in the URL so a refresh
    // (or a shared link) returns to the same topic.
    function openDeepModal(id) {
        const dlg = document.getElementById(id);
        if (!dlg || !dlg.classList.contains('deep-modal') || !dlg.showModal) return;
        if (!dlg.open) dlg.showModal();
        trackEvent('deep_modal_open', { 'modal_id': id });
        const body = dlg.querySelector('.deep-modal-body');
        if (body) body.scrollTop = 0;
        history.replaceState(null, '', '#' + id);

        if (window.initInfiniteSwipeForContainer) {
            setTimeout(() => {
                dlg.querySelectorAll('.feature-grid, .date-menu').forEach(window.initInfiniteSwipeForContainer);
            }, 100);
        }
    }

    // Copy text to the clipboard, with a tiny ✓ flash on the 🔗 button.
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
            navigator.clipboard.writeText(url).then(flash).catch(() => {});
        }
    }

    function initDeepDive() {
        if (document._deepDiveDelegated) return;
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.deep-card');
            if (card) {
                openDeepModal(card.getAttribute('data-modal'));
                return;
            }
            const dlg = e.target.closest('.deep-modal');
            if (dlg && e.target === dlg) {
                dlg.close();
            }
        });

        document.querySelectorAll('.deep-modal').forEach((dlg) => {
            if (dlg._listenerAttached) return;
            // Drop the #hash again once the modal is closed (Escape included).
            dlg.addEventListener('close', () => {
                trackEvent('deep_modal_close', { 'modal_id': dlg.id });
                if (location.hash === '#' + dlg.id) {
                    history.replaceState(null, '', location.pathname + location.search);
                }
            });
            const close = dlg.querySelector('.deep-modal-close');
            if (close) close.addEventListener('click', () => dlg.close());
            dlg._listenerAttached = true;
        });
        document._deepDiveDelegated = true;
    }

    function buildDeepDiveElements() {
        if (!C) return;
        if (C.deepDive) {
            const spoiler = C.deepDive.spoiler;
            if (spoiler) {
                setHtml('#deep-dive-spoiler', `
                    <div class="warning-banner">
                        <div class="w-emoji">${esc(spoiler.emoji)}</div>
                        <h2>${esc(spoiler.title)}</h2>
                        <p style="margin-top:16px; margin-bottom:0;">${esc(spoiler.body)}</p>
                    </div>
                `);
            }
            const locked = C.deepDive.lockedBanner;
            if (locked) {
                setHtml('#deep-dive-locked', `
                    <button class="locked-banner" type="button" aria-haspopup="dialog">
                        <span class="locked-emoji" aria-hidden="true">${esc(locked.emoji)}</span>
                        <span class="locked-title">${esc(locked.title)}</span>
                        <span class="locked-tagline">${esc(locked.tagline)}</span>
                    </button>
                `);
            }
        }
        const gag = C.cheekyGag;
        if (gag) {
            setHtml('#cheeky-dialog-content', `
                <div class="deep-modal-inner">
                    <div class="deep-modal-head">
                        <span class="deep-modal-emoji" aria-hidden="true">🙅</span>
                        <h3 class="deep-modal-title">${esc(gag.title)}</h3>
                        <span class="deep-link" role="button" tabindex="0" data-anchor="sexyPhotos" aria-label="Copy link to ${esc(gag.title)}" title="Copy link to this section">🔗</span>
                        <button class="deep-modal-close" type="button" aria-label="Close">×</button>
                    </div>
                    <div class="deep-modal-body">
                        <p>${esc(gag.teaseText)}</p>
                        <p><button class="cheeky-unlock" type="button" aria-haspopup="dialog">${esc(gag.unlockButton)}</button></p>
                    </div>
                </div>
            `);

            const punchline = document.querySelector('#cheeky-modal');
            if (punchline) {
                const head = punchline.querySelector('.deep-modal-head');
                if (head) {
                    head.innerHTML = `
                        <span class="deep-modal-emoji" aria-hidden="true">😏</span>
                        <h3 class="deep-modal-title">${esc(gag.punchlineTitle)}</h3>
                        <button class="deep-modal-close" type="button" aria-label="Close">×</button>
                    `;
                }
                const bodyLine = punchline.querySelector('.cheeky-line');
                if (bodyLine) {
                    bodyLine.textContent = gag.punchlineBody;
                }
            }
        }
    }

    // The 🔒 "sexy photos" gag: the locked banner under the deep-dive grid
    // opens the tease modal, whose 🔓 button swaps it for the punchline
    // modal — which is really just the contact + share cards.
    function initCheekyGag() {
        const banner = document.querySelector('.locked-banner');
        if (banner) banner.addEventListener('click', () => openDeepModal('sexyPhotos'));
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.cheeky-unlock')) return;
            const open = e.target.closest('dialog.deep-modal');
            if (open && open.id !== 'cheeky-modal') open.close();
            openDeepModal('cheeky-modal');
        });

        // "Shoot Your Shot" button — close modal, scroll to contact section
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.cheeky-shoot-btn')) return;
            const modal = document.getElementById('cheeky-modal');
            if (modal) modal.close();
            const contact = document.getElementById('contact');
            if (contact) {
                setTimeout(() => contact.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
            }
        });

        // "go on then" button — reveal tasteful photo gallery inside the modal
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.cheeky-goon-btn');
            if (!btn) return;
            const goOnP = btn.closest('.cheeky-goonthen');
            if (!goOnP) return;

            goOnP.innerHTML = `
                <p style="text-align: center; margin-bottom: 14px;">
                    <button type="button" class="cheeky-hide-btn">🙈 oops I don't want to see that</button>
                </p>
                <p style="font-size: 0.78rem; color: var(--muted); font-style: italic; margin-bottom: 14px;">
                    I told you I'd find a few nice ones 😉
                </p>
                <div class="cheeky-gallery">
                    <img src="img/alec/alec-portrait-moody-bw.jpg" alt="Alec looking sharp" loading="lazy">
                    <img src="img/alec/alec-dark-artistic-portrait.jpg" alt="Alec artistic portrait" loading="lazy">
                    <img src="img/alec/alec-cosy-bed-portrait.jpg" alt="Alec cosy portrait" loading="lazy">
                </div>
            `;
        });

        // Hide button — collapse gallery back to the tiny "go on then" button
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.cheeky-hide-btn');
            if (!btn) return;
            const goOnP = btn.closest('.cheeky-goonthen');
            if (!goOnP) return;

            goOnP.innerHTML = `
                <button type="button" class="cheeky-goon-btn" id="cheeky-goon-btn">actual sexy photos</button>
            `;
        });

        // Reset gallery when cheeky-modal is closed
        const cheekyModal = document.getElementById('cheeky-modal');
        if (cheekyModal) {
            cheekyModal.addEventListener('close', () => {
                const goOnP = cheekyModal.querySelector('.cheeky-goonthen');
                if (goOnP) {
                    goOnP.innerHTML = `
                        <button type="button" class="cheeky-goon-btn" id="cheeky-goon-btn">actual sexy photos</button>
                    `;
                }
            });
        }

    }

    // Open the deep-dive modal named in the URL hash, e.g. …#food.
    // Runs on load and on hashchange (e.g. clicking a #food anchor elsewhere).
    function openFromHash() {
        const id = decodeURIComponent((location.hash || '').replace(/^#/, ''));
        if (!id) return;
        const item = document.getElementById(id);
        if (!item) return;
        if (item.classList.contains('deep-modal')) {
            openDeepModal(id);
        } else {
            setTimeout(() => {
                item.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 150);
        }
    }

    // Section-heading 🔗 chips: point the URL at the section's id and copy the
    // deep link. Native browser scrolling handles the jump on the next load.
    function initDeepLinks() {
        if (document._deepLinksDelegated) return;
        const activate = (e, link) => {
            e.preventDefault();
            e.stopPropagation();
            const id = link.getAttribute('data-anchor');
            if (id) {
                history.replaceState(null, '', '#' + id);
                const target = document.getElementById(id) || document.querySelector(`[data-section="${id}"]`);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
            copyLink(linkFor(id), link);
        };
        
        document.addEventListener('click', (e) => {
            const link = e.target.closest('.deep-link');
            if (link) activate(e, link);
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const link = e.target.closest('.deep-link');
                if (link) activate(e, link);
            }
        });
        document._deepLinksDelegated = true;
    }

    // Share cards: wire the native "Share…" buttons and the "Copy link"
    // buttons (both instances — the #contact card and the date modal's).
    function initShare() {
        document.querySelectorAll('.share-native').forEach((native) => {
            if (!navigator.share || native._listenerAttached) return;
            native.addEventListener('click', () => {
                const s = C.share || {};
                navigator
                    .share({title: document.title, text: s.text || '', url: shareUrl()})
                    .catch(() => {}); // user cancelled or unsupported — ignore
            });
            native._listenerAttached = true;
        });

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
                    navigator.clipboard.writeText(url).then(done).catch(() => {});
                }
            });
            btn._listenerAttached = true;
        });
    }

    let secretRevealed = false;

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

        function showTickleToast() {
            if (secretRevealed) return;
            if (document.querySelector('.tickle-toast')) return;
            const container = getActiveContainer();
            const toast = document.createElement('div');
            toast.className = 'konami-toast tickle-toast';
            toast.innerHTML = "<strong>Hey, that tickles! 🤭</strong><span class=\"konami-sub\">maybe there's a secret... keep tapping?</span>";
            container.appendChild(toast);
            requestAnimationFrame(() => toast.classList.add('show'));
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 400);
            }, 2000);
        }

        function attachEasterEggClick(el) {
            if (!el) return;
            let taps = 0;
            let tapTimer = null;
            el.addEventListener('click', () => {
                taps++;
                trackEvent('easter_egg_tap', { 'element_id': el.id || el.className || 'element', 'tap_count': taps });
                if (tapTimer) clearTimeout(tapTimer);
                if (taps === 1) {
                    showTickleToast();
                }
                if (taps >= 7) {
                    taps = 0;
                    revealSecret();
                } else {
                    tapTimer = setTimeout(() => { taps = 0; }, 600);
                }
            });
            // Prevent text highlighting during rapid taps
            el.style.userSelect = 'none';
            // Provide a cursor hint
            el.style.cursor = 'pointer';
        }

        attachEasterEggClick(document.getElementById('footer-emoji'));
        attachEasterEggClick(document.querySelector('.hero-emoji'));
        document.querySelectorAll('.section-tag').forEach(attachEasterEggClick);
    }

    // The 1-UP reveal — a celebratory toast + a shower of hearts. Self-removing,
    // and guarded so spamming the code doesn't stack duplicates.
    function revealSecret() {
        secretRevealed = true;
        trackEvent('konami_triggered');
        if (document.querySelector('.konami-toast:not(.tickle-toast)')) return;
        const container = getActiveContainer();
        const toast = document.createElement('div');
        toast.className = 'konami-toast';
        toast.innerHTML =
            '<span class="konami-1up">1-UP!</span>' +
            "<strong>It's a secret to everybody.</strong>" +
            '<span class="konami-sub">🍄 +30 lives · you found the cheat code 🎮</span>';
        container.appendChild(toast);

        const emojis = (C && C.easterEgg && C.easterEgg.emojis) || ['❤️', '🍄', '⭐', '🎮'];
        for (let i = 0; i < 14; i++) {
            const h = document.createElement('div');
            h.className = 'konami-heart';
            h.textContent = emojis[i % emojis.length];
            h.style.left = Math.random() * 100 + 'vw';
            h.style.animationDelay = Math.random() * 0.6 + 's';
            container.appendChild(h);
            setTimeout(() => h.remove(), 2600);
        }
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 4200);
    }

    // Both overlays are native <dialog> elements opened with showModal(), so
    // Escape handling, focus trapping and stacking (lightbox over gallery,
    // Escape closes the topmost first) come from the browser. The page scroll
    // lock lives in CSS: body:has(dialog[open]) { overflow: hidden }.
    function initLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        if (!lightbox || !lightboxImg) return;

        let currentImages = [];
        let currentIndex = -1;

        const selectors =
            '[data-zoom], .mosaic-strip img, .gallery-grid img, .poster-grid img, .photo-grid img, .labeled-photo-card img, .gif-grid img, .feature img, .date-card img, .place-card img, .logo-tile img, .interest-card-photos img, .cheeky-gallery img, .testimonial-img-wrapper img';

        function getCaption(img) {
            const testimonial = img.closest('.testimonial-row');
            if (testimonial) {
                const title = testimonial.querySelector('h3');
                const text = testimonial.querySelector('.testimonial-text');
                const signature = testimonial.querySelector('.testimonial-signature');
                let html = '';
                if (title) html += '<h3>' + title.innerHTML + '</h3>';
                if (text) html += '<p>' + text.innerHTML + '</p>';
                if (signature) html += '<div class="testimonial-signature" style="margin-top: 10px; font-weight:600; color:var(--accent-light);">' + signature.innerHTML + '</div>';
                return html || img.alt;
            }
            const feature = img.closest('.feature');
            if (feature) {
                const title = feature.querySelector('strong');
                const text = feature.querySelector('.feature-text');
                let html = '';
                if (title) html += '<h3>' + title.innerHTML + '</h3>';
                if (text) html += '<p>' + text.innerHTML + '</p>';
                return html || img.alt;
            }
            const labeledPhoto = img.closest('.labeled-photo-card');
            if (labeledPhoto) {
                const label = labeledPhoto.querySelector('.labeled-photo-label');
                return label ? label.innerHTML : img.alt;
            }
            const dateCard = img.closest('.date-card');
            if (dateCard) {
                const title = dateCard.querySelector('h3');
                const pills = dateCard.querySelector('.date-pills');
                let html = '';
                if (title) html += '<h3>' + title.innerHTML + '</h3>';
                if (pills) html += '<div class="date-pills" style="margin-top: 12px;">' + pills.innerHTML + '</div>';
                return html || img.alt;
            }
            const placeCard = img.closest('.place-card');
            if (placeCard) {
                const title = placeCard.querySelector('strong');
                return title ? '<h3>' + title.innerHTML + '</h3>' : img.alt;
            }
            return img.alt || '';
        }

        function showImage(index) {
            if (index < 0) index = currentImages.length - 1;
            if (index >= currentImages.length) index = 0;
            currentIndex = index;
            const img = currentImages[currentIndex];
            if (!img) return;
            lightboxImg.src = img.currentSrc || img.src;
            lightboxImg.alt = img.alt;
            trackEvent('lightbox_image_view', { 'image_src': img.src, 'image_alt': img.alt || '' });

            const lightboxTitle = document.querySelector('.lightbox-title');
            if (lightboxTitle) {
                const section = img.closest('section, dialog');
                if (section) {
                    const h2 = section.querySelector('h2, .deep-modal-title');
                    if (h2) {
                        lightboxTitle.innerHTML = h2.innerHTML;
                    } else {
                        lightboxTitle.innerHTML = '';
                    }
                }
            }

            if (lightboxCaption) {
                const cap = getCaption(img);
                lightboxCaption.innerHTML = cap;
                if (cap && cap.trim()) {
                    const h3 = lightboxCaption.querySelector('h3');
                    if (h3) {
                        const slug = getSlug(img);
                        if (slug) {
                            h3.insertAdjacentHTML('beforeend', ` <span class="deep-link" role="button" tabindex="0" data-anchor="${slug}" title="Copy link to this photo">🔗</span>`);
                        }
                    }
                }
                lightboxCaption.style.display = cap && cap.trim() ? 'block' : 'none';
            }
        }

        // Any click — image, close button or backdrop — dismisses the lightbox.
        lightbox.addEventListener('click', (e) => {
            if (e.target.closest('.lightbox-prev')) {
                showImage(currentIndex - 1);
                return;
            }
            if (e.target.closest('.lightbox-next')) {
                showImage(currentIndex + 1);
                return;
            }
            if (e.target.closest('.lightbox-caption') || e.target.closest('.lightbox-nav')) {
                return;
            }
            lightbox.close();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.open) return;
            if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        });

        // Drop the old image once closed so it can't flash up next time.
        lightbox.addEventListener('close', () => {
            trackEvent('lightbox_close');
            lightboxImg.removeAttribute('src');
            if (lightboxCaption) lightboxCaption.textContent = '';
            if (location.hash) history.replaceState(null, null, ' ');
        });

        function getSlug(img) {
            const feature = img.closest('.feature');
            if (feature) {
                const strong = feature.querySelector('strong');
                if (strong) return strong.textContent.toLowerCase().replace(/[^a-z0-9]/g, '');
            }
            const dateCard = img.closest('.date-card');
            if (dateCard) {
                const title = dateCard.querySelector('h3');
                if (title) return title.textContent.toLowerCase().replace(/[^a-z0-9]/g, '');
            }
            const placeCard = img.closest('.place-card');
            if (placeCard) {
                const title = placeCard.querySelector('strong');
                if (title) return title.textContent.toLowerCase().replace(/[^a-z0-9]/g, '');
            }
            return img.alt ? img.alt.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
        }

        function checkHashForLightbox() {
            const hash = location.hash.replace(/^#/, '');
            if (!hash) return;
            
            // Ignore if the hash points to an actual ID on the page (like #about or a deep-modal)
            if (document.getElementById(hash)) return;

            const imgs = Array.from(document.querySelectorAll(selectors)).filter(i => !i.classList.contains('flag') && i.tagName === 'IMG');
            const target = imgs.find(img => {
                const slug = getSlug(img);
                return slug && (slug === hash || slug.endsWith(hash));
            });
            if (target) {
                const container = target.closest('dialog') || target.closest('section') || target.closest('.container') || document.body;
                currentImages = Array.from(container.querySelectorAll(selectors)).filter(i => !i.classList.contains('flag') && i.tagName === 'IMG');
                currentIndex = currentImages.indexOf(target);
                showImage(currentIndex);
                if (!lightbox.open) lightbox.showModal();
            }
        }

        window.addEventListener('hashchange', checkHashForLightbox);
        setTimeout(checkHashForLightbox, 100);

        // Delegated so it covers images injected after load.
        document.addEventListener('click', (e) => {
            const openGallery = e.target.closest('[data-open-gallery="photography"]');
            if (openGallery) {
                const modal = document.getElementById('photography-gallery-modal');
                if (modal) {
                    modal.showModal();
                }
                return;
            }

            // First try matching an image directly
            let img = e.target.closest(selectors);
            
            // If they clicked inside a card but not exactly on the img, find the image inside that card
            if (!img && e.target.tagName !== 'IMG') {
                if (e.target.closest('button, a, .pill, .date-idea-pill, .tag-item, .fact, .chip, input, select, textarea')) return;
                const card = e.target.closest('.feature, .date-card, .place-card, .interest-card, .labeled-photo-card, .faces-item, .logo-tile');
                if (card) {
                    img = card.querySelector(selectors);
                }
            }

            if (!img || img.tagName !== 'IMG') return;
            if (img.classList.contains('flag')) return; // tiny inline flags aren't zoomable
            
            // Gather images dynamically for gallery navigation, scoped to the current section
            const container = img.closest('dialog') || img.closest('section') || img.closest('.container') || document.body;

            // If the clicked image is a clone, map it to its original counterpart
            if (img.closest('[data-clone-pre]') || img.closest('[data-clone-post]')) {
                const originalImages = Array.from(container.querySelectorAll(selectors)).filter(i => !i.classList.contains('flag') && i.tagName === 'IMG' && !i.closest('[data-clone-pre]') && !i.closest('[data-clone-post]'));
                const match = originalImages.find(i => i.src === img.src && i.alt === img.alt);
                if (match) img = match;
            }

            currentImages = Array.from(container.querySelectorAll(selectors)).filter(i => {
                if (i.classList.contains('flag') || i.tagName !== 'IMG') return false;
                if (i.closest('[data-clone-pre]') || i.closest('[data-clone-post]')) return false;
                return true;
            });
            currentIndex = currentImages.indexOf(img);
            
            showImage(currentIndex);
            lightbox.showModal();
        });
    }

    // The "view all photos" gallery: a full-screen grid of every face photo so
    // people can browse the whole set at once instead of waiting on the marquee.
    // Tapping a photo still opens the lightbox (delegated in initLightbox).
    function initGallery() {
        const gallery = document.getElementById('gallery');
        if (!gallery) return;

        if (C && C.faces && C.faces.photos) {
            const photos = C.faces.photos;
            const html = photos.map((p) => img(p.src, p.alt, '', { w: p.w, h: p.h })).join('');
            setHtml('[data-gallery="grid"]', html);
            setText('[data-gallery="title"]', C.faces.heading || 'Photos');
        }

        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-faces="expand"]') || e.target.closest('#faces-expand-btn')) {
                gallery.showModal();
                gallery.scrollTop = 0;
                trackEvent('gallery_open');
                return;
            }
            if (e.target.closest('.gallery-close')) return gallery.close();
            if (e.target === gallery) gallery.close(); // click outside the photos
        });

        gallery.addEventListener('close', () => {
            trackEvent('gallery_close');
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

    function initCyclingImages() {
        const slots = [];
        
        // Convert hero images into cycling slots
        const heroMedia = document.querySelector('[data-hero="media"]');
        if (heroMedia) {
            Array.from(heroMedia.children).forEach(img => {
                if (img.tagName !== 'IMG') return;
                const wrapper = document.createElement('div');
                wrapper.className = 'cycling-images';
                img.parentNode.insertBefore(wrapper, img);
                img.classList.add('active');
                wrapper.appendChild(img);
                slots.push(wrapper);
            });
        }
        
        // Convert profile photo into a cycling slot
        const profilePhoto = document.querySelector('.profile-photo');
        if (profilePhoto) {
            const img = profilePhoto.querySelector('img');
            if (img) {
                const wrapper = document.createElement('div');
                wrapper.className = 'cycling-images';
                img.parentNode.insertBefore(wrapper, img);
                img.classList.add('active');
                wrapper.appendChild(img);
                slots.push(wrapper);
            }
        }
        
        if (slots.length === 0) return;

        if (!C.faces?.photos?.length) return;

        // Get all portrait images from faces (height > width)
        const portraits = C.faces.photos.filter(p => p.h > p.w);
        
        const onsen1 = "alec-silly-face-japanese-onsen.webp";
        const onsen2 = "alec-japanese-onsen-curtain.webp";

        if (window._cyclingImagesInterval) clearInterval(window._cyclingImagesInterval);

        window._cyclingImagesInterval = setInterval(() => {
            if (document.hidden) return;
            // Pick a random slot
            const slot = slots[Math.floor(Math.random() * slots.length)];
            
            // Collect currently visible image sources
            const currentSrcs = slots.map(s => {
                const active = s.querySelector('img.active');
                return active ? active.getAttribute('src') : null;
            }).filter(Boolean);
            
            const activeSrc = slot.querySelector('img.active')?.getAttribute('src');
            const otherSrcs = currentSrcs.filter(src => src !== activeSrc);
            
            const othersHaveOnsen1 = otherSrcs.some(src => src && src.includes(onsen1));
            const othersHaveOnsen2 = otherSrcs.some(src => src && src.includes(onsen2));

            let available = portraits.filter(p => {
                // Don't pick an image that's currently visible
                if (currentSrcs.some(src => src && src.includes(p.src))) return false;
                
                // If the OTHER slots have onsen1, don't allow onsen2
                if (othersHaveOnsen1 && p.src.includes(onsen2)) return false;
                // If the OTHER slots have onsen2, don't allow onsen1
                if (othersHaveOnsen2 && p.src.includes(onsen1)) return false;
                
                return true;
            });
            
            if (available.length === 0) return;
            
            const nextPhoto = available[Math.floor(Math.random() * available.length)];
            
            const newImg = document.createElement('img');
            newImg.src = nextPhoto.src;
            const fallbackAlt = (C.meta && C.meta.defaultAlt) || "Alec Doran-Twyford";
            newImg.alt = nextPhoto.alt || fallbackAlt;
            
            // Preserve object position from the original image (e.g., hero's center 22%)
            const oldImg = slot.querySelector('img.active');
            if (oldImg && oldImg.style.objectPosition) {
                newImg.style.objectPosition = oldImg.style.objectPosition;
            }
            
            slot.appendChild(newImg);
            
            // Trigger reflow for transition
            void newImg.offsetWidth;
            
            newImg.classList.add('active');
            if (oldImg) {
                oldImg.classList.remove('active');
                // Remove old image after CSS fade transition (0.9s)
                setTimeout(() => {
                    if (oldImg.parentNode === slot) slot.removeChild(oldImg);
                }, 1000);
            }
        }, 2500);
    }

    function initStaticContent() {
        if (!C) return;
        
        if (C.nav) {
            setText('#nav-burger-label', C.nav.menuLabel);
            if (C.nav.ctaText) {
                setHtml('#nav-cta-container', `<a href="#contact" class="nav-contact"><span id="nav-cta">${esc(C.nav.ctaText)}</span></a>`);
                setHtml('#floating-cta-title', esc(C.nav.ctaText));
            }
        }
        if (C.hero) {
            setText('#hero-scroll-hint', C.hero.scrollHint);
        }
        if (C.profile) {
            if (C.profile.tag) {
                setHtml('#profile-tag-container', `<div class="section-tag tag-purple">${esc(C.profile.tag)}</div>`);
            }
            if (C.faces && C.faces.photos && C.faces.photos.length > 0) {
                setHtml('#faces-expand-btn', esc(C.profile.viewPhotosLabel));
            } else {
                const btn = document.getElementById('faces-expand-btn');
                if (btn) btn.style.display = 'none';
            }
            setHtml('#profile-evolving-note', C.profile.evolvingNote);
        }
        if (C.deepDive) {
            setText('#deep-dive-tag', C.deepDive.tag);
            const titleHtml = `${esc(C.deepDive.title)}${headingLink('deep-dive', C.deepDive.title)}`;
            setHtml('#deep-dive-title', titleHtml);
        }
        if (C.footer) {
            setText('#footer-emoji', C.footer.emoji);
            setText('#footer-note', C.footer.note);
            setHtml('#footer-credit', C.footer.credit);
        }

        // Hide empty structural sections to avoid blank padding gaps
        if (!C.contact && !C.share) {
            const contactSection = document.getElementById('contact');
            if (contactSection) contactSection.style.display = 'none';
        }
        if (!C.outro) {
            const outroSection = document.getElementById('outro');
            if (outroSection) outroSection.style.display = 'none';
        }
        if (!C.profile) {
            const aboutSection = document.getElementById('about');
            if (aboutSection) aboutSection.style.display = 'none';
        }
        if (!C.deepDive) {
            const deepDiveSection = document.getElementById('deep-dive');
            if (deepDiveSection) deepDiveSection.style.display = 'none';
        }
    }

    function initInfiniteSwipe() {
        if (window.innerWidth > 600) return;

        const containers = document.querySelectorAll('.feature-grid, .date-menu');
        containers.forEach(container => {
            const children = Array.from(container.children);
            if (children.length <= 1) return;

            const clonesPre = children.map(child => {
                const clone = child.cloneNode(true);
                clone.dataset.clonePre = 'true';
                return clone;
            });
            const clonesPost = children.map(child => {
                const clone = child.cloneNode(true);
                clone.dataset.clonePost = 'true';
                return clone;
            });

            clonesPre.reverse().forEach(clone => {
                container.insertBefore(clone, container.firstChild);
            });
            clonesPost.forEach(clone => {
                container.appendChild(clone);
            });

            container.addEventListener('scroll', () => {
                if (container.dataset.initialized !== 'true') return;

                const scrollLeft = container.scrollLeft;
                const childrenArray = Array.from(container.children);
                const preClones = childrenArray.filter(el => el.dataset.clonePre === 'true');
                const originalItems = childrenArray.filter(el => !el.dataset.clonePre && !el.dataset.clonePost);
                
                const preWidth = preClones.reduce((acc, el) => acc + el.offsetWidth + 16, 0);
                const originalWidth = originalItems.reduce((acc, el) => acc + el.offsetWidth + 16, 0);

                if (scrollLeft < preWidth - 10) {
                    container.scrollLeft = scrollLeft + originalWidth;
                } else if (scrollLeft > preWidth + originalWidth + 10) {
                    container.scrollLeft = scrollLeft - originalWidth;
                }
            });

            if (container.offsetWidth > 0) {
                setTimeout(() => {
                    window.initInfiniteSwipeForContainer(container);
                }, 100);
            }
        });
    }

    window.initInfiniteSwipeForContainer = (container) => {
        if (container.dataset.initialized === 'true') return;
        if (container.offsetWidth === 0) return;

        container.dataset.initialized = 'true';
        const preClones = Array.from(container.children).filter(el => el.dataset.clonePre === 'true');
        const preWidth = preClones.reduce((acc, el) => acc + el.offsetWidth + 16, 0);
        container.scrollLeft = preWidth;
    };



    function initCollapsibleCards() {
        document.addEventListener('click', (e) => {
            if (window.innerWidth > 600) return;
            const header = e.target.closest('.value-card-header');
            if (!header) return;
            const card = header.closest('.value-card-collapsible');
            if (card) {
                card.classList.toggle('collapsed');
            }
        });
    }

    function initFloatingCta() {
        document.addEventListener('click', (e) => {
            const cta = e.target.closest('.floating-cta');
            if (!cta) return;
            e.preventDefault();
            const target = document.getElementById('contact');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                history.pushState(null, '', '#contact');
            }
        });
    }

    function initFadingCollage() {
        const containers = document.querySelectorAll('.fading-collage');
        containers.forEach(container => {
            let images = [];
            try { images = JSON.parse(container.getAttribute('data-images') || '[]'); } catch (e) {}
            if (!images.length) return;
            
            container.innerHTML = '';
            container.classList.add('scattered-mode');
            
            let imageIndex = 0;
            images.sort(() => Math.random() - 0.5);
            const getNextImage = () => images[imageIndex++ % images.length];

            const maxPhotos = window.innerWidth < 600 ? 12 : 24;
            const photoDuration = 10000; // 10s
            const interval = photoDuration / maxPhotos; 

            const createPhoto = () => {
                const imgData = getNextImage();
                const photo = document.createElement('div');
                photo.className = 'scattered-photo';
                
                const size = window.innerWidth < 600 ? (35 + Math.random() * 25) : (20 + Math.random() * 15); 
                const top = Math.random() * 60; 
                const left = Math.random() * (100 - size);
                const rot = (Math.random() - 0.5) * 40; 
                
                photo.style.width = `${size}%`;
                photo.style.top = `${top}%`;
                photo.style.left = `${left}%`;
                photo.dataset.rot = rot;
                photo.style.transform = `rotate(${rot}deg) scale(0.9)`;
                photo.style.opacity = '0';
                
                const img = document.createElement('img');
                img.src = imgData.src;
                img.alt = imgData.alt || '';
                photo.appendChild(img);
                
                return photo;
            };

            const removePhoto = (photo) => {
                photo.style.opacity = '0';
                photo.style.transform = `rotate(${photo.dataset.rot}deg) scale(0.9)`;
                setTimeout(() => {
                    if (photo.parentNode === container) container.removeChild(photo);
                }, 1500);
            };

            for (let i = 0; i < maxPhotos; i++) {
                const photo = createPhoto();
                container.appendChild(photo);
                void photo.offsetWidth;
                photo.style.opacity = '1';
                photo.style.transform = `rotate(${photo.dataset.rot}deg) scale(1)`;
                
                const lifespan = (0.5 + Math.random() * 0.5) * photoDuration;
                setTimeout(() => removePhoto(photo), lifespan);
            }

            setInterval(() => {
                const photo = createPhoto();
                container.appendChild(photo);
                void photo.offsetWidth;
                photo.style.opacity = '1';
                photo.style.transform = `rotate(${photo.dataset.rot}deg) scale(1)`;
                
                setTimeout(() => removePhoto(photo), photoDuration);
            }, interval);
        });
    }

    function initGlobalAnalytics() {
        // 1. Scroll Depth tracking (25%, 50%, 75%, 90%)
        let scrollMilestones = { 25: false, 50: false, 75: false, 90: false };
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY || window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight <= 0) return;
            const pct = Math.round((scrollTop / docHeight) * 100);
            for (let m in scrollMilestones) {
                if (pct >= Number(m) && !scrollMilestones[m]) {
                    scrollMilestones[m] = true;
                    trackEvent('scroll_depth', { 'depth_percentage': Number(m) });
                }
            }
        }, { passive: true });

        // 2. Global click tracking (links, buttons, interactive items)
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a');
            if (anchor) {
                const href = anchor.getAttribute('href') || '';
                const text = anchor.textContent.trim();
                const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
                trackEvent('link_click', {
                    'link_url': href,
                    'link_text': text || anchor.title || 'Untitled',
                    'link_type': isExternal ? 'external' : 'internal'
                });
                return;
            }

            const btn = e.target.closest('button');
            if (btn) {
                const text = btn.textContent.trim();
                const id = btn.id || '';
                const classes = btn.className || '';
                trackEvent('button_click', {
                    'button_text': text || btn.ariaLabel || 'Untitled',
                    'button_id': id,
                    'button_classes': classes
                });
            }
        });
    }

    /* ── boot ── */
    function boot() {
        if (!C) {
            console.error('content.js did not load — window.CONTENT is undefined.');
            return;
        }
        initImageFallback();
        initStaticContent();
        renderNav();
        buildDeepDiveElements();
        renderHero();
        renderProfile();
        // Faces section removed, using hero/profile image swapping instead
        renderDeepDive();
        renderSections();
        renderConnectCard(C.contact, '[data-connect="contact"]');
        renderPrompts();
        renderShare('[data-share="share"]');
        // and so does the punchline of the 🔒 "sexy photos" gag.
        renderConnectCard(C.contact, '[data-connect="cheeky-modal"]');
        renderShare('[data-share="cheeky-modal"]');
        renderConnectCard(C.outro, '[data-connect="outro"]');
        renderFooterLinks();
        renderSoundtrack();

        initMobileNav();
        initScrollSpy();
        initDeepDive();
        initCheekyGag();
        initDeepLinks();
        initShare();
        initDatePills();
        initLocationAutocomplete();
        updateDatesState();
        initPrompts();
        initLightbox();
        initGallery();
        initCyclingImages();
        initKonami();
        initFactClicks();
        initInfiniteSwipe();
        initCollapsibleCards();
        initFloatingCta();
        initFadingCollage();
        initGlobalAnalytics();

        openFromHash();
        window.addEventListener('hashchange', openFromHash);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
