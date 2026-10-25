// Shared helpers for the labs guides (labs/events.html, labs/dating/*): escaping, URL guards and logos.
window.LabsUI = (function () {
  function esc(value) {
    return String(value ?? '').replace(/[&<>"'`]/g, (c) => `&#${c.charCodeAt(0)};`);
  }

  function safeUrl(url) {
    return /^https?:\/\//i.test(url || '') ? url : '';
  }

  function safeAsset(url) {
    return /^(https?:\/\/|(\.\.\/)+img\/)/i.test(url || '') ? url : '';
  }

  // Services without a logo get a lettered circle; a broken logo image is swapped for one (see bindLogoFallback).
  function monogram(name, cls) {
    const label = String(name || '?').replace(/[^\p{L}\p{N}]/gu, '').charAt(0).toUpperCase() || '?';
    let hash = 0;
    for (const ch of String(name || '')) hash = (hash * 31 + ch.charCodeAt(0)) % 360;
    return `<span class="logo logo-mono ${cls}" style="--mono-hue:${hash}" aria-hidden="true">${esc(label)}</span>`;
  }

  function logoHtml(name, url, cls) {
    if (!url) return monogram(name, cls);
    return `<img src="${esc(url)}" alt="" class="logo ${cls}" data-mono="${esc(name)}" loading="lazy">`;
  }

  function bindLogoFallback() {
    document.addEventListener('error', (e) => {
      const img = e.target;
      if (!(img instanceof HTMLImageElement) || !img.classList.contains('logo')) return;
      const cls = [...img.classList].filter((c) => c !== 'logo').join(' ');
      img.outerHTML = monogram(img.dataset.mono, cls);
    }, true);
  }

  return { esc, safeUrl, safeAsset, monogram, logoHtml, bindLogoFallback };
})();
