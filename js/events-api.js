// Live singles events and source health from our own events API; events are mapped to the item shape the guide renders.
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

  // Same thresholds the saved list used: 10 spaces or fewer, or 20% of a known capacity.
  const LOW_STOCK_SPOTS = 10;
  const LOW_STOCK_SHARE = 0.2;

  function isLowStock(apiEvent) {
    const left = apiEvent.meta?.spacesLeft;
    if (left == null) return false;
    if (apiEvent.spacesMax) return left / apiEvent.spacesMax <= LOW_STOCK_SHARE;
    return left <= LOW_STOCK_SPOTS;
  }

  // Hosts word "limited" differently ("men: sold out, women: limited"), so the note is matched, not compared.
  function ticketStatusOf(apiEvent) {
    if (apiEvent.hasSpaces === false) return 'sold_out';
    if (apiEvent.hasSpaces !== true) return 'unknown';
    if (/limited/i.test(apiEvent.availabilityNote || '')) return 'limited';
    return isLowStock(apiEvent) ? 'limited' : 'plenty';
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

  // Callers tell a failed request from an empty one by `ok`; neither case throws.
  async function request(fetchImpl, path, timeoutMs, read) {
    try {
      const payload = await fetchJson(fetchImpl, `${API_BASE}${path}`, timeoutMs);
      return { ok: true, ...read(payload) };
    } catch (err) {
      console.warn(`Events API ${path} unavailable: ${err.message}`);
      return { ok: false, error: err.message };
    }
  }

  function readEvents(payload) {
    if (!Array.isArray(payload?.events)) throw new Error('response has no events array');
    return { items: payload.events.filter(isMappable).map(mapEvent) };
  }

  function readHealth(payload) {
    if (!Array.isArray(payload?.sources)) throw new Error('response has no sources array');
    return { sources: payload.sources };
  }

  function load(fetchImpl = fetch, timeoutMs = DEFAULT_TIMEOUT_MS) {
    return request(fetchImpl, `/events?limit=${EVENTS_LIMIT}`, timeoutMs, readEvents);
  }

  function loadHealth(fetchImpl = fetch, timeoutMs = DEFAULT_TIMEOUT_MS) {
    return request(fetchImpl, '/health', timeoutMs, readHealth);
  }

  const api = { API_BASE, load, loadHealth, mapEvent };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.EventsApi = api;
})(typeof window !== 'undefined' ? window : globalThis);
