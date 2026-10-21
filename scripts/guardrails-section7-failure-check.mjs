/**
 * §7 Guardrails: композиція «Важливо» + картки збоїв і вкладені QA.
 *
 * npm run build && npm run preview -- --port 4185
 * PREVIEW_BASE=http://127.0.0.1:4185/ai-qa-agentic-roadmap/ node scripts/guardrails-section7-failure-check.mjs
 */
import { chromium } from 'playwright';

const BASE =
  process.env.PREVIEW_BASE ?? 'http://127.0.0.1:4173/ai-qa-agentic-roadmap/';
const URL = `${BASE}#/topic/concept-17/study`;

const MAIN_CARDS = [
  'Політика занадто м’яка',
  'Обхід Guardrails через непряму ін’єкцію',
  'Хибні спрацювання блокують роботу',
  'Різні правила для різних tools',
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });

  await page.getByRole('button', { name: 'Розгорнути всі' }).click();
  await page.waitForTimeout(300);

  const section = page.locator('.study-section').filter({ hasText: 'може впасти' });
  await section.scrollIntoViewIfNeeded();
  await section.waitFor({ state: 'visible', timeout: 30000 });

  const failureRoot = section.locator('.study-guardrails-failure-modes');
  await failureRoot.waitFor({ state: 'visible', timeout: 15000 });

  const asideBelow = failureRoot.locator(
    '.study-teaching-section-aside-note--below-topic',
  );
  await asideBelow.waitFor({ state: 'visible', timeout: 10000 });
  const asideBox = await asideBelow.boundingBox();
  const floatingAside = failureRoot.locator('.study-teaching-intro-mini-grid--aside-only');
  if (await floatingAside.count()) {
    throw new Error('Floating intro-grid aside still present for §7');
  }
  const topicIntro = failureRoot.locator('.study-teaching-section-topic-intro').first();
  const topicBox = await topicIntro.boundingBox();
  if (asideBox && topicBox && asideBox.y < topicBox.y) {
    throw new Error('Aside note appears above topic intro');
  }

  const mainNav = failureRoot.locator('.study-teaching-cards-layout, .study-step-detail-layout').first();
  const mainPanel = mainNav.locator('.study-step-detail-panel').first();

  for (const title of MAIN_CARDS) {
    const card = mainNav
      .locator('button.study-flow-stage-card, button.study-interactive-card')
      .filter({ hasText: title })
      .first();
    await card.scrollIntoViewIfNeeded();
    await card.click();
    await page.waitForTimeout(300);
    await mainPanel.waitFor({ state: 'visible', timeout: 10000 });
  }

  // Card 1: nested negative prod write
  let card = mainNav
    .locator('button.study-interactive-card, button.study-flow-stage-card')
    .filter({ hasText: MAIN_CARDS[0] })
    .first();
  await card.click();
  await page.waitForTimeout(200);
  const nestedPerm = mainPanel.locator('.study-learner-panel-step-pick').filter({
    hasText: 'Що перевіряє QA',
  });
  await nestedPerm.locator('button').filter({ hasText: 'Негативний тест: запис у production' }).click();
  await page.waitForTimeout(200);
  const permBody = nestedPerm.locator('.study-learner-panel-step-pick-panel-body').last();
  await permBody
    .getByText('Підготовлено тестовий сценарій', { exact: false })
    .waitFor({ state: 'attached', timeout: 8000 });
  await permBody
    .getByText('production-ресурси захищені', { exact: false })
    .waitFor({ state: 'attached', timeout: 5000 });

  // Card 3: two nested QA tests (not both full text at once)
  card = mainNav.locator('button').filter({ hasText: MAIN_CARDS[2] }).first();
  await card.click();
  await page.waitForTimeout(200);
  const nestedFp = mainPanel.locator('.study-learner-panel-step-pick').filter({
    hasText: 'Тестові сценарії',
  });
  await nestedFp.waitFor({ state: 'visible', timeout: 10000 });
  await nestedFp.locator('button').filter({ hasText: 'Позитивний тест: дозволене читання' }).click();
  await page.waitForTimeout(200);
  const fpBody = nestedFp.locator('.study-learner-panel-step-pick-panel-body').last();
  await fpBody.getByText('readPlaywrightReport', { exact: false }).waitFor({ state: 'attached' });
  await nestedFp.locator('button').filter({ hasText: 'Негативний тест: заборонена дія' }).click();
  await page.waitForTimeout(200);
  await fpBody.getByText('записом у production', { exact: false }).waitFor({ state: 'attached' });

  card = mainNav.locator('button').filter({ hasText: 'Різні правила для різних tools' }).first();
  await card.click();
  await page.waitForTimeout(200);
  const nestedInc = mainPanel.locator('.study-learner-panel-step-pick').filter({
    hasText: 'Однакові умови тесту',
  });
  await nestedInc.waitFor({ state: 'visible', timeout: 10000 });
  const incNav = nestedInc.locator('button.study-flow-stage-card');
  if (await incNav.count() !== 5) {
    throw new Error(`Expected 5 inconsistent-policy nested cards, got ${await incNav.count()}`);
  }
  await incNav.filter({ hasText: 'Trace підтверджує результат' }).click();
  await page.waitForTimeout(200);
  await nestedInc
    .locator('.study-learner-panel-step-pick-panel-body')
    .last()
    .getByText('Пропозиція моделі', { exact: false })
    .waitFor({ state: 'attached' });

  await browser.close();
  console.log('guardrails-section7-failure-check: ok');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
