// node --test scripts/events_api.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { API_BASE, load, mapEvent, mergeBySource } = require('../js/events-api.js');

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

const item = (source, startDate, startTime, name) => ({ id: name, source, name, startDate, startTime });
const names = (items) => items.map((i) => i.name);

const snapshot = [
  item('itsadate', '2026-11-20', '19:00', 'snap-a'),
  item('haystack', '2026-11-10', '18:00', 'snap-b'),
  item('fig', '2026-11-15', '20:00', 'snap-c'),
  item('itsadate', '2026-11-12', '19:00', 'snap-d'),
];

const mergeCases = {
  'API items replace snapshot items of the same source': [[item('itsadate', '2026-11-30', '19:00', 'api-a')], ['snap-b', 'snap-c', 'api-a']],
  'sources the API did not return are kept': [[item('fatsoma', '2026-11-11', '', 'api-b')], ['snap-b', 'api-b', 'snap-d', 'snap-c', 'snap-a']],
  'sorted by date then time': [[item('fig', '2026-11-10', '09:00', 'api-c'), item('fig', '2026-11-10', '', 'api-d')], ['api-d', 'api-c', 'snap-b', 'snap-d', 'snap-a']],
};

for (const [name, [apiItems, want]] of Object.entries(mergeCases)) {
  test(`mergeBySource: ${name}`, () => {
    assert.deepEqual(names(mergeBySource(snapshot, apiItems)), want);
  });
}

test('mergeBySource: empty API result equals the snapshot exactly', () => {
  assert.deepEqual(mergeBySource(snapshot, []), snapshot);
});

test('mergeBySource: does not mutate the snapshot', () => {
  const before = structuredClone(snapshot);
  mergeBySource(snapshot, [item('fig', '2026-11-01', '', 'api-e')]);
  assert.deepEqual(snapshot, before);
});

const jsonResponse = (body, status = 200) => ({ ok: status === 200, status, json: async () => body });
const invalidJson = { ok: true, status: 200, json: async () => { throw new SyntaxError('Unexpected token'); } };
const NEVER = () => new Promise(() => {});

const loadCases = {
  'success maps events': [async () => jsonResponse({ events: [apiEvent()] }), 1],
  'empty list': [async () => jsonResponse({ events: [] }), 0],
  'HTTP 500': [async () => jsonResponse({}, 500), 0],
  'invalid JSON': [async () => invalidJson, 0],
  'missing events array': [async () => jsonResponse({ ok: true }), 0],
  'thrown network error': [async () => { throw new TypeError('Failed to fetch'); }, 0],
  'hanging request hits the timeout': [NEVER, 0],
  'events without a start are skipped': [async () => jsonResponse({ events: [apiEvent(), apiEvent({ startsAt: null })] }), 1],
};

for (const [name, [fetchImpl, wantCount]] of Object.entries(loadCases)) {
  test(`load: ${name}`, async (t) => {
    t.mock.method(console, 'warn', () => {});
    const got = await load(fetchImpl, 20);
    assert.equal(got.length, wantCount);
  });
}

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
