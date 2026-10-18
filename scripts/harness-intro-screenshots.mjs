/**
 * Скріни: concept-04 outcomes + §1 (широкий і вузький).
 * node scripts/harness-intro-screenshots.mjs [baseUrl]
 */
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE =
  process.argv[2] ?? 'http://localhost:4188/ai-qa-agentic-roadmap/';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'docs');

async function capture(page, name, viewport) {
  await page.setViewportSize(viewport);
  await page.goto(`${BASE}#/topic/concept-04/study`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Що я зрозумію після цього уроку' }).waitFor({ timeout: 20000 });
  const whySection = page.locator('.study-section-header').filter({ hasText: 'Навіщо потрібен harness' });
  if ((await whySection.getAttribute('aria-expanded')) !== 'true') {
    await whySection.click();
  }
  await page.getByText('Що запропонувала модель', { exact: false }).first().waitFor({ timeout: 15000 });
  const file = path.join(outDir, name);
  await page.screenshot({ path: file, fullPage: true });
  console.log('wrote', file);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await capture(page, 'harness-study-intro-wide.png', { width: 1280, height: 900 });
  await capture(page, 'harness-study-intro-narrow.png', { width: 390, height: 844 });
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
