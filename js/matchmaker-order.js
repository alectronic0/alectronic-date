// Orders the matchmaker cards into groups (no DOM): featured first, then free lists, then paid agencies cheapest first.
// `sortPrice` only decides the order; it is never shown. An agency with no known price goes last in its group.
// Loaded by labs/dating/matchmakers.html (window.MatchmakerOrder) and by node --test (module.exports).
(function (root) {
  const GROUPS = [
    { id: 'featured', title: 'Featured' },
    { id: 'free', title: 'Free to join' },
    { id: 'paid', title: 'Paid, cheapest first' },
  ];

  function hasPrice(service) {
    return typeof service.sortPrice === 'number' && Number.isFinite(service.sortPrice);
  }

  const COMPARE = {
    featured: (a, b) => (a.rank ?? 99) - (b.rank ?? 99) || a.name.localeCompare(b.name),
    free: (a, b) => a.name.localeCompare(b.name),
    paid: (a, b) => {
      if (hasPrice(a) !== hasPrice(b)) return hasPrice(a) ? -1 : 1;
      return (hasPrice(a) ? a.sortPrice - b.sortPrice : 0) || a.name.localeCompare(b.name);
    },
  };

  function groupMatchmakers(services) {
    return GROUPS
      .map((group) => ({ ...group, items: services.filter((s) => s.group === group.id).sort(COMPARE[group.id]) }))
      .filter((group) => group.items.length);
  }

  const api = { GROUPS, groupMatchmakers };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MatchmakerOrder = api;
})(typeof window !== 'undefined' ? window : globalThis);
