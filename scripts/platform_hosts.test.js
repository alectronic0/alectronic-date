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

test('socialLinks leaves out the website', () => {
  const host = site('h', 'https://h.com/', [{ label: 'Instagram', url: 'https://www.instagram.com/h/' }, { label: 'Home', url: 'https://www.h.com/about' }]);
  assert.deepEqual(socialLinks(host).map((l) => l.label), ['Instagram']);
});
