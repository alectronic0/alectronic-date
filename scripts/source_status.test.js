// node --test scripts/source_status.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { ageText, chipModel, platformChip, freshestAgeHours } = require('../js/source-status.js');

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
  'pending': [source({ permission: 'pending', state: 'waiting', enabled: false, ageHours: null }), { state: 'pending', icon: '⏳', label: 'Working on connecting' }],
  'unknown live state': [source({ state: 'mystery' }), { state: 'unknown', label: 'Status unknown' }],
};

for (const [name, [input, want]] of Object.entries(chipCases)) {
  test(`chipModel: ${name}`, () => {
    const got = chipModel(input);
    for (const [key, value] of Object.entries(want)) assert.equal(got[key], value, key);
  });
}

const platformCases = {
  'cleared source matched by host, www ignored': ['https://figdating.com/events/', [source({ url: 'https://www.figdating.com' })], { state: 'ok', label: 'Refreshed 15 minutes ago' }],
  'cleared but stale keeps its own state': ['https://dateinadash.com/', [source({ url: 'https://dateinadash.com', state: 'stale', enabled: false, ageHours: null })], { state: 'stale', label: 'Paused after an error' }],
  'pending source is still on the way': ['https://truedating.co.uk/events/x', [source({ url: 'https://truedating.co.uk', permission: 'pending', state: 'waiting' })], { state: 'pending', label: 'Working on connecting' }],
  'permission none is on the way': ['https://eventbrite.co.uk/', [source({ url: 'https://www.eventbrite.co.uk', permission: 'none', state: 'none' })], { state: 'pending', label: 'Working on connecting' }],
  'no matching source is on the way': ['https://cityswoon.com/uk/', [source()], { state: 'pending', label: 'Working on connecting' }],
  'same host, different subdomain is not a match': ['https://events.figdating.com/', [source({ url: 'https://figdating.com' })], { state: 'pending' }],
  'bad url is on the way': ['not a url', [source()], { state: 'pending' }],
  'empty source list is on the way': ['https://figdating.com/', [], { state: 'pending' }],
};

for (const [name, [url, sources, want]] of Object.entries(platformCases)) {
  test(`platformChip: ${name}`, () => {
    const got = platformChip(url, sources);
    for (const [key, value] of Object.entries(want)) assert.equal(got[key], value, key);
  });
}

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
