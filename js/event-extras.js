// Turns the optional card facts into short text for the schedule cards (no DOM).
// The API only sends a fact while its show_* switch is on, so a missing field simply means "nothing to draw".
// Loaded by labs/events.html (window.EventExtras) and by node --test (module.exports).
(function (root) {
  function pounds(amount) {
    return Number.isInteger(amount) ? `£${amount}` : `£${amount.toFixed(2)}`;
  }

  function hasNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
  }

  // All-in range when the host's own fee-inclusive prices are known, otherwise the plain price text.
  function priceLabel(event) {
    if (!hasNumber(event.priceMin)) return event.price || '';
    const high = hasNumber(event.priceMax) ? event.priceMax : event.priceMin;
    const range = high > event.priceMin ? `${pounds(event.priceMin)} - ${pounds(high)}` : pounds(event.priceMin);
    return event.priceNote ? `${range} ${event.priceNote}` : range;
  }

  function ageLabel(event) {
    if (!hasNumber(event.ageMin)) return '';
    if (!hasNumber(event.ageMax)) return `${event.ageMin}+`;
    return `${event.ageMin}-${event.ageMax}`;
  }

  function tiersLabel(event) {
    const tiers = Array.isArray(event.tiers) ? event.tiers : [];
    return tiers.map((tier) => `${tier.name} ${pounds(Number(tier.price))}`).join(' · ');
  }

  function genderLabel(event) {
    if (!hasNumber(event.menLeft)) return '';
    if (!hasNumber(event.womenLeft)) return '';
    return `${event.menLeft} men's and ${event.womenLeft} women's tickets left`;
  }

  const STATUS_LABELS = { postponed: 'Postponed', cancelled: 'Cancelled' };

  function statusLabel(event) {
    return STATUS_LABELS[event.eventStatus] || '';
  }

  // Short facts for the meta line, in a fixed order; empty ones are dropped.
  function chips(event) {
    const facts = [
      ['age', ageLabel(event) && `🧑 ${ageLabel(event)}`],
      ['guests', hasNumber(event.guests) && `👥 ${event.guests} guests`],
      ['included', event.included && `🍸 ${event.included}`],
      ['entry', event.lastEntry && `🚪 last entry ${event.lastEntry}`],
    ];
    return facts.filter(([, text]) => text).map(([kind, text]) => ({ kind, text }));
  }

  const api = { priceLabel, ageLabel, tiersLabel, genderLabel, statusLabel, chips };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.EventExtras = api;
})(typeof window !== 'undefined' ? window : globalThis);
