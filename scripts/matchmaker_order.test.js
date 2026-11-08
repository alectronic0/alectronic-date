// node --test scripts/matchmaker_order.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { groupMatchmakers } = require('../js/matchmaker-order.js');

global.window = {};
require('../js/dating-services.js');
const cards = global.window.DATING_SERVICES.matchmakers;

const s = (name, group, extra = {}) => ({ name, group, ...extra });

test('groups come out featured, free, paid and empty ones are dropped', () => {
  const got = groupMatchmakers([s('P', 'paid', { sortPrice: 1 }), s('F', 'featured', { rank: 1 })]);
  assert.deepEqual(got.map((g) => g.id), ['featured', 'paid']);
});

test('featured follows rank, free is alphabetical', () => {
  const got = groupMatchmakers([s('B', 'featured', { rank: 2 }), s('A', 'featured', { rank: 1 }), s('Z', 'free'), s('M', 'free')]);
  assert.deepEqual(got[0].items.map((i) => i.name), ['A', 'B']);
  assert.deepEqual(got[1].items.map((i) => i.name), ['M', 'Z']);
});

test('paid goes cheapest first with unknown prices last', () => {
  const got = groupMatchmakers([s('Dear', 'paid', { sortPrice: 9000 }), s('Unknown', 'paid', { sortPrice: null }), s('Cheap', 'paid', { sortPrice: 300 })]);
  assert.deepEqual(got[0].items.map((i) => i.name), ['Cheap', 'Dear', 'Unknown']);
});

test('every real card has a group, and the top three are Graft, Elect, Sparked', () => {
  assert.ok(cards.every((c) => ['featured', 'free', 'paid'].includes(c.group)), 'group missing');
  const groups = groupMatchmakers(cards);
  assert.deepEqual(groups[0].items.map((i) => i.slug), ['graft-dating', 'elect-club', 'sparked-connection']);
});

test('the paid group on real data is ascending', () => {
  const prices = groupMatchmakers(cards).find((g) => g.id === 'paid').items.map((i) => i.sortPrice).filter((p) => typeof p === 'number');
  assert.deepEqual(prices, [...prices].sort((a, b) => a - b));
});

test('no matchmaker card carries a personal take and every source is http(s)', () => {
  for (const c of cards) {
    assert.equal('myTake' in c, false, c.slug);
    for (const url of c.sources) assert.match(url, /^https?:\/\//, c.slug);
  }
});
