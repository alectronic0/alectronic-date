// Singles event guide (labs/events.html): Schedule (list + calendar), Map and Platforms tabs.
// Data: window.CONTENT.singlesGuide ({hosts, items}) and window.CONTENT.singlesEvents (platforms).
(function () {
  const TABS = ['schedule', 'map', 'platforms'];
  const DAY_MS = 86400000;
  const TICKET = {
    sold_out: { label: 'Full', icon: '🔴', color: '#e5484d' },
    limited: { label: 'Nearly sold out', icon: '🟠', color: '#f5a623' },
    plenty: { label: 'Tickets available', icon: '🟢', color: '#7fc2a6' },
    unknown: { label: 'Check availability', icon: '⚪', color: '#9d859b' },
  };
  const WHEN = {
    week: { label: 'This week', color: '#ff6b8a' },
    month: { label: 'This month', color: '#e6a979' },
    later: { label: 'Later', color: '#6aa8ff' },
  };

  const state = {
    tab: 'schedule',
    view: 'list',
    range: 'all',
    host: '',
    query: '',
    hideFull: false,
    colourBy: 'when',
    month: null,
    day: null,
  };
  let guide = { hosts: [], items: [] };
  let hostsById = {};
  let map = null;
  let markerLayer = null;

  const $ = (id) => document.getElementById(id);
  const { esc, safeUrl, safeAsset, monogram, logoHtml, bindLogoFallback } = window.LabsUI;

  function todayISO() {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }

  function parseDay(iso) {
    return new Date(`${iso}T00:00:00`);
  }

  function daysAway(iso) {
    return Math.round((parseDay(iso) - parseDay(todayISO())) / DAY_MS);
  }

  function whenBucket(event) {
    const days = daysAway(event.startDate);
    if (days <= 7) return 'week';
    if (days <= 31) return 'month';
    return 'later';
  }

  function ticketStatus(event) {
    if (!event.capacity || event.attending == null) return event.ticketStatus || 'unknown';
    const fill = event.attending / event.capacity;
    if (fill >= 1) return 'sold_out';
    if (fill >= 0.8) return 'limited';
    return 'plenty';
  }

  function hostLabel(event) {
    const host = hostsById[event.hostId];
    return host ? host.name : event.hostName || 'Unknown host';
  }

  function logoUrl(event) {
    const host = hostsById[event.hostId];
    return safeAsset(host ? host.logo : event.hostLogo);
  }

  function dayLabel(iso, opts) {
    return parseDay(iso).toLocaleDateString('en-GB', opts || { weekday: 'short', day: 'numeric', month: 'short' });
  }

  function filtered() {
    return guide.items
      .filter((e) => e.startDate)
      .filter((e) => state.range !== 'week' || whenBucket(e) === 'week')
      .filter((e) => state.range !== 'month' || whenBucket(e) !== 'later')
      .filter((e) => !state.host || hostLabel(e) === state.host)
      .filter((e) => !state.hideFull || ticketStatus(e) !== 'sold_out')
      .filter((e) => {
        if (!state.query) return true;
        const haystack = [e.name, hostLabel(e), e.venue, e.location, e.description].join(' ').toLowerCase();
        return haystack.includes(state.query);
      })
      .sort((a, b) => (a.startDate + (a.startTime || '')).localeCompare(b.startDate + (b.startTime || '')));
  }

  // ---------- Hosts ----------

  function nextEventFor(host) {
    const today = todayISO();
    return guide.items
      .filter((e) => e.hostId === host.id && e.startDate >= today)
      .sort((a, b) => a.startDate.localeCompare(b.startDate))[0];
  }

  function hostLinks(host) {
    return (host.links || [])
      .filter((link) => safeUrl(link.url))
      .map((link) => `<a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(link.label)}</a>`)
      .join('');
  }

  function renderHosts() {
    const strip = $('host-strip');
    if (!guide.hosts.length) {
      strip.hidden = true;
      return;
    }
    strip.innerHTML = guide.hosts.map((host) => {
      const next = nextEventFor(host);
      const people = (host.people || []).join(' & ');
      const active = state.host === host.name ? ' active' : '';
      const logo = logoHtml(host.name, safeAsset(host.logo), 'host-logo');
      return `
        <article class="host-card${active}" data-host="${esc(host.name)}" tabindex="0" role="button" aria-pressed="${active ? 'true' : 'false'}">
          ${logo}
          <div class="host-body">
            <span class="host-kicker">Host spotlight</span>
            <h2 class="host-name">${esc(host.name)}</h2>
            ${people ? `<p class="host-people">with ${esc(people)}</p>` : ''}
            <p class="host-blurb">${esc(host.blurb)}</p>
            <p class="host-next">${next ? `Next: <strong>${esc(dayLabel(next.startDate))}</strong>` : 'Dates coming soon'}</p>
            <div class="host-links">${hostLinks(host)}</div>
          </div>
        </article>`;
    }).join('');
    strip.querySelectorAll('.host-card').forEach((card) => {
      const toggle = () => {
        state.host = state.host === card.dataset.host ? '' : card.dataset.host;
        $('host-select').value = state.host;
        render();
      };
      card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        toggle();
      });
      card.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        toggle();
      });
    });
  }

  function renderHostOptions() {
    const counts = {};
    guide.items.forEach((e) => { counts[hostLabel(e)] = (counts[hostLabel(e)] || 0) + 1; });
    guide.hosts.forEach((h) => { counts[h.name] = counts[h.name] || 0; });
    const spotlight = new Set(guide.hosts.map((h) => h.name));
    const names = Object.keys(counts).sort((a, b) => {
      if (spotlight.has(a) !== spotlight.has(b)) return spotlight.has(a) ? -1 : 1;
      return counts[b] - counts[a] || a.localeCompare(b);
    });
    $('host-select').innerHTML = '<option value="">All hosts</option>' +
      names.map((n) => `<option value="${esc(n)}">${spotlight.has(n) ? '⭐ ' : ''}${esc(n)} (${counts[n]})</option>`).join('');
  }

  // ---------- Schedule: list ----------

  function spotsNote(event) {
    if (event.spotsLeft == null) return '';
    const left = Number(event.spotsLeft);
    return left > 0 ? `${left} ${left === 1 ? 'space' : 'spaces'} left` : 'No spaces left';
  }

  function attendanceBar(event) {
    if (!event.capacity || event.attending == null) {
      const note = spotsNote(event);
      return note ? `<div class="attend"><span class="attend-label">🎟️ ${note}</span></div>` : '';
    }
    const attending = Number(event.attending);
    const capacity = Number(event.capacity);
    const pct = Math.min(100, Math.round((attending / capacity) * 100));
    return `
      <div class="attend" title="${attending} of ${capacity} places taken">
        <div class="attend-bar"><span style="width:${pct}%; background:${TICKET[ticketStatus(event)].color}"></span></div>
        <span class="attend-label">👥 ${attending} / ${capacity} going${event.spotsLeft != null ? ` · ${spotsNote(event)}` : ''}</span>
      </div>`;
  }

  function eventRow(event) {
    const status = TICKET[ticketStatus(event)];
    const spotlight = hostsById[event.hostId];
    const url = safeUrl(event.url);
    const title = url ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(event.name)}</a>` : esc(event.name);
    const mapLink = safeUrl(event.mapUrl);
    return `
      <article class="guide-event${spotlight ? ' is-spotlight' : ''}">
        <div class="guide-time">${esc(event.startTime || 'TBC')}</div>
        <div class="guide-main">
          <h3 class="guide-title">${title}</h3>
          <div class="guide-meta">
            <span class="host-badge${spotlight ? ' spotlight' : ''}">${logoHtml(hostLabel(event), logoUrl(event), 'logo-sm')}${esc(hostLabel(event))}</span>
            ${event.venue || event.location ? `<span>📍 ${mapLink ? `<a href="${esc(mapLink)}" target="_blank" rel="noopener noreferrer">${esc(event.venue || event.location)}</a>` : esc(event.venue || event.location)}</span>` : ''}
            ${event.price ? `<span>🎟️ ${esc(event.price)}</span>` : ''}
          </div>
          ${attendanceBar(event)}
        </div>
        <span class="ticket-pill" style="--pill:${status.color}">${status.icon} ${status.label}</span>
      </article>`;
  }

  function groupedList(events) {
    if (!events.length) return '<div class="empty-state">No events match these filters. Try widening the dates or clearing the host.</div>';
    const byDay = {};
    events.forEach((e) => { (byDay[e.startDate] = byDay[e.startDate] || []).push(e); });
    return Object.keys(byDay).map((day) => {
      const away = daysAway(day);
      const hint = away === 0 ? 'Today' : away === 1 ? 'Tomorrow' : `in ${away} days`;
      return `
        <section class="guide-day">
          <h2 class="guide-day-title">${esc(dayLabel(day, { weekday: 'long', day: 'numeric', month: 'long' }))} <span>${hint}</span></h2>
          ${byDay[day].map(eventRow).join('')}
        </section>`;
    }).join('');
  }

  // ---------- Schedule: calendar ----------

  function monthKey(iso) {
    return iso.slice(0, 7);
  }

  function renderCalendar(events) {
    const first = state.month || monthKey(events[0]?.startDate || todayISO());
    state.month = first;
    const [year, month] = first.split('-').map(Number);
    const start = new Date(year, month - 1, 1);
    const daysInMonth = new Date(year, month, 0).getDate();
    const lead = (start.getDay() + 6) % 7;
    const byDay = {};
    events.forEach((e) => { (byDay[e.startDate] = byDay[e.startDate] || []).push(e); });
    const today = todayISO();

    const cells = [];
    for (let i = 0; i < lead; i++) cells.push('<div class="cal-cell cal-empty"></div>');
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = `${first}-${String(d).padStart(2, '0')}`;
      const dayEvents = byDay[iso] || [];
      const dots = dayEvents.slice(0, 6).map((e) => `<i style="background:${TICKET[ticketStatus(e)].color}"></i>`).join('');
      const classes = ['cal-cell'];
      if (iso === today) classes.push('cal-today');
      if (iso === state.day) classes.push('cal-selected');
      if (dayEvents.length) classes.push('cal-has');
      cells.push(`
        <button class="${classes.join(' ')}" data-day="${iso}" ${dayEvents.length ? '' : 'disabled'} aria-label="${esc(dayLabel(iso))}: ${dayEvents.length} events">
          <span class="cal-num">${d}</span>
          ${dayEvents.length ? `<span class="cal-count">${dayEvents.length}</span><span class="cal-dots">${dots}</span>` : ''}
        </button>`);
    }

    const monthName = start.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    const selected = state.day && monthKey(state.day) === first ? (byDay[state.day] || []) : [];
    return `
      <div class="cal">
        <div class="cal-head">
          <button class="filter-btn" data-month="-1" aria-label="Previous month">‹</button>
          <h2>${esc(monthName)}</h2>
          <button class="filter-btn" data-month="1" aria-label="Next month">›</button>
        </div>
        <div class="cal-grid">
          ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => `<div class="cal-dow">${d}</div>`).join('')}
          ${cells.join('')}
        </div>
      </div>
      <div class="cal-day-list">
        ${state.day ? groupedList(selected) : '<p class="cal-hint">Pick a day to see what is on.</p>'}
      </div>`;
  }

  function shiftMonth(delta) {
    const [year, month] = state.month.split('-').map(Number);
    const next = new Date(year, month - 1 + delta, 1);
    state.month = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`;
    state.day = null;
    renderSchedule();
  }

  function renderSchedule() {
    const events = filtered();
    const body = $('schedule-body');
    document.querySelectorAll('[data-view]').forEach((b) => b.classList.toggle('active', b.dataset.view === state.view));
    if (state.view === 'list') {
      body.innerHTML = groupedList(events);
      return;
    }
    body.innerHTML = renderCalendar(events);
    body.querySelectorAll('[data-month]').forEach((b) => b.addEventListener('click', () => shiftMonth(Number(b.dataset.month))));
    body.querySelectorAll('.cal-cell[data-day]').forEach((b) => b.addEventListener('click', () => {
      state.day = state.day === b.dataset.day ? null : b.dataset.day;
      renderSchedule();
    }));
  }

  // ---------- Map ----------

  function ensureMap() {
    if (map || !window.L) return;
    map = L.map('guide-map', { scrollWheelZoom: true }).setView([51.5074, -0.1278], 11);
    addBaseTiles(map);
    markerLayer = L.layerGroup().addTo(map);
  }

  function popupHtml(events) {
    const head = events[0];
    const rows = events.slice(0, 6).map((e) => {
      const status = TICKET[ticketStatus(e)];
      const url = safeUrl(e.url);
      const going = e.capacity && e.attending != null ? ` · 👥 ${Number(e.attending)}/${Number(e.capacity)} going` : (spotsNote(e) ? ` · ${spotsNote(e)}` : '');
      return `
        <li>
          <strong>${esc(dayLabel(e.startDate))} ${esc(e.startTime || '')}</strong>
          ${url ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(e.name)}</a>` : esc(e.name)}
          <span class="popup-meta">${logoHtml(hostLabel(e), logoUrl(e), 'logo-xs')}${esc(hostLabel(e))} · ${status.icon} ${status.label}${going}</span>
        </li>`;
    }).join('');
    const more = events.length > 6 ? `<p class="popup-more">+${events.length - 6} more here</p>` : '';
    const mapUrl = safeUrl(head.mapUrl);
    return `
      <div class="guide-popup">
        <h4>${esc(head.venue || head.location || 'Venue')}</h4>
        <ul>${rows}</ul>
        ${more}
        ${mapUrl ? `<a href="${esc(mapUrl)}" target="_blank" rel="noopener noreferrer">Open in Google Maps ↗</a>` : ''}
      </div>`;
  }

  function renderLegend() {
    const scale = state.colourBy === 'when' ? WHEN : TICKET;
    const ring = state.colourBy === 'when' ? TICKET : WHEN;
    $('map-legend').innerHTML = `
      <div class="legend-row"><span class="legend-title">Ring: ${state.colourBy === 'when' ? 'when' : 'tickets'}</span>
        ${Object.values(scale).map((s) => `<span class="legend-item"><i class="ring" style="border-color:${s.color}"></i>${s.label}</span>`).join('')}</div>
      <div class="legend-row"><span class="legend-title">Glow: ${state.colourBy === 'when' ? 'tickets' : 'when'}</span>
        ${Object.values(ring).map((s) => `<span class="legend-item"><i class="glow" style="--glow:${s.color}"></i>${s.label}</span>`).join('')}</div>`;
    document.querySelectorAll('[data-colour]').forEach((b) => b.classList.toggle('active', b.dataset.colour === state.colourBy));
  }

  function renderMap() {
    ensureMap();
    renderLegend();
    if (!map) return;
    map.invalidateSize();
    markerLayer.clearLayers();
    const venues = {};
    filtered().filter((e) => e.lat != null && e.lng != null).forEach((e) => {
      const key = `${Number(e.lat).toFixed(4)},${Number(e.lng).toFixed(4)}`;
      (venues[key] = venues[key] || []).push(e);
    });
    const bounds = [];
    Object.values(venues).forEach((events) => {
      const soonest = events[0];
      const whenColour = WHEN[whenBucket(soonest)].color;
      const ticketColour = TICKET[ticketStatus(soonest)].color;
      const ring = state.colourBy === 'when' ? whenColour : ticketColour;
      const glow = state.colourBy === 'when' ? ticketColour : whenColour;
      const size = Math.min(44, 32 + (events.length - 1) * 3);
      const count = events.length > 1 ? `<b class="pin-count">${events.length}</b>` : '';
      const icon = L.divIcon({
        className: 'logo-pin-wrap',
        html: `<span class="logo-pin" style="--ring:${ring};--glow:${glow};--size:${size}px">${logoHtml(hostLabel(soonest), logoUrl(soonest), 'logo-pin-img')}${count}</span>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2],
      });
      const marker = L.marker([soonest.lat, soonest.lng], { icon, title: soonest.venue || soonest.name })
        .bindPopup(popupHtml(events), { maxWidth: 320 });
      markerLayer.addLayer(marker);
      bounds.push([soonest.lat, soonest.lng]);
    });
    if (bounds.length) map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
  }

  // ---------- Platforms (original directory) ----------

  let platformCategory = 'All';
  let platformQuery = '';

  function renderPlatforms() {
    const data = window.CONTENT && window.CONTENT.singlesEvents;
    const grid = $('events-grid');
    const filters = $('category-filters');
    if (!data || !data.items || !data.items.length) {
      grid.innerHTML = '<div class="empty-state">No platforms listed yet.</div>';
      return;
    }
    const categories = ['All', ...new Set(data.items.map((i) => i.category).filter(Boolean))];
    filters.innerHTML = categories.map((cat) => `<button class="filter-btn ${cat === platformCategory ? 'active' : ''}" data-category="${esc(cat)}">${esc(cat)}</button>`).join('');
    filters.querySelectorAll('.filter-btn').forEach((btn) => btn.addEventListener('click', () => {
      platformCategory = btn.dataset.category;
      renderPlatforms();
    }));

    const items = data.items.filter((item) => {
      if (platformCategory !== 'All' && item.category !== platformCategory) return false;
      if (!platformQuery) return true;
      return [item.name, item.category, item.location, item.description, ...(item.tags || [])].join(' ').toLowerCase().includes(platformQuery);
    });
    $('platform-count').textContent = `Showing ${items.length} of ${data.items.length} platforms`;
    grid.innerHTML = items.length ? items.map((item) => `
      <article class="event-card">
        <div>
          <div class="card-header">
            <span class="category-badge">${esc(item.category || 'Event')}</span>
            ${item.location ? `<span class="location-badge">📍 ${esc(item.location)}</span>` : ''}
          </div>
          <div class="platform-head">
            ${logoHtml(item.name, safeAsset(item.logo), 'platform-logo')}
            <h2 class="card-title">${esc(item.name)}</h2>
          </div>
          <p class="card-desc">${esc(item.description)}</p>
        </div>
        <div>
          ${item.tags && item.tags.length ? `<div class="tags-row">${item.tags.map((t) => `<span class="tag-pill">${esc(t)}</span>`).join('')}</div>` : ''}
          <a href="${esc(safeUrl(item.url))}" target="_blank" rel="noopener noreferrer" class="card-action">Visit Website ↗</a>
        </div>
      </article>`).join('') : '<div class="empty-state">No matching platforms. Try a different search term or category.</div>';
  }

  // ---------- Shell ----------

  function renderCount() {
    const events = filtered();
    const full = events.filter((e) => ticketStatus(e) === 'sold_out').length;
    const nearly = events.filter((e) => ticketStatus(e) === 'limited').length;
    const synced = window.LABS_SYNC && window.LABS_SYNC.singles;
    $('guide-count').textContent = `${events.length} ${events.length === 1 ? 'event' : 'events'} · ${nearly} nearly sold out · ${full} full` +
      (synced ? ` · synced ${dayLabel(synced.lastSynced, { day: 'numeric', month: 'short' })}` : '');
  }

  function render() {
    renderHosts();
    renderCount();
    if (state.tab === 'schedule') renderSchedule();
    if (state.tab === 'map') renderMap();
  }

  function showTab(tab) {
    state.tab = TABS.includes(tab) ? tab : 'schedule';
    document.querySelectorAll('[role="tab"]').forEach((b) => {
      const on = b.dataset.tab === state.tab;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    TABS.forEach((t) => { $(`panel-${t}`).hidden = t !== state.tab; });
    $('guide-filters').hidden = state.tab === 'platforms';
    if (location.hash !== `#${state.tab}`) history.replaceState(null, '', `#${state.tab}`);
    if (state.tab === 'platforms') renderPlatforms();
    render();
  }

  function bind() {
    document.querySelectorAll('[role="tab"]').forEach((b) => b.addEventListener('click', () => showTab(b.dataset.tab)));
    document.querySelectorAll('[data-view]').forEach((b) => b.addEventListener('click', () => {
      state.view = b.dataset.view;
      renderSchedule();
    }));
    document.querySelectorAll('[data-range]').forEach((b) => b.addEventListener('click', () => {
      state.range = b.dataset.range;
      document.querySelectorAll('[data-range]').forEach((x) => x.classList.toggle('active', x === b));
      render();
    }));
    document.querySelectorAll('[data-colour]').forEach((b) => b.addEventListener('click', () => {
      state.colourBy = b.dataset.colour;
      renderMap();
    }));
    $('host-select').addEventListener('change', (e) => {
      state.host = e.target.value;
      render();
    });
    $('hide-full').addEventListener('change', (e) => {
      state.hideFull = e.target.checked;
      render();
    });
    $('guide-search').addEventListener('input', (e) => {
      state.query = e.target.value.trim().toLowerCase();
      render();
    });
    $('platform-search').addEventListener('input', (e) => {
      platformQuery = e.target.value.trim().toLowerCase();
      renderPlatforms();
    });
    window.addEventListener('hashchange', () => showTab(location.hash.slice(1)));
  }

  function init() {
    const content = window.CONTENT || {};
    guide = content.singlesGuide || guide;
    hostsById = Object.fromEntries((guide.hosts || []).map((h) => [h.id, h]));
    if (guide.tag) $('section-tag').textContent = guide.tag;
    if (guide.title) $('section-title').textContent = guide.title;
    if (guide.subtitle) $('section-subtitle').textContent = guide.subtitle;
    $('year').textContent = new Date().getFullYear();
    renderHostOptions();
    bindLogoFallback();
    bind();
    showTab(location.hash.slice(1));
  }

  document.addEventListener('DOMContentLoaded', init);
})();
