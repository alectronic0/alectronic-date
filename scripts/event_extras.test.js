// node --test scripts/event_extras.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { priceLabel, ageLabel, tiersLabel, genderLabel, statusLabel, chips } = require('../js/event-extras.js');
const { mapEvent } = require('../js/events-api.js');

const priceCases = {
  'fee-inclusive range': [{ priceMin: 22, priceMax: 27.5, priceNote: 'incl. fees', price: 'From £20' }, '£22 - £27.50 incl. fees'],
  'single all-in price': [{ priceMin: 33, priceMax: 33, priceNote: 'incl. fees' }, '£33 incl. fees'],
  'min only is a single price': [{ priceMin: 15 }, '£15'],
  'no range falls back to the price text': [{ price: 'From £20 + booking fee' }, 'From £20 + booking fee'],
  'nothing at all is empty': [{}, ''],
};
for (const [name, [event, want]] of Object.entries(priceCases)) test(`priceLabel: ${name}`, () => assert.equal(priceLabel(event), want));

const ageCases = {
  'range': [{ ageMin: 30, ageMax: 45 }, '30-45'],
  'open ended': [{ ageMin: 40, ageMax: null }, '40+'],
  'none': [{}, ''],
};
for (const [name, [event, want]] of Object.entries(ageCases)) test(`ageLabel: ${name}`, () => assert.equal(ageLabel(event), want));

test('tiersLabel lists name and price in the order given', () => {
  assert.equal(tiersLabel({ tiers: [{ name: 'Early bird', price: 15 }, { name: 'Standard', price: 20.5 }] }), 'Early bird £15 · Standard £20.50');
  assert.equal(tiersLabel({}), '');
});

test('genderLabel needs both counts', () => {
  assert.equal(genderLabel({ menLeft: 3, womenLeft: 5 }), "3 men's and 5 women's tickets left");
  assert.equal(genderLabel({ menLeft: 0, womenLeft: 5 }), "0 men's and 5 women's tickets left");
  assert.equal(genderLabel({ menLeft: 3 }), '');
});

test('statusLabel words only postponed and cancelled', () => {
  assert.equal(statusLabel({ eventStatus: 'postponed' }), 'Postponed');
  assert.equal(statusLabel({ eventStatus: 'cancelled' }), 'Cancelled');
  assert.equal(statusLabel({ eventStatus: 'scheduled' }), '');
  assert.equal(statusLabel({}), '');
});

test('chips come in a fixed order and skip what is missing', () => {
  const got = chips({ ageMin: 30, ageMax: 45, guests: 160, included: 'free drink', lastEntry: '7:30pm' });
  assert.deepEqual(got.map((c) => c.kind), ['age', 'guests', 'included', 'entry']);
  assert.equal(got[0].text, '🧑 30-45');
  assert.deepEqual(chips({}), []);
});

const apiEvent = (overrides) => ({
  id: 'e1', source: 'boda', hostId: 'boda', title: 'Party', hostName: 'BODA', eventUrl: 'https://example.com/e1',
  startsAt: '2026-12-01T19:00', endsAt: null, venueName: 'V', address: 'A', hasSpaces: true, availabilityNote: null, meta: {}, ...overrides,
});

test('mapEvent copies extras only when the API sent them', () => {
  const plain = mapEvent(apiEvent());
  for (const key of ['ageMin', 'priceMin', 'tiers', 'menLeft', 'eventStatus', 'guests', 'included']) assert.equal(key in plain, false, key);
  const rich = mapEvent(apiEvent({
    ageMin: 25, ageMax: 35, priceMin: 22, priceMax: 27.5, priceNote: 'incl. fees', status: 'postponed', guests: 160, included: 'free drink', lastEntry: '7:30pm',
    meta: { tiers: [{ name: 'Early', price: 20 }], menTicketsLeft: 3, womenTicketsLeft: 5 },
  }));
  assert.deepEqual(
    [rich.ageMin, rich.ageMax, rich.priceMin, rich.priceMax, rich.priceNote, rich.eventStatus, rich.guests, rich.included, rich.lastEntry, rich.menLeft, rich.womenLeft],
    [25, 35, 22, 27.5, 'incl. fees', 'postponed', 160, 'free drink', '7:30pm', 3, 5],
  );
  assert.deepEqual(rich.tiers, [{ name: 'Early', price: 20 }]);
});

test('mapEvent keeps a scheduled status off the card and a zero count on it', () => {
  assert.equal('eventStatus' in mapEvent(apiEvent({ status: 'scheduled' })), false);
  assert.equal(mapEvent(apiEvent({ meta: { menTicketsLeft: 0, womenTicketsLeft: 2 } })).menLeft, 0);
});
