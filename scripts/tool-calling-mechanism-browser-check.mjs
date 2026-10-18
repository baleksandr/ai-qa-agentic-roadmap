/**
 * Браузер: concept-10 Study §3 (дані) і §4 (вертикальна схема).
 * npm run preview -- --port 4173 && node scripts/tool-calling-mechanism-browser-check.mjs
 */
import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:4173/ai-qa-agentic-roadmap/';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${BASE}#/topic/concept-10/study`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: /Tool Calling/i }).first().waitFor({ timeout: 15000 });

  const sectionHeader = page.locator('.study-section-header').filter({
    hasText: 'Які дані передаються',
  });
  await sectionHeader.click();
  const section3 = page.locator('section.study-section.open', {
    has: page.locator('.study-tool-calling-data-transfer'),
  });
  await section3.waitFor({ timeout: 10000 });

  await section3.getByText('три різні повідомлення', { exact: false }).waitFor();
  if (await section3.getByText('Harness готує запит', { exact: false }).count()) {
    throw new Error('§3 must not show old five role cards');
  }
  const cards3 = section3.locator('.study-interactive-card');
  if ((await cards3.count()) !== 3) {
    throw new Error(`§3 expected 3 cards, got ${await cards3.count()}`);
  }
  await section3.getByRole('button', { name: /Опис інструмента/i }).click();
  await section3.getByText('Що відбувається насправді', { exact: true }).waitFor();
  await section3.getByRole('button', { name: /Результат інструмента/i }).click();
  await section3.getByText('Два можливі результати', { exact: true }).waitFor();

  const section4Header = page.locator('.study-section-header').filter({ hasText: 'Де код, а де LLM' });
  await section4Header.click();
  const section4 = page.locator('section.study-section.open', {
    has: page.locator('.study-tool-calling-llm-code'),
  });
  await section4.waitFor({ timeout: 10000 });
  if ((await section4.locator('.study-teaching-cards-flow-overview').count()) > 0) {
    throw new Error('§4 must not show flow overview above cards');
  }
  await section4.getByText('Оберіть крок, щоб побачити', { exact: false }).waitFor();

  const section5Header = page.locator('.study-section-header').filter({ hasText: 'Де може зламатися' });
  await section5Header.click();
  const section5 = page.locator('section.study-section.open', {
    has: page.locator('.study-tool-calling-failures'),
  });
  await section5.waitFor({ timeout: 10000 });
  if (await section5.getByText('Сім типових збоїв', { exact: false }).count()) {
    throw new Error('§5 must not duplicate intro lead');
  }
  if ((await section5.locator('.study-interactive-card').count()) !== 7) {
    throw new Error('§5 expected 7 failure cards');
  }
  await section5.getByRole('button', { name: /Невідомий інструмент/i }).click();
  await section5.getByText('Як QA відтворює', { exact: true }).waitFor();

  const aside = page.locator('.study-lesson-aside--compact');
  await aside.waitFor({ timeout: 5000 });

  const section6Header = page.locator('.study-section-header').filter({ hasText: 'Як QA це тестує' });
  await section6Header.click();
  await aside.getByText('Нотатка до розділу', { exact: true }).waitFor();
  await aside.getByText('Виберіть категорію в центральному блоці', { exact: false }).waitFor();
  if ((await aside.locator('.study-aside-context-card').count()) > 0) {
    throw new Error('§6 aside must not show nested context cards');
  }
  if ((await aside.getByText('Що має показати trace', { exact: false }).count()) > 0) {
    throw new Error('§6 aside must not repeat production trace copy');
  }
  const asideScroll = aside.locator('.study-lesson-aside-scroll');
  const scrollMetrics = await asideScroll.evaluate((el) => ({
    scrollH: el.scrollHeight,
    clientH: el.clientHeight,
    overflowY: getComputedStyle(el).overflowY,
  }));
  if (scrollMetrics.overflowY === 'auto' && scrollMetrics.scrollH > scrollMetrics.clientH + 8) {
    throw new Error('§6 aside note area should not use inner vertical scroll');
  }

  const section7Header = page.locator('.study-section-header').filter({ hasText: 'Production і observability' });
  await section7Header.click();
  const section7 = page.locator('section.study-section.open', {
    has: page.locator('.study-tool-calling-production'),
  });
  await section7.waitFor({ timeout: 10000 });
  await aside.getByText('За trace відрізняйте пропозицію моделі', { exact: false }).waitFor();
  if ((await aside.locator('.study-aside-json-pre').count()) > 0) {
    throw new Error('§7 aside must not show JSON');
  }
  if ((await section7.locator('.study-tc-production-trace-sample').count()) > 0) {
    throw new Error('§7 must not show JSON block outside inner panel');
  }
  await section7.getByRole('button', { name: /Trace: що справді відбулося/i }).click();
  await section7
    .locator('h5.study-learner-panel-step-pick-panel-title', { hasText: 'Пропозиція моделі' })
    .waitFor();
  await section7.getByText('Показати умовний запис trace', { exact: false }).waitFor();
  const asideBox = await aside.boundingBox();
  if (asideBox && asideBox.width > 220) {
    throw new Error(`§7 aside too wide: ${asideBox.width}px`);
  }

  const section8Header = page.locator('.study-section-header').filter({ hasText: 'Запам’ятати' });
  await section8Header.click();
  const section8 = page.locator('section.study-section.open', {
    has: page.locator('.study-tool-calling-remember'),
  });
  await section8.waitFor({ timeout: 10000 });
  if ((await section8.getByText('Перевір себе перед співбесідою', { exact: false }).count()) < 1) {
    throw new Error('§8 must show interview self-check');
  }
  if ((await section8.getByText('Модель пропонує', { exact: true }).count()) < 1) {
    throw new Error('§8 must show remember cards');
  }

  await browser.close();
  console.log('tool-calling-mechanism-browser-check: ok');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
