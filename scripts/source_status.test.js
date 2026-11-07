// node --test scripts/source_status.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { groupSources, ageText, chipModel, freshestAgeHours } = require('../js/source-status.js');

const source = (overrides) => ({
  id: 'fig', name: 'Fig', url: 'https://figdating.com', enabled: true, permission: 'cleared',
  state: 'ok', lastOkAt: '2026-11-07T23:00:00.000Z', ageHours: 0.25, consecutiveFailures: 0, ...overrides,
});

const ageCases = {
  'null is not yet': [null, 'not yet'],
  'zero is one minute': [0, '1 minute ago'],
  'quarter of an hour': [0.25, '15 minutes ago'],
  'just under an hour': [0.99, '59 minutes ago'],
  'exactly one hour': [1, '1 hour ago'],
  'two and a half hours': [2.5, '2 hours ago'],
  'just under a day': [23.9, '23 hours ago'],
  'exactly one day': [24, '1 day ago'],
  'three days': [75, '3 days ago'],
};

for (const [name, [hours, want]] of Object.entries(ageCases)) {
  test(`ageText: ${name}`, () => assert.equal(ageText(hours), want));
}

const ids = (sources) => sources.map((s) => s.id);

const groupCases = {
  'live ordered ok, warning, stale then A to Z': [
    [
      source({ id: 'z-ok', name: 'Zed', state: 'ok' }),
      source({ id: 'stale', name: 'Alpha', state: 'stale' }),
      source({ id: 'warn', name: 'Mid', state: 'warning' }),
      source({ id: 'a-ok', name: 'Able', state: 'ok' }),
    ],
    { live: ['a-ok', 'z-ok', 'warn', 'stale'], notConnected: [] },
  ],
  'pending go to not connected A to Z': [
    [
      source({ id: 'thursday', name: 'Thursday', permission: 'pending', state: 'waiting' }),
      source({ id: 'original', name: 'Original Dating', permission: 'pending', state: 'waiting' }),
    ],
    { live: [], notConnected: ['original', 'thursday'] },
  ],
  'permission none is dropped': [
    [source({ id: 'eventbrite', permission: 'none', state: 'none' }), source({ id: 'fig' })],
    { live: ['fig'], notConnected: [] },
  ],
  'nothing in, nothing out': [[], { live: [], notConnected: [] }],
};

for (const [name, [input, want]] of Object.entries(groupCases)) {
  test(`groupSources: ${name}`, () => {
    const got = groupSources(input);
    assert.deepEqual(ids(got.live), want.live);
    assert.deepEqual(ids(got.notConnected), want.notConnected);
  });
}

test('groupSources: does not mutate the input order', () => {
  const input = [source({ id: 'b', name: 'B' }), source({ id: 'a', name: 'A' })];
  groupSources(input);
  assert.deepEqual(ids(input), ['b', 'a']);
});

const chipCases = {
  'ok': [source({ ageHours: 0.25 }), { state: 'ok', icon: '✓', label: 'Refreshed 15 minutes ago' }],
  'ok without an age': [source({ ageHours: null }), { state: 'ok', label: 'Not refreshed yet' }],
  'warning with failures': [source({ state: 'warning', consecutiveFailures: 2, ageHours: 5 }), { state: 'warning', icon: '⚠', label: 'Issue pulling events, last good pull 5 hours ago' }],
  'warning with failures and no good pull': [source({ state: 'warning', consecutiveFailures: 1, ageHours: null }), { label: 'Issue pulling events, no good pull yet' }],
  'warning that is only overdue': [source({ state: 'warning', consecutiveFailures: 0, ageHours: 30 }), { label: 'Last refreshed 1 day ago' }],
  'warning never refreshed': [source({ state: 'warning', ageHours: null }), { label: 'Not refreshed yet' }],
  'stale and paused': [source({ id: 'dateinadash', name: 'DateinaDash', state: 'stale', enabled: false, ageHours: null }), { state: 'stale', icon: '✕', label: 'Paused after an error' }],
  'stale and enabled': [source({ state: 'stale', ageHours: 80 }), { state: 'stale', label: 'Not refreshed for 3 days' }],
  'stale for under a day says one day': [source({ state: 'stale', ageHours: 20 }), { label: 'Not refreshed for 1 day' }],
  'pending': [source({ permission: 'pending', state: 'waiting', enabled: false, ageHours: null }), { state: 'pending', icon: '⏳', label: 'Not connected yet' }],
  'unknown live state': [source({ state: 'mystery' }), { state: 'unknown', label: 'Status unknown' }],
};

for (const [name, [input, want]] of Object.entries(chipCases)) {
  test(`chipModel: ${name}`, () => {
    const got = chipModel(input);
    for (const [key, value] of Object.entries(want)) assert.equal(got[key], value, key);
  });
}

const ariaCases = {
  'paused': [source({ name: 'DateinaDash', state: 'stale', enabled: false }), 'DateinaDash: paused after an error. Opens the official site.'],
  'refreshed': [source({ name: 'Fig', ageHours: 2 }), 'Fig: refreshed 2 hours ago. Opens the official site.'],
  'pending': [source({ name: 'Thursday', permission: 'pending', state: 'waiting' }), 'Thursday: not connected yet. Opens the official site.'],
};

for (const [name, [input, want]] of Object.entries(ariaCases)) {
  test(`chipModel aria label: ${name}`, () => assert.equal(chipModel(input).ariaLabel, want));
}

const logoCases = {
  'known source has a repo logo': ['thursday', '../img/logos/thursday.jpg'],
  'platform logo lives under platforms': ['dateinadash', '../img/logos/platforms/date-in-a-dash.png'],
  'source without a logo is empty so the monogram shows': ['rendezvous', ''],
};

for (const [name, [id, want]] of Object.entries(logoCases)) {
  test(`chipModel logo: ${name}`, () => assert.equal(chipModel(source({ id })).logo, want));
}

test('chipModel: carries the official site url, id and name for the link', () => {
  const got = chipModel(source({ id: 'thursday', name: 'Thursday', url: 'https://www.thursday.com', permission: 'pending', state: 'waiting' }));
  assert.equal(got.url, 'https://www.thursday.com');
  assert.equal(got.id, 'thursday');
  assert.equal(got.name, 'Thursday');
});

const freshestCases = {
  'smallest age wins': [[source({ ageHours: 5 }), source({ ageHours: 0.5 }), source({ ageHours: 9 })], 0.5],
  'null ages are ignored': [[source({ ageHours: null }), source({ ageHours: 3 })], 3],
  'zero age counts': [[source({ ageHours: 0 }), source({ ageHours: 3 })], 0],
  'all null is null': [[source({ ageHours: null })], null],
  'empty is null': [[], null],
};

for (const [name, [input, want]] of Object.entries(freshestCases)) {
  test(`freshestAgeHours: ${name}`, () => assert.equal(freshestAgeHours(input), want));
}
