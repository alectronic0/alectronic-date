// Smoke-test every page: console errors, failed requests, redirect target and rendered element counts.
// Usage: node scripts/check_pages.js <baseUrl> [path ...]
const puppeteer = require('puppeteer');

const DEFAULT_PATHS = [
  '', 'labs/', 'labs/events.html', 'labs/ideas.html', 'labs/nerd-gatherings.html',
  'labs/cinema-events.html', 'labs/cinema-map.html', 'labs/london-activities.html', 'labs/workshops.html',
];

const COUNTED = {
  cards: '[class*="card"]',
  markers: '.leaflet-marker-icon, .marker-cluster, .leaflet-interactive',
  images: 'img',
};

async function check(browser, base, path) {
  const page = await browser.newPage();
  const errors = [];
  const failed = [];
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('response', (res) => {
    if (res.status() >= 400) failed.push(`${res.status()} ${res.url()}`);
  });
  await page.goto(base + path, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1500));
  const counts = {};
  for (const [name, selector] of Object.entries(COUNTED)) {
    counts[name] = await page.$$eval(selector, (els) => els.length);
  }
  const brokenImages = await page.$$eval('img', (els) => els.filter((i) => i.complete && i.naturalWidth === 0 && i.src).map((i) => i.src));
  const landed = page.url().replace(base, '');
  await page.close();
  return { path, landed, counts, errors, failed, brokenImages };
}

(async () => {
  const [base, ...paths] = process.argv.slice(2);
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'], executablePath: process.env.CHROME_PATH });
  for (const path of paths.length ? paths : DEFAULT_PATHS) {
    const r = await check(browser, base, path);
    console.log(JSON.stringify(r));
  }
  await browser.close();
})();
