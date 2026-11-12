import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..', '..');
const posterHtmlUrl = `file://${path.join(repoRoot, 'poster.html')}`;
const outputsDir = path.join(repoRoot, 'outputs');

if (!fs.existsSync(outputsDir)) {
  fs.mkdirSync(outputsDir, { recursive: true });
}

// Layout happens at screen-like CSS sizes; `scale` multiplies up to the output pixels.
// A 2480px-wide CSS viewport makes site-scale type look tiny on A4.
const formats = [
  { name: 'og-image', format: 'og', width: 600, height: 315, scale: 2 },
  { name: 'tiktok-reels', format: 'tiktok', width: 540, height: 960, scale: 2 },
  { name: 'instagram-post', format: 'ig', width: 540, height: 675, scale: 2 },
  { name: 'print-poster', format: 'print', width: 620, height: 877, scale: 4 }, // 2480x3508, A4 at 300dpi
  { name: 'billboard-portrait', format: 'billboard-portrait', width: 540, height: 960, scale: 2 },
  { name: 'billboard-landscape', format: 'billboard-landscape', width: 960, height: 540, scale: 2 }
];

const conceptsHtmlUrl = `file://${path.join(repoRoot, 'poster-concepts.html')}`;
const conceptVariants = ['vacancy', 'player2', 'editorial'];
const conceptFormats = [
  { name: 'screen', format: 'billboard-portrait', width: 540, height: 960, scale: 2 },
  { name: 'a4', format: 'print', width: 620, height: 877, scale: 4 }
];

async function render(browser, url, fmt, name) {
  console.log(`Generating ${name} (${fmt.width * fmt.scale}x${fmt.height * fmt.scale})...`);
  const context = await browser.newContext({
    viewport: { width: fmt.width, height: fmt.height },
    deviceScaleFactor: fmt.scale
  });
  const page = await context.newPage();
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(outputsDir, `${name}.jpg`), type: 'jpeg', quality: 95 });
  await context.close();
}

async function generate() {
  console.log('Launching browser...');
  const browser = await chromium.launch();

  for (const fmt of formats) {
    await render(browser, `${posterHtmlUrl}?format=${fmt.format}`, fmt, fmt.name);
  }
  for (const variant of conceptVariants) {
    for (const fmt of conceptFormats) {
      await render(browser, `${conceptsHtmlUrl}?variant=${variant}&format=${fmt.format}`, fmt, `concept-${variant}-${fmt.name}`);
    }
  }

  await browser.close();
  console.log('Done! Generated images are in the outputs/ folder.');
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
