import type { StudySectionAside } from './study-section-aside-types';

/** Контекст concept-10 — доповнення до уроку, без дубля центрального блоку. */
const BY_SECTION: Record<string, StudySectionAside> = {
  'Навіщо потрібен tool calling?': {
    focus: 'Один тест на розуміння: чи з’явилися **факти з диска**, чи лише гарний текст?',
    example: '`login_spec` упав — порада «відкрийте звіт» ≠ прочитаний HTML.',
    diagram: 'Таблиця «Твердження» в цьому розділі — чеклист межі LLM і коду.',
  },
  'Один виклик tool у run investigation': {
    focus: 'Три пакети в одному run: опис дозволених tools → пропозиція виклику → результат після handler.',
    example: 'Перший крок run — часто read звіту, не write в Jira.',
    tips: ['У trace: proposed call → allow/deny → розмір snippet у messages.'],
  },
  'З чого складається механізм?': {
    focus:
      'Схема зверху — **той самий** run, що в §2: від CI summary до другого turn LLM; список ліворуч розкладає ролі по кроках.',
    example: '`login_spec` → readPlaywrightReport: tool_call лише пропозиція, факти з’являються після handler.',
    diagram: 'Оберіть крок у списку — поруч з’явиться пояснення ролі та перевірки QA.',
  },
  'Де код, а де LLM?': {
    focus: 'Шість кроків одного read — модель пропонує, код перевіряє й читає.',
    example: 'Після кроку 5 у context з’являється snippet звіту — лише тоді LLM може посилатися на факти.',
    tips: ['Таблиця LLM / код / людина внизу розділу закріплює межі.'],
  },
  'Де може зламатися?': {
    focus: 'Кожен збій — окремий навчальний сценарій: що сталося, сигнал у trace, що робить harness.',
    example: 'Read (`login_spec`) і write (`createJiraIssue`) — різні ризики й тести.',
    tips: ['У trace шукайте unknown_tool або deny, а не лише формулювання відповіді LLM.'],
  },
  'Як QA це тестує?': {
    focus: 'Кожна категорія — не назва, а план: підготовка → дія → assert → доказ у trace.',
    example: 'Спочатку handler з фікстурою файлу, потім harness з фейковим tool_call.',
    tips: ['Два GWT внизу розділу — шаблони; у repo курсу немає live harness tests.'],
  },
  'Production і observability': {
    focus: 'Trace має пояснювати **рішення** (allow/deny), не лише красиву відповідь чату.',
    example: 'Після зміни tool schema — регресія на backward compatibility.',
    jsonCard: {
      label: 'Приклад полів trace (навчальний)',
      json: `{
  "toolName": "readPlaywrightReport",
  "decision": "allow",
  "durationMs": 42,
  "resultBytes": 8192
}`,
      note: 'Умовний формат для навчання, не контракт вашого продакшену.',
    },
  },
  'Запам’ятати та співбесіда': {
    focus: 'Спочатку чотири тези в таблиці, потім десять питань «Перевір себе».',
    example: 'Питання про createJiraIssue: approval і захист від дубля тікета.',
    tips: ['Позначки «Можу пояснити» зберігаються лише в цьому браузері.'],
  },
};

export function getToolCallingSectionAside(navTitle: string): StudySectionAside {
  const hit = Object.entries(BY_SECTION).find(
    ([key]) => navTitle.startsWith(key) || key.startsWith(navTitle),
  );
  if (hit) return hit[1];
  return {
    focus: 'Коротка підказка до обраного розділу; повний зміст — у розгорнутому блоці уроку.',
    example: 'Навчальний сценарій: `login_spec`, `readPlaywrightReport`.',
  };
}

export const TOOL_CALLING_ASIDE_META = {
  sectionCount: 8,
  tocHint: '',
  schemaTitle: 'Схема курсу',
  schemaBlurb: 'Інтерактивний ланцюг з поясненнями на кожному кроці:',
  atlasTo: '/agent-architecture?tab=tool-calling',
  atlasLinkLabel: 'Відкрити схему Tool Calling',
} as const;
