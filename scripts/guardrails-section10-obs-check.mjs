/**
 * Observability (Guardrails) — схема, 6 карток, trace-read pick.
 */
import { chromium } from 'playwright';

const BASE = process.env.PREVIEW_BASE ?? 'http://127.0.0.1:4173/ai-qa-agentic-roadmap/';
const URL = `${BASE}#/topic/concept-17/study`;

const OBS_CARDS = [
  'Пропозиція моделі',
  'Валідація та policy',
  'Deny: дія заблокована',
  'Allow: виконання дозволено',
  'Погодження людини',
  'Re-check і результат Jira API',
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.getByRole('button', { name: 'Розгорнути всі' }).click();
  await page.waitForTimeout(300);

  const section = page.locator('.study-section').filter({
    has: page.locator('.study-guardrails-observability'),
  });
  await section.scrollIntoViewIfNeeded();
  const root = section.locator('.study-guardrails-observability');
  await root.waitFor({ state: 'visible', timeout: 15000 });

  await root.locator('.policy-flow-figure').waitFor({ state: 'visible' });

  const cards = root.locator('.study-guardrails-observability-cards button.study-flow-stage-card');
  if (await cards.count() !== 6) {
    throw new Error(`Expected 6 observability cards, got ${await cards.count()}`);
  }

  for (const title of OBS_CARDS) {
    await cards.filter({ hasText: title }).first().click();
    await page.waitForTimeout(150);
  }

  await root.getByText('Як читати trace одного run', { exact: true }).waitFor({ state: 'visible' });
  await root.getByText('Що не потрібно записувати в логи', { exact: true }).waitFor({ state: 'visible' });

  if (await root.locator('.study-obs-fields').count()) {
    throw new Error('Legacy FieldSplitPanel still present');
  }

  await browser.close();
  console.log('guardrails-section10-obs-check: ok');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
