// node --test scripts/platform_hosts.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { mergePlatforms, socialLinks, hostnameOf, HOST_CATEGORY } = require('../js/platform-hosts.js');

const site = (id, url, extra = []) => ({ id, name: id, blurb: `${id} blurb`, links: [{ label: 'Website', url }, ...extra] });

test('hostnameOf ignores www and rejects junk', () => {
  assert.equal(hostnameOf('https://www.Haystack-Dating.com/london'), 'haystack-dating.com');
  assert.equal(hostnameOf('not a url'), '');
});

test('a host joins every platform on its website', () => {
  const platforms = [
    { name: 'Original — London', url: 'https://www.originaldating.com/london/' },
    { name: 'Original — St Albans', url: 'https://www.originaldating.com/st-albans/' },
    { name: 'Other', url: 'https://example.org/' },
  ];
  const merged = mergePlatforms(platforms, [site('original', 'https://originaldating.com/')]);
  assert.equal(merged.length, 3);
  assert.equal(merged[0].host.id, 'original');
  assert.equal(merged[1].host.id, 'original');
  assert.equal('host' in merged[2], false);
});

test('a host with no platform becomes its own card, once', () => {
  const merged = mergePlatforms([{ name: 'A', url: 'https://a.com/' }], [site('fig', 'https://figdating.com/')]);
  assert.equal(merged.length, 2);
  assert.deepEqual([merged[1].name, merged[1].category, merged[1].url, merged[1].description], ['fig', HOST_CATEGORY, 'https://figdating.com/', 'fig blurb']);
  assert.equal(merged[1].host.id, 'fig');
});

test('missing lists are fine', () => {
  assert.deepEqual(mergePlatforms(undefined, undefined), []);
});

test('logoFor finds the platform logo on the same website', () => {
  const platforms = [{ url: 'https://truedating.co.uk/events/search/city/london', logo: '../img/logos/platforms/true-dating.png' }, { url: 'https://a.com/' }];
  const { logoFor } = require('../js/platform-hosts.js');
  assert.equal(logoFor('https://www.truedating.co.uk/events/mini-golf-singles-party-24-nov-2026', platforms), '../img/logos/platforms/true-dating.png');
  assert.equal(logoFor('https://a.com/x', platforms), '');
  assert.equal(logoFor('nonsense', platforms), '');
  assert.equal(logoFor('https://other.org/', undefined), '');
});

test('socialLinks leaves out the website', () => {
  const host = site('h', 'https://h.com/', [{ label: 'Instagram', url: 'https://www.instagram.com/h/' }, { label: 'Home', url: 'https://www.h.com/about' }]);
  assert.deepEqual(socialLinks(host).map((l) => l.label), ['Instagram']);
});
