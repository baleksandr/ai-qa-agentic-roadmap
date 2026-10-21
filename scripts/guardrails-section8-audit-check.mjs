/**
 * §8 Guardrails: «Можливість аудиту» — 6 вкладених QA-карток.
 *
 * npm run build && npm run preview -- --port 4173
 * node scripts/guardrails-section8-audit-check.mjs
 */
import { chromium } from 'playwright';

const BASE =
  process.env.PREVIEW_BASE ?? 'http://127.0.0.1:4173/ai-qa-agentic-roadmap/';
const URL = `${BASE}#/topic/concept-17/study`;

const NESTED_TITLES = [
  'Події належать правильному run',
  'Пропозиція не дорівнює виконанню',
  'Рішення policy має причину',
  'Погодження та виконання не плутаються',
  'Журнал не розкриває секрети',
  'Події зберігаються потрібний час',
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.getByRole('button', { name: 'Розгорнути всі' }).click();
  await page.waitForTimeout(300);

  const section = page.locator('.study-section').filter({ hasText: 'Security' });
  await section.scrollIntoViewIfNeeded();

  const auditCard = section
    .locator('button.study-interactive-card, button.study-flow-stage-card')
    .filter({ hasText: 'Можливість аудиту' })
    .first();
  await auditCard.click();
  await page.waitForTimeout(400);

  const mainPanel = section.locator('.study-step-detail-panel').first();
  const qaPick = mainPanel.locator('.study-learner-panel-step-pick').filter({
    hasText: 'Що перевіряє QA',
  });
  await qaPick.waitFor({ state: 'visible', timeout: 15000 });

  const navButtons = qaPick.locator('button.study-flow-stage-card');
  if (await navButtons.count() !== 6) {
    throw new Error(`Expected 6 nested audit QA cards, got ${await navButtons.count()}`);
  }

  for (const title of NESTED_TITLES) {
    await navButtons.filter({ hasText: title }).first().click();
    await page.waitForTimeout(200);
    const body = qaPick.locator('.study-learner-panel-step-pick-panel-body').last();
    await body.locator('.study-learner-panel-value-p').first().waitFor({
      state: 'attached',
      timeout: 8000,
    });
  }

  const bulletQa = mainPanel.getByText('Події пов’язані з правильним run_id', { exact: false });
  if (await bulletQa.count()) {
    throw new Error('Legacy QA bullet list still visible on audit card');
  }

  await browser.close();
  console.log('guardrails-section8-audit-check: ok');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
