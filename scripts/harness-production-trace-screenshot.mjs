/**
 * Скрін §8 trace: вкладені картки + панель на широкому екрані.
 * npm run preview -- --port 4173 && node scripts/harness-production-trace-screenshot.mjs
 */
import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:4173/ai-qa-agentic-roadmap/';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${BASE}#/topic/concept-04/study`, { waitUntil: 'networkidle' });

  await page.locator('.study-section-header').filter({ hasText: 'Production' }).click();
  const prod = page.locator('section.study-section.open', { has: page.locator('.study-harness-production') });
  await prod.waitFor({ timeout: 12000 });

  await prod.getByRole('button', { name: /Події одного run/i }).click();
  await prod.getByText('Що шукати в trace', { exact: false }).waitFor({ state: 'visible', timeout: 10000 });

  const layout = prod.locator('.study-harness-production .study-step-detail-layout').first();
  await layout.waitFor({ state: 'visible', timeout: 8000 });
  const box = await layout.boundingBox();
  if (!box || box.width < 400) {
    throw new Error(`Expected wide side-by-side layout, got width ${box?.width}`);
  }

  await layout.screenshot({ path: 'docs/harness-study-section-08-trace-wide.png' });
  await browser.close();
  console.log('harness-production-trace-screenshot: ok');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
