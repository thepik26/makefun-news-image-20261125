// Renders render/news.html to entry.png (1024x1024) with headless Chromium.
// Run from the entry repo root:  node render/shot.cjs
// The PNG is the deliverable; main.ts only copies it to /output at grade time.

const { chromium } = require('/tmp/pw-shot/node_modules/playwright-core');
const fs = require('node:fs');
const path = require('node:path');

const repo = path.join(__dirname, '..');
const pageUrl = 'file://' + path.join(repo, 'render', 'news.html');
const outFile = path.join(repo, 'entry.png');

(async () => {
  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-gpu', '--force-device-scale-factor=1'],
  });
  const page = await browser.newPage({ viewport: { width: 1024, height: 1024 } });
  await page.goto(pageUrl, { waitUntil: 'load' });
  await page.waitForTimeout(400);
  await page.screenshot({ path: outFile, type: 'png' });
  await browser.close();

  const size = fs.statSync(outFile).size;
  console.log('wrote', outFile, size, 'bytes');
  if (size > 1048576) {
    console.error('ERROR: entry.png exceeds the 1 MiB cap');
    process.exit(1);
  }
})();
