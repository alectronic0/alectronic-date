// Trust rating for labs/dating: a published rule over each service's sourced track record.
// Loaded by the pages (window.DatingRating) and by node --test (module.exports).
(function (root) {
  const RECENT_YEARS = 3;

  const RATINGS = {
    trusted: { label: 'Trusted', icon: '✅' },
    caution: { label: 'Caution', icon: '⚠️' },
    avoid: { label: 'Avoid', icon: '⛔' },
  };

  function yearsSince(isoDate, today) {
    return (new Date(`${today}T00:00:00`) - new Date(`${isoDate.slice(0, 10)}T00:00:00`)) / (365.25 * 86400000);
  }

  function reasonsFor(service, today) {
    const track = service.track || [];
    const reasons = [];
    track.filter((t) => t.severity === 'critical')
      .forEach((t) => reasons.push({ rating: 'avoid', text: t.summary }));
    track.filter((t) => t.severity === 'major')
      .filter((t) => yearsSince(t.date, today) <= RECENT_YEARS)
      .forEach((t) => reasons.push({ rating: 'caution', text: t.summary }));
    // null means not confirmed either way, so only an explicit empty list counts against a service
    if (Array.isArray(service.verification) && !service.verification.length) {
      reasons.push({ rating: 'caution', text: 'No photo, ID or application check on members.' });
    }
    if (service.pricingModel === 'pay-per-message credits') {
      reasons.push({ rating: 'caution', text: 'Charges per message through credits, so costs are hard to predict.' });
    }
    return reasons;
  }

  // Override wins but is always shown with its reason, so a hand rating is never hidden.
  function ratingFor(service, today) {
    if (service.ratingOverride) {
      return { rating: service.ratingOverride.rating, byHand: true, reasons: [{ rating: service.ratingOverride.rating, text: service.ratingOverride.reason }] };
    }
    const reasons = reasonsFor(service, today);
    if (reasons.some((r) => r.rating === 'avoid')) return { rating: 'avoid', byHand: false, reasons };
    if (reasons.length) return { rating: 'caution', byHand: false, reasons };
    return { rating: 'trusted', byHand: false, reasons };
  }

  const api = { RATINGS, RECENT_YEARS, ratingFor };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DatingRating = api;
})(typeof window !== 'undefined' ? window : globalThis);
