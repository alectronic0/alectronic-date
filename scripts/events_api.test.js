// node --test scripts/events_api.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { API_BASE, load, loadHealth, mapEvent } = require('../js/events-api.js');

const apiEvent = (overrides) => ({
  id: 'e1',
  source: 'itsadate',
  hostId: 'its-a-date',
  title: 'Speed dating',
  hostName: "It's a Date",
  eventUrl: 'https://example.com/e1',
  startsAt: '2026-11-12T18:30:00',
  endsAt: '2026-11-12T21:00:00',
  venueName: 'The Venue',
  address: '1 High Street, London',
  lat: 51.5,
  lng: -0.1,
  priceText: '£20',
  hasSpaces: true,
  availabilityNote: null,
  spacesMax: 20,
  spacesTaken: 12,
  meta: { spacesLeft: 8 },
  ...overrides,
});

const mapCases = {
  'timed event': [apiEvent(), { startDate: '2026-11-12', startTime: '18:30', endDate: '2026-11-12', name: 'Speed dating', url: 'https://example.com/e1', venue: 'The Venue', location: '1 High Street, London', description: '' }],
  'date-only start has no time and ends the same day': [apiEvent({ startsAt: '2026-11-12', endsAt: null }), { startDate: '2026-11-12', startTime: '', endDate: '2026-11-12' }],
  'end on a later day': [apiEvent({ endsAt: '2026-11-13T01:00:00' }), { endDate: '2026-11-13' }],
  'no spaces is sold out': [apiEvent({ hasSpaces: false }), { ticketStatus: 'sold_out' }],
  'limited note is limited': [apiEvent({ availabilityNote: 'limited' }), { ticketStatus: 'limited' }],
  'spaces without a note is plenty': [apiEvent({ availabilityNote: 'plenty' }), { ticketStatus: 'plenty' }],
  'unknown spaces is unknown': [apiEvent({ hasSpaces: null }), { ticketStatus: 'unknown' }],
  'a per-gender note containing limited is limited': [apiEvent({ availabilityNote: 'men: sold out, women: limited' }), { ticketStatus: 'limited' }],
  'a per-gender note with both available is plenty': [apiEvent({ availabilityNote: 'men: available, women: available' }), { ticketStatus: 'plenty' }],
  '10 spaces left with no capacity is limited': [apiEvent({ spacesMax: null, meta: { spacesLeft: 10 } }), { ticketStatus: 'limited' }],
  '11 spaces left with no capacity is plenty': [apiEvent({ spacesMax: null, meta: { spacesLeft: 11 } }), { ticketStatus: 'plenty' }],
  '20 percent of a known capacity is limited': [apiEvent({ spacesMax: 100, meta: { spacesLeft: 20 } }), { ticketStatus: 'limited' }],
  '21 percent of a known capacity is plenty': [apiEvent({ spacesMax: 100, meta: { spacesLeft: 21 } }), { ticketStatus: 'plenty' }],
  'sold out beats a low count': [apiEvent({ hasSpaces: false, meta: { spacesLeft: 3 } }), { ticketStatus: 'sold_out' }],
  'no count and no note is plenty': [apiEvent({ spacesMax: null, meta: {} }), { ticketStatus: 'plenty' }],
  'coordinates give a map link': [apiEvent(), { lat: 51.5, lng: -0.1, mapUrl: 'https://maps.google.com/?q=51.5,-0.1' }],
  'zero coordinates are kept': [apiEvent({ lat: 0, lng: 0 }), { lat: 0, lng: 0, mapUrl: 'https://maps.google.com/?q=0,0' }],
  'missing venue and address become empty strings': [apiEvent({ venueName: null, address: null }), { venue: '', location: '' }],
  'capacity, attendance and spaces left are copied': [apiEvent(), { capacity: 20, attending: 12, spotsLeft: 8 }],
  'host id and source are copied': [apiEvent(), { id: 'e1', source: 'itsadate', hostId: 'its-a-date', hostName: "It's a Date" }],
};

for (const [name, [input, want]] of Object.entries(mapCases)) {
  test(`mapEvent: ${name}`, () => {
    const got = mapEvent(input);
    for (const [key, value] of Object.entries(want)) assert.equal(got[key], value, key);
  });
}

const absentCases = {
  'no coordinates': [apiEvent({ lat: null, lng: null }), ['lat', 'lng', 'mapUrl']],
  'no price': [apiEvent({ priceText: null }), ['price']],
  'no capacity data': [apiEvent({ spacesMax: null, spacesTaken: null, meta: { spacesLeft: null } }), ['capacity', 'attending', 'spotsLeft']],
  'no meta at all': [apiEvent({ meta: undefined }), ['spotsLeft']],
};

for (const [name, [input, omitted]] of Object.entries(absentCases)) {
  test(`mapEvent omits fields: ${name}`, () => {
    const got = mapEvent(input);
    omitted.forEach((key) => assert.equal(key in got, false, key));
  });
}

const jsonResponse = (body, status = 200) => ({ ok: status === 200, status, json: async () => body });
const invalidJson = { ok: true, status: 200, json: async () => { throw new SyntaxError('Unexpected token'); } };
const NEVER = () => new Promise(() => {});

const loadCases = {
  'success maps events': [async () => jsonResponse({ events: [apiEvent()] }), { ok: true, count: 1 }],
  'empty list is ok, not a failure': [async () => jsonResponse({ events: [] }), { ok: true, count: 0 }],
  'HTTP 500': [async () => jsonResponse({}, 500), { ok: false, error: 'HTTP 500' }],
  'invalid JSON': [async () => invalidJson, { ok: false, error: 'Unexpected token' }],
  'missing events array': [async () => jsonResponse({ ok: true }), { ok: false, error: 'response has no events array' }],
  'thrown network error': [async () => { throw new TypeError('Failed to fetch'); }, { ok: false, error: 'Failed to fetch' }],
  'hanging request hits the timeout': [NEVER, { ok: false, error: 'timed out after 20ms' }],
  'events without a start are skipped': [async () => jsonResponse({ events: [apiEvent(), apiEvent({ startsAt: null })] }), { ok: true, count: 1 }],
};

for (const [name, [fetchImpl, want]] of Object.entries(loadCases)) {
  test(`load: ${name}`, async (t) => {
    t.mock.method(console, 'warn', () => {});
    const got = await load(fetchImpl, 20);
    assert.equal(got.ok, want.ok);
    if (want.ok) assert.equal(got.items.length, want.count);
    else assert.equal(got.error, want.error);
  });
}

test('load: failure result has no items and success result has no error', async (t) => {
  t.mock.method(console, 'warn', () => {});
  const failed = await load(async () => jsonResponse({}, 500), 20);
  const empty = await load(async () => jsonResponse({ events: [] }), 20);
  assert.equal('items' in failed, false);
  assert.equal('error' in empty, false);
});

const healthSource = { id: 'fig', name: 'Fig', permission: 'cleared', state: 'ok' };

const loadHealthCases = {
  'success returns the sources': [async () => jsonResponse({ ok: true, sources: [healthSource] }), { ok: true, count: 1 }],
  'empty sources is ok': [async () => jsonResponse({ sources: [] }), { ok: true, count: 0 }],
  'HTTP 500': [async () => jsonResponse({}, 500), { ok: false, error: 'HTTP 500' }],
  'missing sources array': [async () => jsonResponse({ ok: true }), { ok: false, error: 'response has no sources array' }],
  'thrown network error': [async () => { throw new TypeError('Failed to fetch'); }, { ok: false, error: 'Failed to fetch' }],
  'hanging request hits the timeout': [NEVER, { ok: false, error: 'timed out after 20ms' }],
};

for (const [name, [fetchImpl, want]] of Object.entries(loadHealthCases)) {
  test(`loadHealth: ${name}`, async (t) => {
    t.mock.method(console, 'warn', () => {});
    const got = await loadHealth(fetchImpl, 20);
    assert.equal(got.ok, want.ok);
    if (want.ok) assert.equal(got.sources.length, want.count);
    else assert.equal(got.error, want.error);
  });
}

test('loadHealth: requests the health endpoint', async () => {
  const calls = [];
  await loadHealth(async (url) => {
    calls.push(url);
    return jsonResponse({ sources: [] });
  });
  assert.deepEqual(calls, [`${API_BASE}/health`]);
});

test('load: requests the events endpoint with a limit and an abort signal', async (t) => {
  t.mock.method(console, 'warn', () => {});
  const calls = [];
  await load(async (url, options) => {
    calls.push({ url, options });
    return jsonResponse({ events: [] });
  });
  assert.equal(calls[0].url, `${API_BASE}/events?limit=500`);
  assert.ok(calls[0].options.signal instanceof AbortSignal);
});

test('load: aborts the request when the timeout fires', async (t) => {
  t.mock.method(console, 'warn', () => {});
  let signal;
  await load((url, options) => {
    signal = options.signal;
    return NEVER();
  }, 20);
  assert.equal(signal.aborted, true);
});
