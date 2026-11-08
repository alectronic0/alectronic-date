// Folds the host spotlights into the Platforms list so each organiser has one card (no DOM).
// A host joins every platform on the same website; a host with no platform becomes a card of its own.
// Loaded by labs/events.html (window.PlatformHosts) and by node --test (module.exports).
(function (root) {
  const HOST_CATEGORY = 'Singles host';

  function hostnameOf(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
    } catch (e) {
      return '';
    }
  }

  function websiteOf(host) {
    const first = (host.links || []).find((link) => hostnameOf(link.url));
    return first ? first.url : '';
  }

  function hostCard(host) {
    return {
      name: host.name,
      url: websiteOf(host),
      category: HOST_CATEGORY,
      description: host.blurb || '',
      logo: host.logo,
      tags: [],
      host,
    };
  }

  function mergePlatforms(platforms, hosts) {
    const byName = new Map();
    (hosts || []).forEach((host) => {
      const name = hostnameOf(websiteOf(host));
      if (name) byName.set(name, host);
    });
    const used = new Set();
    const merged = (platforms || []).map((item) => {
      const host = byName.get(hostnameOf(item.url));
      if (!host) return item;
      used.add(host.id);
      return { ...item, host };
    });
    const extra = (hosts || []).filter((host) => !used.has(host.id)).map(hostCard);
    return merged.concat(extra);
  }

  // Socials only: the website is already the card's main button.
  function socialLinks(host) {
    const site = hostnameOf(websiteOf(host));
    return (host.links || []).filter((link) => hostnameOf(link.url) && hostnameOf(link.url) !== site);
  }

  const api = { HOST_CATEGORY, hostnameOf, mergePlatforms, socialLinks };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PlatformHosts = api;
})(typeof window !== 'undefined' ? window : globalThis);
