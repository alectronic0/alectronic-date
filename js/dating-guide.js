// Dating apps & matchmakers guide (labs/dating/): hub, apps and matchmakers pages.
// <main data-kind="hub|apps|matchmakers"> picks the page. Data: window.DATING_SERVICES (hand-curated),
// window.DATING_RATINGS (App Store, from pipeline/dating_ratings.py), window.DatingRating (the rule).
(function () {
  const { esc, safeUrl, safeAsset, logoHtml, bindLogoFallback } = window.LabsUI;
  const { RATINGS, RECENT_YEARS, ratingFor } = window.DatingRating;
  const CATEGORIES = {
    mainstream: 'Mainstream',
    lgbtq: 'LGBTQ+',
    faith: 'Faith',
    enm: 'Open & ENM',
    'over-50s': 'Over 50s',
    premium: 'Premium',
    rural: 'Rural',
    'international-paid-chat': 'Paid chat',
    affairs: 'Affairs',
    sugar: 'Sugar dating',
    'ai-matchmaker': 'AI matchmaker',
    matchmaker: 'Matchmaker',
  };
  const TRACK_TYPES = {
    regulator: 'Regulator action',
    court: 'Court case',
    asa: 'ASA ruling',
    breach: 'Data exposure',
    'fake-profiles': 'Fake profiles',
    billing: 'Billing & cancellation',
    safety: 'Safety',
  };

  const data = window.DATING_SERVICES || { owners: [], apps: [], matchmakers: [] };
  const appStore = window.DATING_RATINGS || {};
  const ownersById = Object.fromEntries((data.owners || []).map((o) => [o.id, o]));
  const state = { query: '', rating: '', owner: '', category: '', verifiedOnly: false };
  const $ = (id) => document.getElementById(id);

  function today() {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }

  function monthYear(iso) {
    return new Date(`${iso.slice(0, 10)}T00:00:00`).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
  }

  function rated(service) {
    return { ...service, verdict: ratingFor(service, today()) };
  }

  function ratingPill(rating, extra) {
    const r = RATINGS[rating];
    return `<span class="trust-pill trust-${rating}">${r.icon} ${r.label}${extra || ''}</span>`;
  }

  // ---------- Event cross-link: services that also host nights in the singles guide ----------

  function eventCounts() {
    const items = (window.CONTENT && window.CONTENT.singlesGuide && window.CONTENT.singlesGuide.items) || [];
    const counts = {};
    const now = today();
    items.filter((e) => e.hostId && e.startDate >= now).forEach((e) => { counts[e.hostId] = (counts[e.hostId] || 0) + 1; });
    return counts;
  }

  // ---------- Cards ----------

  function factRow(label, value) {
    if (value == null || value === '' || (Array.isArray(value) && !value.length)) return '';
    const text = Array.isArray(value) ? value.join(', ') : value;
    return `<div class="fact"><dt>${esc(label)}</dt><dd>${esc(text)}</dd></div>`;
  }

  function trackHtml(track) {
    if (!track || !track.length) return '';
    const rows = [...track].sort((a, b) => b.date.localeCompare(a.date)).map((t) => `
      <li class="track-item sev-${esc(t.severity)}">
        <span class="track-when">${esc(monthYear(t.date))}</span>
        <span class="track-type">${esc(TRACK_TYPES[t.type] || t.type)}</span>
        <span class="track-text">${esc(t.summary)}${t.status ? ` <em>(${esc(t.status)})</em>` : ''}</span>
        ${safeUrl(t.source) ? `<a href="${esc(t.source)}" target="_blank" rel="noopener noreferrer" class="track-source">Source ↗</a>` : ''}
      </li>`).join('');
    return `<details class="track"><summary>Track record (${track.length})</summary><ul>${rows}</ul></details>`;
  }

  function reasonsHtml(verdict) {
    if (verdict.rating === 'checked' && !verdict.byHand) return '';
    const label = verdict.byHand ? 'Rated by hand' : 'Why';
    return `<ul class="why">${verdict.reasons.map((r) => `<li><strong>${label}:</strong> ${esc(r.text)}</li>`).join('')}</ul>`;
  }

  function appStoreText(service) {
    const live = appStore[service.slug];
    if (!live) return null;
    return `${live.rating.toFixed(1)}★ from ${live.count.toLocaleString('en-GB')} UK ratings`;
  }

  function trustpilotText(service) {
    const tp = service.trustpilot;
    if (!tp) return null;
    return `${tp.score} from ${tp.reviews.toLocaleString('en-GB')} reviews (${monthYear(tp.checked)})`;
  }

  function storeLinks(service) {
    const links = [];
    if (service.appStoreId) links.push(['App Store', `https://apps.apple.com/gb/app/id${encodeURIComponent(service.appStoreId)}`]);
    if (service.playStoreId) links.push(['Google Play', `https://play.google.com/store/apps/details?id=${encodeURIComponent(service.playStoreId)}&hl=en_GB`]);
    return links.map(([label, href]) => `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer" class="card-action secondary store">${label} ↗</a>`).join('');
  }

  function card(service, events) {
    const { verdict } = service;
    const owner = ownersById[service.ownerId];
    const upcoming = service.eventsHostId ? events[service.eventsHostId] || 0 : 0;
    const facts = service.kind === 'matchmaker' ? [
      factRow('Trade body', service.abia ? 'ABIA member' : 'Not an ABIA member'),
      factRow('Price', service.price),
      factRow('Consultation', service.consultation),
      factRow('Contract', service.contractLength),
      factRow('Areas', service.areas),
      factRow('Trustpilot', trustpilotText(service)),
    ] : [
      factRow('Verification', service.verification == null ? 'Not confirmed' : service.verification.length ? service.verification : 'None'),
      factRow('Safety tools', service.safety),
      factRow('Price', service.price),
      factRow('App Store', appStoreText(service)),
      factRow('Trustpilot', trustpilotText(service)),
    ];
    return `
      <article class="event-card dating-card trust-border-${verdict.rating}">
        <div>
          <div class="card-header">
            <span class="category-badge">${esc(CATEGORIES[service.category] || service.category)}</span>
            <span class="card-pills">
              ${service.alecTrusts ? '<span class="alec-badge">💙 Alec uses this</span>' : ''}
              ${ratingPill(verdict.rating, verdict.byHand ? ' · by hand' : '')}
            </span>
          </div>
          <div class="platform-head">
            ${logoHtml(service.name, safeAsset(service.logo), 'platform-logo')}
            <div>
              <h2 class="card-title">${esc(service.name)}</h2>
              ${owner ? `<span class="owner-badge">Owned by ${esc(owner.name)}</span>` : ''}
            </div>
          </div>
          <p class="card-desc">${esc(service.suits)}</p>
          ${reasonsHtml(verdict)}
          <dl class="facts">${facts.join('')}</dl>
          ${service.myTake ? `<blockquote class="my-take"><strong>Alec's take:</strong> ${esc(service.myTake)}</blockquote>` : ''}
          ${trackHtml(service.track)}
        </div>
        <div class="card-actions">
          ${upcoming ? `<a href="../events.html#schedule" class="card-action secondary">🗓️ ${upcoming} upcoming event${upcoming === 1 ? '' : 's'}</a>` : ''}
          <a href="${esc(safeUrl(service.url))}" target="_blank" rel="noopener noreferrer" class="card-action">Website ↗</a>
          ${storeLinks(service)}
        </div>
      </article>`;
  }

  // ---------- List pages ----------

  function matches(service) {
    if (state.rating && service.verdict.rating !== state.rating) return false;
    if (state.owner && service.ownerId !== state.owner) return false;
    if (state.category && service.category !== state.category) return false;
    if (state.verifiedOnly && !(service.verification || []).length) return false;
    if (!state.query) return true;
    const owner = ownersById[service.ownerId];
    return [service.name, service.suits, owner && owner.name, CATEGORIES[service.category], ...(service.verification || [])]
      .join(' ').toLowerCase().includes(state.query);
  }

  function renderList(services) {
    const events = eventCounts();
    const shown = services.filter(matches);
    $('dating-count').textContent = `Showing ${shown.length} of ${services.length}`;
    $('dating-grid').innerHTML = shown.length
      ? shown.map((s) => card(s, events)).join('')
      : '<div class="empty-state">Nothing matches. Try clearing a filter.</div>';
  }

  function options(select, entries, allLabel) {
    select.innerHTML = `<option value="">${esc(allLabel)}</option>` +
      entries.map(([value, label]) => `<option value="${esc(value)}">${esc(label)}</option>`).join('');
  }

  function bindList(services) {
    const order = { checked: 0, caution: 1, avoid: 2 };
    services.sort((a, b) => order[a.verdict.rating] - order[b.verdict.rating] || a.name.localeCompare(b.name));
    const owners = [...new Set(services.map((s) => s.ownerId).filter(Boolean))]
      .map((id) => [id, (ownersById[id] || { name: id }).name]).sort((a, b) => a[1].localeCompare(b[1]));
    const categories = [...new Set(services.map((s) => s.category))].map((c) => [c, CATEGORIES[c] || c]);
    if ($('owner-select')) options($('owner-select'), owners, 'All owners');
    if ($('category-select')) options($('category-select'), categories, 'All types');
    document.querySelectorAll('[data-rating]').forEach((btn) => btn.addEventListener('click', () => {
      state.rating = btn.dataset.rating;
      document.querySelectorAll('[data-rating]').forEach((b) => b.classList.toggle('active', b === btn));
      renderList(services);
    }));
    $('dating-search').addEventListener('input', (e) => { state.query = e.target.value.trim().toLowerCase(); renderList(services); });
    if ($('owner-select')) $('owner-select').addEventListener('change', (e) => { state.owner = e.target.value; renderList(services); });
    if ($('category-select')) $('category-select').addEventListener('change', (e) => { state.category = e.target.value; renderList(services); });
    if ($('verified-only')) $('verified-only').addEventListener('change', (e) => { state.verifiedOnly = e.target.checked; renderList(services); });
    renderList(services);
  }

  // ---------- Hub ----------

  function tally(services) {
    const counts = { checked: 0, caution: 0, avoid: 0 };
    services.forEach((s) => { counts[s.verdict.rating] += 1; });
    return Object.entries(counts).map(([rating, n]) => ratingPill(rating, ` ${n}`)).join(' ');
  }

  function renderHub(apps, matchmakers) {
    $('apps-tally').innerHTML = tally(apps);
    $('matchmakers-tally').innerHTML = tally(matchmakers);
    $('recent-years').textContent = RECENT_YEARS;
    $('owner-map').innerHTML = (data.owners || []).map((owner) => {
      const brands = apps.filter((a) => a.ownerId === owner.id);
      if (brands.length < 2) return '';
      return `
        <article class="owner-group">
          <h3>${esc(owner.name)} <span class="owner-count">${brands.length} app${brands.length === 1 ? '' : 's'}</span></h3>
          <div class="owner-brands">${brands.map((b) => `<span class="owner-brand">${logoHtml(b.name, safeAsset(b.logo), 'logo-sm')} ${esc(b.name)} ${RATINGS[b.verdict.rating].icon}</span>`).join('')}</div>
          ${owner.note ? `<p class="owner-note">${esc(owner.note)}${safeUrl(owner.source) ? ` <a href="${esc(owner.source)}" target="_blank" rel="noopener noreferrer">Source ↗</a>` : ''}</p>` : ''}
        </article>`;
    }).join('');
  }

  function init() {
    bindLogoFallback();
    const kind = document.querySelector('main').dataset.kind;
    const apps = (data.apps || []).map((s) => rated({ ...s, kind: 'app' }));
    const matchmakers = (data.matchmakers || []).map((s) => rated({ ...s, kind: 'matchmaker', category: 'matchmaker', verification: s.verification || ['consultation'] }));
    if ($('checked-date') && data.checked) $('checked-date').textContent = monthYear(data.checked);
    if (kind === 'hub') renderHub(apps, matchmakers);
    if (kind === 'apps') bindList(apps);
    if (kind === 'matchmakers') bindList(matchmakers);
    const year = $('year');
    if (year) year.textContent = new Date().getFullYear();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
