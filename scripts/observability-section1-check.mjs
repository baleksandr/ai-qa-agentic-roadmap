/**
 * Observability §1 — вступ, три картки, схема run → spans → on-call debug.
 */
import { chromium } from 'playwright';

const BASE = process.env.PREVIEW_BASE ?? 'http://127.0.0.1:4173/ai-qa-agentic-roadmap/';
const URL = `${BASE}#/topic/concept-18/study`;

async function checkViewport(page, width) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.getByRole('button', { name: 'Розгорнути всі' }).click();
  await page.waitForTimeout(300);

  const outcomes = page.locator('.study-observability-outcomes-block');
  await outcomes.waitFor({ state: 'visible', timeout: 15000 });
  const cards = outcomes.locator('.study-skills-outcome-card');
  if (await cards.count() !== 3) {
    throw new Error(`[${width}px] Expected 3 outcome cards, got ${await cards.count()}`);
  }
  await outcomes.getByText('Що показує trace', { exact: true }).waitFor({ state: 'visible' });

  const why = page.locator('.study-observability-why');
  await why.scrollIntoViewIfNeeded();
  await why.waitFor({ state: 'visible', timeout: 15000 });
  await why.locator('.study-observability-why-flow-caption').waitFor({ state: 'visible' });
  if (width >= 800) {
    const flowRoot = why.locator('.study-observability-why-flow');
    await flowRoot.locator('.study-learner-flow-pill-label', { hasText: 'run' }).first().waitFor({
      state: 'visible',
    });
  }

  const overflow = await page.evaluate(() => {
    const el = document.documentElement;
    return el.scrollWidth > el.clientWidth + 2;
  });
  if (overflow) {
    throw new Error(`[${width}px] Horizontal overflow on page`);
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await checkViewport(page, 1200);
  await checkViewport(page, 390);
  await browser.close();
  console.log('observability-section1-check: ok');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
