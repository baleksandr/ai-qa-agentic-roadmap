/**
 * Браузер: «Увесь маршрут» Agent Harness + Study concept-04 §2/§4/§6/§7.
 * npm run preview -- --port 4173 && node scripts/harness-study-browser-check.mjs
 */
import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:4173/ai-qa-agentic-roadmap/';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE, { waitUntil: 'networkidle' });

  const harnessTopic = page.getByRole('button', { name: /Agent Harness|Оболонка|harness/i }).first();
  await harnessTopic.click();
  await page.getByRole('heading', { name: 'Навіщо ця тема' }).waitFor({ timeout: 12000 });
  await page.getByText('Початок запуску', { exact: false }).first().waitFor();

  await page.setViewportSize({ width: 1100, height: 900 });
  await page.goto(`${BASE}#/topic/concept-04/study`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: /Agent Harness|Harness/i }).first().waitFor({ timeout: 15000 });

  await page.getByRole('button', { name: 'Розгорнути всі' }).click();
  await page.waitForTimeout(400);
  const prodHeader = page.locator('button.study-section-header').filter({ hasText: 'Production і observability' });
  await prodHeader.scrollIntoViewIfNeeded();
  if ((await prodHeader.getAttribute('aria-expanded')) !== 'true') {
    await prodHeader.click();
  }
  const runFlow = page.locator('.study-harness-run-flow');
  await runFlow.scrollIntoViewIfNeeded();
  await runFlow.waitFor({ state: 'visible', timeout: 15000 });
  await runFlow.getByRole('button', { name: /Пропозиція моделі/i }).click();
  const detailPanel = runFlow.locator('.policy-flow-detail');
  await detailPanel.getByText('Що перевірити в trace', { exact: true }).waitFor({ state: 'visible' });
  const panelScroll = await detailPanel.evaluate((el) => ({
    sh: el.scrollHeight,
    ch: el.clientHeight,
    oy: getComputedStyle(el).overflowY,
  }));
  if (panelScroll.oy === 'auto' || panelScroll.oy === 'scroll') {
    if (panelScroll.sh > panelScroll.ch + 2) {
      throw new Error('policy-flow-detail still scrolls internally with overflow');
    }
  }

  const qaSectionHeader = page.locator('button.study-section-header').filter({ hasText: 'Як QA це тестує' });
  await qaSectionHeader.scrollIntoViewIfNeeded();
  if ((await qaSectionHeader.getAttribute('aria-expanded')) !== 'true') {
    await qaSectionHeader.click({ force: true });
  }
  const qaSection = page.locator('section.study-section', { has: page.locator('.study-harness-qa') });
  await qaSection.waitFor({ timeout: 10000 });
  await qaSection.locator('.study-harness-qa').scrollIntoViewIfNeeded();
  await qaSection.getByText('Чи правильно працює код агента', { exact: true }).waitFor({ state: 'attached' });
  await qaSection.getByText('Для цього перевіряють:', { exact: false }).waitFor({ state: 'attached' });
  const focusListItems = qaSection.locator('.study-after-interactive-summary-card-list-item');
  if ((await focusListItems.count()) !== 4) {
    throw new Error('§7 focus card: expected 4 list items');
  }
  await qaSection.getByRole('button', { name: /Прочитано правильний файл/i }).click();
  await qaSection.getByText('Як QA перевіряє читання файлу', { exact: false }).waitFor({ timeout: 8000, state: 'visible' });
  const nestedNav = qaSection.locator(
    '.study-learner-panel-step-pick-layout .study-rag-pipeline-steps-col > li',
  );
  await nestedNav.first().waitFor({ timeout: 8000 });
  const nestedCount = await nestedNav.count();
  if (nestedCount !== 3) {
    throw new Error(`§7 card 1: expected 3 nested QA cards, got ${nestedCount}`);
  }
  await page.screenshot({ path: 'docs/harness-study-section-07-qa.png', fullPage: false });

  await browser.close();
  console.log('harness-study-browser-check: ok');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
