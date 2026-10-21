/**
 * §4 Guardrails: «Що передається між компонентами?» + вкладені поля повідомлення.
 *
 * npm run build && npm run preview -- --port 4173
 * node scripts/guardrails-section4-transfer-check.mjs
 */
import { chromium } from 'playwright';

const BASE =
  process.env.PREVIEW_BASE ?? 'http://127.0.0.1:4173/ai-qa-agentic-roadmap/';
const URL = `${BASE}#/topic/concept-17/study`;

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });

  await page.getByRole('button', { name: 'Розгорнути всі' }).click();
  await page.waitForTimeout(300);

  const section = page.locator('.study-section').filter({ hasText: 'передається між' });
  await section.scrollIntoViewIfNeeded();
  const root = section.locator('.study-guardrails-data-transfer');
  await root.waitFor({ state: 'visible', timeout: 15000 });

  if (await page.locator('.study-transfer-flow').count()) {
    throw new Error('Horizontal StudyTransferFlow still rendered for §4');
  }

  await root.locator('button.study-flow-stage-card').filter({ hasText: 'Пропонована дія' }).first().click();
  await page.waitForTimeout(250);

  const msgPick = root.locator('.study-learner-panel-step-pick').filter({ hasText: 'Що містить повідомлення' });
  await msgPick.waitFor({ state: 'visible', timeout: 10000 });

  const nestedNav = msgPick.locator('button.study-flow-stage-card');
  if (await nestedNav.count() !== 3) {
    throw new Error(`Expected 3 nested message-field cards, got ${await nestedNav.count()}`);
  }

  await nestedNav.filter({ hasText: 'arguments' }).first().click();
  await msgPick.getByText('Приклад login_spec', { exact: true }).waitFor({ state: 'visible' });
  await msgPick.getByText('readPlaywrightReport').first().waitFor({ state: 'visible' });

  await page.setViewportSize({ width: 390, height: 800 });
  await root.waitFor({ state: 'visible' });

  await browser.close();
  console.log('guardrails-section4-transfer-check: ok');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
