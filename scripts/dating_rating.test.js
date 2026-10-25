// node --test scripts/dating_rating.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { ratingFor } = require('../js/dating-rating.js');

const TODAY = '2026-10-25';
const verified = ['selfie/photo verification'];

const cases = {
  'clean and verified is trusted': [{ verification: verified }, 'trusted', false],
  'critical entry is avoid however old': [{ verification: verified, track: [{ date: '2016-12-14', severity: 'critical', summary: 'x' }] }, 'avoid', false],
  'recent major entry is caution': [{ verification: verified, track: [{ date: '2025-08-12', severity: 'major', summary: 'x' }] }, 'caution', false],
  'major entry over three years old is trusted': [{ verification: verified, track: [{ date: '2020-12-01', severity: 'major', summary: 'x' }] }, 'trusted', false],
  'minor entry is trusted': [{ verification: verified, track: [{ date: '2025-01-01', severity: 'minor', summary: 'x' }] }, 'trusted', false],
  'no verification is caution': [{ verification: [] }, 'caution', false],
  'unconfirmed verification is not held against it': [{ verification: null }, 'trusted', false],
  'pay-per-message is caution': [{ verification: verified, pricingModel: 'pay-per-message credits' }, 'caution', false],
  'override wins': [{ verification: [], ratingOverride: { rating: 'trusted', reason: 'Vetted by application' } }, 'trusted', true],
};

for (const [name, [service, want, byHand]] of Object.entries(cases)) {
  test(name, () => {
    const got = ratingFor(service, TODAY);
    assert.equal(got.rating, want);
    assert.equal(got.byHand, byHand);
  });
}

test('every non-trusted rating explains itself', () => {
  const got = ratingFor({ verification: [], track: [{ date: '2025-08-12', severity: 'major', summary: 'FTC settlement' }] }, TODAY);
  assert.deepEqual(got.reasons.map((r) => r.text), ['FTC settlement', 'No photo, ID or application check on members.']);
});
