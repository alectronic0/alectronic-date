// Pure helpers for the status chips on the Platforms tab of labs/events.html (no DOM).
// The API decides each source's state; this file only matches it to a platform and words it.
// Loaded by labs/events.html (window.SourceStatus) and by node --test (module.exports).
(function (root) {
  const ICONS = { ok: '✓', warning: '⚠', stale: '✕', pending: '⏳', unknown: '?' };
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
    if (source.permission === 'pending') return { state: 'pending', label: 'Working on connecting' };
    const labelFor = LIVE_LABELS[source.state];
    if (!labelFor) return { state: 'unknown', label: 'Status unknown' };
    return { state: source.state, label: labelFor(source) };
  }

  function chipModel(source) {
    const { state, label } = statusOf(source);
    return { state, icon: ICONS[state], label };
  }

  function hostOf(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch (error) {
      return '';
    }
  }

  // A platform is live only when its source is cleared; everything else is on the way.
  function platformChip(platformUrl, healthSources) {
    const host = hostOf(platformUrl);
    const match = host && healthSources.find((s) => s.permission === 'cleared' && hostOf(s.url) === host);
    if (match) return chipModel(match);
    return { state: 'pending', icon: ICONS.pending, label: 'Working on connecting' };
  }

  const api = { ageText, chipModel, platformChip, freshestAgeHours };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SourceStatus = api;
})(typeof window !== 'undefined' ? window : globalThis);
