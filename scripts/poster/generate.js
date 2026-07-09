import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..', '..');
const posterHtmlUrl = `file://${path.join(repoRoot, 'poster.html')}`;
const outputsDir = path.join(repoRoot, 'outputs');

// Ensure outputs directory exists
if (!fs.existsSync(outputsDir)) {
  fs.mkdirSync(outputsDir, { recursive: true });
}

const formats = [
  { name: 'og-image', format: 'og', width: 1200, height: 630 },
  { name: 'tiktok-reels', format: 'tiktok', width: 1080, height: 1920 },
  { name: 'instagram-post', format: 'ig', width: 1080, height: 1350 },
  { name: 'print-poster', format: 'print', width: 2480, height: 3508 } // A4 at 300dpi
];

async function generate() {
  console.log('Launching browser...');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const fmt of formats) {
    console.log(`Generating ${fmt.name}...`);
    await page.setViewportSize({ width: fmt.width, height: fmt.height });
    
    // Using file:// protocol, content.js uses <script> so no CORS issues
    await page.goto(`${posterHtmlUrl}?format=${fmt.format}`);
    
    // Wait for images to load
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: path.join(outputsDir, `${fmt.name}.jpg`), 
      type: 'jpeg', 
      quality: 95 
    });
  }

  await browser.close();
  console.log('Done! Generated images are in the outputs/ folder.');
}

generate().catch(console.error);
