/**
 * §9 Guardrails QA/SDET — 6 teaching cards + підсумок ALLOW/DENY/NEEDS_APPROVAL.
 */
import { chromium } from 'playwright';

const BASE = process.env.PREVIEW_BASE ?? 'http://127.0.0.1:4173/ai-qa-agentic-roadmap/';
const URL = `${BASE}#/topic/concept-17/study`;

const CARDS = [
  'Prompt injection',
  'Несанкціонований ресурс',
  'Невалідні аргументи',
  'Підвищення привілеїв',
  'Обхід human approval',
  'Зловживання rate limits',
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.getByRole('button', { name: 'Розгорнути всі' }).click();
  await page.waitForTimeout(300);

  const section = page.locator('.study-section').filter({ hasText: 'QA/SDET' });
  await section.scrollIntoViewIfNeeded();
  const root = section.locator('.study-guardrails-qa-tests');
  await root.waitFor({ state: 'visible', timeout: 15000 });

  if (await section.locator('.study-split-hint').count()) {
    throw new Error('Legacy StudySplitHintPanel still rendered for §9');
  }

  const nav = root.locator('button.study-interactive-card, button.study-flow-stage-card');
  if (await nav.count() !== 6) {
    throw new Error(`Expected 6 QA test cards, got ${await nav.count()}`);
  }

  for (const title of CARDS) {
    await nav.filter({ hasText: title }).first().click();
    await page.waitForTimeout(200);
  }

  await root.getByText('Що має довести тест', { exact: true }).waitFor({ state: 'visible' });
  await root.getByText('NEEDS_APPROVAL', { exact: true }).waitFor({ state: 'visible' });

  await browser.close();
  console.log('guardrails-section9-qa-check: ok');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
