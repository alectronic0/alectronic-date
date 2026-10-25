// node scripts/cache_bust.js <version> [root]
// Deploy step: tags local .js/.css references in every HTML file with ?v=<version>.
// The host caches assets for 10 minutes, so untagged files leave browsers pairing new HTML with old JS.
const fs = require('fs');
const path = require('path');

const SKIP_DIRS = new Set(['node_modules', '.git']);
const LOCAL_ASSET = /\b(src|href)="((?![a-z][a-z0-9+.-]*:|\/\/)[^"?#]+\.(?:js|css))"/gi;

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return SKIP_DIRS.has(entry.name) ? [] : htmlFiles(full);
    return entry.name.endsWith('.html') ? [full] : [];
  });
}

function tag(html, version) {
  return html.replace(LOCAL_ASSET, (_, attr, url) => `${attr}="${url}?v=${version}"`);
}

function main() {
  const [version, root = '.'] = process.argv.slice(2);
  if (!/^[\w.-]+$/.test(version || '')) {
    console.error('usage: node scripts/cache_bust.js <version> [root]');
    process.exit(1);
  }
  let tagged = 0;
  htmlFiles(root).forEach((file) => {
    const before = fs.readFileSync(file, 'utf8');
    const after = tag(before, version);
    if (after === before) return;
    fs.writeFileSync(file, after);
    tagged += 1;
  });
  console.log(`Cache-busted ${tagged} HTML files with ?v=${version}`);
}

if (require.main === module) main();
module.exports = { tag };
