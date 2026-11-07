// Pure helpers for the "Where these events come from" strip on labs/events.html (no DOM).
// The API decides each source's state; this file only groups, orders and words it.
// Loaded by labs/events.html (window.SourceStatus) and by node --test (module.exports).
(function (root) {
  const LOGOS = {
    dateinadash: '../img/logos/platforms/date-in-a-dash.png',
    itsadate: '../img/logos/platforms/its-a-date.png',
    artdatingclub: '../img/logos/art-dating-club.png',
    boda: '../img/logos/platforms/boda.png',
    fig: '../img/logos/fig.png',
    haystack: '../img/logos/haystack.jpg',
    truedating: '../img/logos/platforms/true-dating.png',
    originaldating: '../img/logos/platforms/original-dating.png',
    bedatingbeautiful: '../img/logos/be-dating-beautiful.png',
    thursday: '../img/logos/thursday.jpg',
  };
  const ICONS = { ok: '✓', warning: '⚠', stale: '✕', pending: '⏳', unknown: '?' };
  const LIVE_ORDER = ['ok', 'warning', 'stale'];
  const HOURS_PER_DAY = 24;
  const MINUTES_PER_HOUR = 60;

  function plural(count, unit) {
    return `${count} ${unit}${count === 1 ? '' : 's'}`;
  }

  function ageText(ageHours) {
    if (ageHours == null) return 'not yet';
    const minutes = Math.max(1, Math.floor(ageHours * MINUTES_PER_HOUR));
    if (minutes < MINUTES_PER_HOUR) return `${plural(minutes, 'minute')} ago`;
    const hours = Math.floor(ageHours);
    if (hours < HOURS_PER_DAY) return `${plural(hours, 'hour')} ago`;
    return `${plural(Math.floor(ageHours / HOURS_PER_DAY), 'day')} ago`;
  }

  function byName(a, b) {
    return a.name.localeCompare(b.name);
  }

  function liveRank(source) {
    const rank = LIVE_ORDER.indexOf(source.state);
    return rank === -1 ? LIVE_ORDER.length : rank;
  }

  function byLiveState(a, b) {
    return liveRank(a) - liveRank(b) || byName(a, b);
  }

  function groupSources(healthSources) {
    return {
      live: healthSources.filter((s) => s.permission === 'cleared').sort(byLiveState),
      notConnected: healthSources.filter((s) => s.permission === 'pending').sort(byName),
    };
  }

  function freshestAgeHours(healthSources) {
    const ages = healthSources.map((s) => s.ageHours).filter((age) => age != null);
    return ages.length ? Math.min(...ages) : null;
  }

  function warningLabel(source) {
    if (source.consecutiveFailures > 0) {
      return source.ageHours == null ? 'Issue pulling events, no good pull yet' : `Issue pulling events, last good pull ${ageText(source.ageHours)}`;
    }
    return source.ageHours == null ? 'Not refreshed yet' : `Last refreshed ${ageText(source.ageHours)}`;
  }

  function staleLabel(source) {
    if (!source.enabled) return 'Paused after an error';
    if (source.ageHours == null) return 'Not refreshed yet';
    return `Not refreshed for ${plural(Math.max(1, Math.floor(source.ageHours / HOURS_PER_DAY)), 'day')}`;
  }

  function okLabel(source) {
    return source.ageHours == null ? 'Not refreshed yet' : `Refreshed ${ageText(source.ageHours)}`;
  }

  const LIVE_LABELS = { ok: okLabel, warning: warningLabel, stale: staleLabel };

  function statusOf(source) {
    if (source.permission === 'pending') return { state: 'pending', label: 'Not connected yet' };
    const labelFor = LIVE_LABELS[source.state];
    if (!labelFor) return { state: 'unknown', label: 'Status unknown' };
    return { state: source.state, label: labelFor(source) };
  }

  function chipModel(source) {
    const { state, label } = statusOf(source);
    const spokenLabel = label.charAt(0).toLowerCase() + label.slice(1);
    return {
      id: source.id,
      name: source.name,
      url: source.url,
      logo: LOGOS[source.id] || '',
      state,
      icon: ICONS[state],
      label,
      ariaLabel: `${source.name}: ${spokenLabel}. Opens the official site.`,
    };
  }

  const api = { groupSources, ageText, chipModel, freshestAgeHours };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SourceStatus = api;
})(typeof window !== 'undefined' ? window : globalThis);
