/**
 * §1 Guardrails: картка «Пропозиція моделі ≠ дозвіл» — nested QA pick як у Schema.
 *
 * npm run build && npm run preview -- --port 4173
 * node scripts/guardrails-proposal-qa-cards-check.mjs
 */
import { chromium } from 'playwright';

const BASE =
  process.env.PREVIEW_BASE ?? 'http://127.0.0.1:4173/ai-qa-agentic-roadmap/';
const URL = `${BASE}#/topic/concept-17/study`;

const NESTED_TITLES = [
  'Запропонована дія',
  'Перевірка до виконання',
  'Відсутність побічних ефектів',
  'Журналювання рішення',
];

const PANEL_SECTIONS = ['Що перевіряємо', 'Приклад login_spec', 'Що перевіряє QA'];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });

  const proposalCard = page
    .locator('button.study-flow-stage-card, button.study-interactive-card')
    .filter({ hasText: 'Пропозиція моделі' })
    .first();
  await proposalCard.scrollIntoViewIfNeeded();
  await proposalCard.waitFor({ state: 'visible', timeout: 30000 });
  await proposalCard.click();
  await page.waitForTimeout(400);

  const mainPanel = page.locator('.study-teaching-cards-layout .study-step-detail-panel').first();
  await mainPanel.waitFor({ state: 'visible', timeout: 15000 });

  const qaPick = mainPanel.locator('.study-learner-panel-step-pick-layout').filter({
    hasText: 'Що перевіряє QA',
  });
  await qaPick.waitFor({ state: 'visible', timeout: 10000 });

  const navButtons = qaPick.locator('button.study-flow-stage-card');
  const navCount = await navButtons.count();
  if (navCount !== 4) {
    throw new Error(`Expected 4 nested QA nav cards, got ${navCount}`);
  }

  for (let i = 0; i < NESTED_TITLES.length; i++) {
    const btn = navButtons.filter({ hasText: NESTED_TITLES[i] }).first();
    await btn.click();
    await page.waitForTimeout(200);
    const panel = qaPick.locator('.study-step-detail-panel, .study-teaching-detail-panel').last();
    for (const label of PANEL_SECTIONS) {
      const sectionLabel = panel.getByText(label, { exact: true });
      await sectionLabel.waitFor({ state: 'visible', timeout: 5000 });
    }
  }

  await browser.close();
  console.log('guardrails-proposal-qa-cards-check: ok (nested pick, 4 cards, 3 sections each)');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
