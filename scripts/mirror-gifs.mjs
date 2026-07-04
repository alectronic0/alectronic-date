/* ============================================================
   Mirror external GIFs into the repo.
   ------------------------------------------------------------
   Finds every http(s) src in CONTENT's gifGrid blocks, downloads
   each to img/gifs/<id>.gif, and rewrites content.js to point at
   the local copy — so the collection can't rot if Giphy/Tenor
   ever drop a link.

   Run from the repo root:  node scripts/mirror-gifs.mjs
   List without downloading: node scripts/mirror-gifs.mjs --list

   Meant to run via .github/workflows/mirror-gifs.yml (GitHub's
   runners have the outbound network access to reach Giphy/Tenor).
   Safe to re-run: already-local srcs are skipped.
   ============================================================ */

import {createRequire} from 'node:module';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';

const require = createRequire(import.meta.url);
globalThis.window = {};
require('../content.js');

const CONTENT_PATH = new URL('../content.js', import.meta.url).pathname;
const GIF_DIR = new URL('../img/gifs/', import.meta.url).pathname;
const listOnly = process.argv.includes('--list');

// A stable, readable filename from the URL: the Giphy/Tenor media id
// (second-to-last path segment; both end in a fixed basename like giphy.gif).
function localNameFor(url) {
    const segs = new URL(url).pathname.split('/').filter(Boolean);
    const id = segs[segs.length - 2] || segs[segs.length - 1];
    return `${id}.gif`;
}

const external = [];
for (const section of Object.values(window.CONTENT.sections || {})) {
    for (const block of section.blocks || []) {
        if (block.type !== 'gifGrid') continue;
        for (const g of block.gifs || []) {
            if (/^https?:\/\//.test(g.src)) external.push(g.src);
        }
    }
}

if (!external.length) {
    console.log('No external GIF URLs found — nothing to do.');
    process.exit(0);
}

console.log(`Found ${external.length} external GIF(s):`);
let contentSrc = readFileSync(CONTENT_PATH, 'utf8');
let failures = 0;

for (const url of external) {
    const local = `img/gifs/${localNameFor(url)}`;
    console.log(`  ${url}\n    -> ${local}`);
    if (listOnly) continue;
    mkdirSync(GIF_DIR, {recursive: true});
    const dest = new URL(`../${local}`, import.meta.url).pathname;
    if (!existsSync(dest)) {
        try {
            execFileSync('curl', ['-fsSL', '--max-time', '120', '-o', dest, url], {stdio: 'inherit'});
        } catch (e) {
            console.error(`    !! download failed — leaving this one hotlinked`);
            failures++;
            continue;
        }
    }
    contentSrc = contentSrc.replaceAll(url, local);
}

if (!listOnly) {
    writeFileSync(CONTENT_PATH, contentSrc);
    console.log(`Done. Rewrote content.js${failures ? ` (${failures} URL(s) left hotlinked after failed downloads)` : ''}.`);
}
