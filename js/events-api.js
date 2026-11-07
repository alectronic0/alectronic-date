// Live singles events from our own events API, mapped to the item shape of window.CONTENT.singlesGuide.items.
// Loaded by labs/events.html (window.EventsApi) and by node --test (module.exports).
(function (root) {
  // Temporary workers.dev URL until the API has its own domain.
  const API_BASE = 'https://dating-events.alec-game1-4fc.workers.dev';
  const EVENTS_LIMIT = 500;
  const DEFAULT_TIMEOUT_MS = 4000;

  function dateOf(isoDateTime) {
    return isoDateTime.slice(0, 10);
  }

  function timeOf(isoDateTime) {
    return isoDateTime.slice(11, 16);
  }

  function isPresent(value) {
    return value != null;
  }

  function ticketStatusOf(apiEvent) {
    if (apiEvent.hasSpaces === false) return 'sold_out';
    if (apiEvent.hasSpaces !== true) return 'unknown';
    return apiEvent.availabilityNote === 'limited' ? 'limited' : 'plenty';
  }

  // Optional legacy fields are left off rather than set to null, so the UI's `== null` and truthiness checks hold.
  function optionalFields(apiEvent) {
    const fields = {};
    if (isPresent(apiEvent.lat) && isPresent(apiEvent.lng)) {
      fields.lat = apiEvent.lat;
      fields.lng = apiEvent.lng;
      fields.mapUrl = `https://maps.google.com/?q=${apiEvent.lat},${apiEvent.lng}`;
    }
    if (isPresent(apiEvent.priceText)) fields.price = apiEvent.priceText;
    if (isPresent(apiEvent.spacesMax)) fields.capacity = apiEvent.spacesMax;
    if (isPresent(apiEvent.spacesTaken)) fields.attending = apiEvent.spacesTaken;
    const spacesLeft = apiEvent.meta?.spacesLeft;
    if (isPresent(spacesLeft)) fields.spotsLeft = spacesLeft;
    return fields;
  }

  function mapEvent(apiEvent) {
    const startDate = dateOf(apiEvent.startsAt);
    return {
      id: apiEvent.id,
      source: apiEvent.source,
      hostId: apiEvent.hostId,
      name: apiEvent.title,
      hostName: apiEvent.hostName,
      url: apiEvent.eventUrl,
      startDate,
      startTime: timeOf(apiEvent.startsAt),
      endDate: apiEvent.endsAt ? dateOf(apiEvent.endsAt) : startDate,
      venue: apiEvent.venueName || '',
      location: apiEvent.address || '',
      ticketStatus: ticketStatusOf(apiEvent),
      description: '',
      ...optionalFields(apiEvent),
    };
  }

  function isMappable(apiEvent) {
    if (!apiEvent) return false;
    if (typeof apiEvent.startsAt !== 'string') return false;
    return Boolean(apiEvent.source);
  }

  function byStart(a, b) {
    return (a.startDate || '').localeCompare(b.startDate || '') || (a.startTime || '').localeCompare(b.startTime || '');
  }

  // The API is authoritative for every source it returns; sources it says nothing about keep their snapshot items.
  function mergeBySource(snapshotItems, apiItems) {
    if (!apiItems.length) return snapshotItems;
    const apiSources = new Set(apiItems.map((item) => item.source));
    const kept = snapshotItems.filter((item) => !apiSources.has(item.source));
    return [...kept, ...apiItems].sort(byStart);
  }

  // A hanging fetch may ignore the abort signal, so the timeout also rejects the race itself.
  async function fetchJson(fetchImpl, url, timeoutMs) {
    const controller = new AbortController();
    let timer;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => {
        controller.abort();
        reject(new Error(`timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });
    try {
      const response = await Promise.race([fetchImpl(url, { signal: controller.signal }), timeout]);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await Promise.race([response.json(), timeout]);
    } finally {
      clearTimeout(timer);
    }
  }

  async function load(fetchImpl = fetch, timeoutMs = DEFAULT_TIMEOUT_MS) {
    try {
      const payload = await fetchJson(fetchImpl, `${API_BASE}/events?limit=${EVENTS_LIMIT}`, timeoutMs);
      if (!Array.isArray(payload?.events)) throw new Error('response has no events array');
      return payload.events.filter(isMappable).map(mapEvent);
    } catch (err) {
      console.warn(`Live events unavailable, showing the saved list: ${err.message}`);
      return [];
    }
  }

  const api = { API_BASE, load, mapEvent, mergeBySource };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.EventsApi = api;
})(typeof window !== 'undefined' ? window : globalThis);
