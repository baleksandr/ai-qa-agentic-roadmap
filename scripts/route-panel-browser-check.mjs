/**
 * Інтерактивні картки схеми «Агент: загальний цикл» (НЕ «Увесь маршрут» на карті).
 *
 * URL: http://127.0.0.1:4173/ai-qa-agentic-roadmap/#/agent-architecture?tab=agent
 *
 * Чому раніше падав пошук «Надсилає запит моделі»:
 * - getByRole('button', { name: /Надсилає запит моделі/ }) без попереднього фокусу на harness:
 *   мінікартки зв’язків у панелі ще не показані (вони лише для вузла harness).
 * - Навіть після фокусу accessible name кнопки — повний aria-label
 *   («…Надсилає запит моделі. Показати зв’язок на схемі»), а не лише titleUk.
 *
 * Запуск: npm run preview -- --port 4173 && node scripts/route-panel-browser-check.mjs
 */
import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:4173/ai-qa-agentic-roadmap/';
const AGENT_TAB_URL = `${BASE}#/agent-architecture?tab=agent`;

async function assertActionVisible(root, text) {
  const el = root.getByText(text, { exact: true }).first();
  await el.waitFor({ state: 'visible', timeout: 12000 });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1100, height: 820 } });
  await page.goto(AGENT_TAB_URL, { waitUntil: 'networkidle' });

  const harnessNode = page.locator('#arch-vnode-harness');
  await harnessNode.waitFor({ state: 'visible', timeout: 15000 });
  // Звичайний клік достатній: після wait visible legend не перекриває #arch-vnode-harness.
  await harnessNode.click();
  await page.waitForTimeout(400);

  const connBtn = page.locator('button.arch-node-conn-card').filter({
    hasText: 'Надсилає запит моделі',
  });
  await connBtn.waitFor({ state: 'visible', timeout: 10000 });
  await assertActionVisible(connBtn, 'Показати зв’язок →');
  await connBtn.click();
  await assertActionVisible(connBtn, 'Зв’язок показано ✓');

  await connBtn.focus();
  await page.keyboard.press('Tab');

  await assertActionVisible(harnessNode, 'Пояснення відкрито ✓');
  await browser.close();
  console.log('route-panel-browser-check: ok (agent tab, harness connection card)');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
