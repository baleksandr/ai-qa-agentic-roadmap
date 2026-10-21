/**
 * Production + interview sections — smoke on wide and narrow viewports.
 */
import { chromium } from 'playwright';

const BASE = process.env.PREVIEW_BASE ?? 'http://127.0.0.1:4173/ai-qa-agentic-roadmap/';
const URL = `${BASE}#/topic/concept-17/study`;

const PROD_TOPICS = [
  'Versioning політик',
  'Latency policy',
  'Cost і rate limits',
  'Retries та idempotency',
  'Concurrency та approval',
  'Degradation і policy',
  'Data retention',
  'Monitoring та incident',
];

async function checkViewport(page, width) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.getByRole('button', { name: 'Розгорнути всі' }).click();
  await page.waitForTimeout(300);

  const prod = page.locator('.study-guardrails-production');
  await prod.scrollIntoViewIfNeeded();
  const prodCards = prod.locator('button.study-flow-stage-card');
  if (await prodCards.count() !== 8) {
    throw new Error(`[${width}px] Expected 8 production cards, got ${await prodCards.count()}`);
  }
  const topicsToClick = width >= 800 ? PROD_TOPICS : PROD_TOPICS.slice(0, 2);
  for (const title of topicsToClick) {
    const card = prodCards.filter({ hasText: title }).first();
    await card.scrollIntoViewIfNeeded();
    await card.click();
    await page.waitForTimeout(100);
  }
  await page.locator('.study-guardrails-production-closing').waitFor({ state: 'visible' });

  const interview = page.locator('.study-interview-self-check');
  await interview.scrollIntoViewIfNeeded();
  await interview.getByText('Short answer in English', { exact: false }).first().waitFor({ state: 'hidden' });
  await interview.getByRole('button', { name: 'Показати відповідь' }).first().click();
  await interview.getByText('Short answer in English', { exact: true }).waitFor({ state: 'visible' });
  await interview.getByText('Цільна відповідь', { exact: false }).waitFor({ state: 'visible' });
  await interview.locator('.study-interview-answer-en').first().waitFor({ state: 'visible' });
  await interview.getByRole('link', { name: /Tool Calling/ }).waitFor({ state: 'visible' });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await checkViewport(page, 1200);
  await checkViewport(page, 390);
  await browser.close();
  console.log('guardrails-section11-12-check: ok');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
