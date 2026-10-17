import { TC_LOGIN_FAILURE, TC_READ_REPORT } from './tool-calling-teaching-thread';
import { clarityProcessPanel } from '../../lib/studyClarityPanel';

export const TC_HARNESS_SCHEMAS_PANEL = clarityProcessPanel({
  problem: 'LLM не знає, які операції дозволені в цьому run — без явного списку tools вона вигадує «дії» текстом.',
  simpleIdea:
    '**Harness** передає в API історію діалогу (`messages`) і масив **tool schemas**: ім’я, опис, JSON Schema параметрів.',
  input: `${TC_LOGIN_FAILURE} У allow-list tools — наприклад ${TC_READ_REPORT.toolName}.`,
  who: 'Код harness (TypeScript). Не LLM.',
  action: 'Формує API request: messages + tools; застосовує max_steps і system policy.',
  output: 'Запит до generative endpoint з обмеженим allow-list.',
  nextRecipient: 'LLM — обирає tool або відповідає текстом.',
  why: 'Модель може пропонувати лише оголошені tools — не довільні API.',
  teachingExample: 'Regression agent: readPlaywrightReport, readTrace — не write в prod без approve.',
  risks: 'Занадто багато tools — поганий вибір; витік опису внутрішніх API в description.',
  qa: 'У trace на кожному кроці — та сама версія списку tools, що в запиті.',
});

export const TC_LLM_TOOL_CALL_PANEL = clarityProcessPanel({
  problem: 'Потрібно перетворити намір «подивись звіт» на структуру, яку парсить код.',
  simpleIdea:
    '**tool_call** — ім’я tool + JSON **arguments** у structured output моделі. Це пропозиція виклику, не виконання I/O.',
  input: 'Context: failure summary + попередні messages.',
  who: 'Generative LLM (ймовірнісно).',
  action: `Генерує наприклад ${TC_READ_REPORT.toolName} з args ${TC_READ_REPORT.argsExample}.`,
  output: 'Об’єкт tool_call у відповіді API.',
  nextRecipient: 'Harness parser → validation / policy.',
  why: 'Розділення міркування (LLM) і I/O (код).',
  teachingExample: 'Перший крок після login_spec часто — report, не Jira write.',
  risks: 'Hallucinated tool name; args з path поза sandbox.',
  qa: 'Golden: фіксований context → очікуваний перший tool (не біт-в-біт args).',
});

export const TC_VALIDATION_PANEL = clarityProcessPanel({
  problem: 'Навіть правильний tool може мати небезпечні або невалідні аргументи.',
  simpleIdea:
    '**Validation / policy** — код перевіряє JSON schema, allow-list tool, sandbox path, approve для writes.',
  input: 'tool_call від LLM.',
  who: 'Harness + policy engine. Не LLM.',
  action: 'Повертає allow, deny або needs_approval; deny не доходить до executor.',
  output: 'Рішення policy + причина в trace.',
  nextRecipient: 'Tool executor (якщо allow).',
  why: 'Never trust model arguments.',
  teachingExample: TC_READ_REPORT.sandboxNote,
  risks: 'Path traversal; обхід через інший tool.',
  qa: 'Негативні тести: invalid args, deny write, path ../',
});

export const TC_EXECUTOR_PANEL = clarityProcessPanel({
  problem: 'Потрібні реальні дані з report або API, не вигадані моделлю.',
  simpleIdea:
    '**Tool handler** — deterministic код (або MCP adapter) після allow: read file, HTTP, CLI.',
  input: 'Валідовані arguments.',
  who: 'Tool function / adapter. Не LLM.',
  action: 'Виконує I/O; ловить timeout; повертає structured result або error.',
  output: 'Raw data → нормалізований tool result.',
  nextRecipient: 'Harness → role=tool message.',
  why: 'Єдина точка реального I/O в цьому кроці.',
  teachingExample: 'HTML snippet з playwright-report у tool result.',
  risks: 'Timeout; секрети в логах result.',
  qa: 'Mock executor без LLM для contract tests.',
});

export const TC_RESULT_CONTEXT_PANEL = clarityProcessPanel({
  problem: 'LLM наступного turn не бачить файл напряму — лише те, що harness додав у messages.',
  simpleIdea:
    'Harness додає **tool result** (часто truncated) як message; цикл harness ↔ LLM може повторитись до max_steps.',
  input: 'Normalized tool result.',
  who: 'Harness merge. Не LLM.',
  action: 'Truncate/sanitize; додає tool result у messages; можливий наступний виклик LLM.',
  output: 'Оновлений context для наступного рішення.',
  nextRecipient: 'LLM — аналіз observation.',
  why: 'Модель «бачить» лише те, що дозволив harness.',
  teachingExample: 'Після report — модель може запропонувати readTrace або висновок.',
  risks: 'Цикл без max_steps; втрата ключового рядка після truncate.',
  qa: 'Перевірка: ключовий фрагмент report є в tool message у trace.',
});
