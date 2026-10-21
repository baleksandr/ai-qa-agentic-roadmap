import type { FundamentalsCardPanel } from './fundamentals-card-panels';
import {
  framed,
  guardrailsNestedPick,
  guardrailsPanel,
  guardrailsPolicyVerdictsIntroBody,
  terminology,
} from './guardrails-panel-helpers';
import {
  GR_QA_EXECUTOR_NESTED,
  GR_QA_HUMAN_NESTED,
  GR_QA_INPUT_NESTED,
  GR_QA_OUTPUT_NESTED,
  GR_QA_POLICY_NESTED,
  GR_QA_PROPOSAL_NESTED,
  GR_QA_SCHEMA_NESTED,
} from './guardrails-qa-nested-steps';

export const GUARDRAILS_UNDER_HOOD_STEP_INPUT_PANEL: FundamentalsCardPanel = guardrailsPanel([
  framed(
    'Що відбувається',
    'До виклику моделі застосунок перевіряє вхідні дані відповідно до вимог продукту. Це можуть бути перевірки формату, розміру, доступності джерела та обробка недовіреного вмісту.',
  ),
  framed(
    'Приклад login_spec',
    'Агент отримує повідомлення CI про timeout на `#login-btn`. Застосунок перевіряє, чи відповідає вхід очікуваному формату та чи не перевищує встановлені обмеження.',
  ),
  guardrailsNestedPick('Що перевіряє QA', 'Перевірки вхідних даних', GR_QA_INPUT_NESTED),
  terminology([{ termUk: 'Input validation', bodyUk: 'перевірка вхідних даних перед їх використанням.' }]),
]);

export const GUARDRAILS_UNDER_HOOD_STEP_MODEL_PANEL: FundamentalsCardPanel = guardrailsPanel([
  framed(
    'Що відбувається',
    'LLM обробляє запит і повертає відповідь або структуровану пропозицію виклику інструмента. Пропозиція може містити назву інструмента та аргументи, але ще не означає фактичного виконання.',
  ),
  framed(
    'Приклад login_spec',
    'Модель пропонує `readPlaywrightReport` для аналізу timeout на `#login-btn`. До перевірки параметрів і policy файл не відкривається.',
  ),
  guardrailsNestedPick('Що перевіряє QA', 'Перевірки пропозиції інструмента', GR_QA_PROPOSAL_NESTED),
  terminology([
    {
      termUk: 'LLM output',
      bodyUk: 'відповідь моделі, яка може містити текст або структуровану пропозицію виклику інструмента.',
    },
  ]),
]);

export const GUARDRAILS_UNDER_HOOD_STEP_SCHEMA_PANEL: FundamentalsCardPanel = guardrailsPanel([
  framed(
    'Що відбувається',
    'Код перевіряє, чи відповідають назва інструмента та його аргументи очікуваній схемі. Перевіряються обов’язкові поля, типи даних і допустима структура параметрів.',
  ),
  framed(
    'Приклад login_spec',
    'Якщо `readPlaywrightReport` очікує рядок `path`, але модель передала об’єкт замість рядка, виклик відхиляється. Навіть валідний `path` ще потребує перевірки доступу.',
  ),
  guardrailsNestedPick('Що перевіряє QA', 'Перевірки schema validation', GR_QA_SCHEMA_NESTED),
  terminology([
    {
      termUk: 'Schema validation',
      bodyUk: 'перевірка структури, типів і параметрів виклику.',
    },
  ]),
]);

export const GUARDRAILS_UNDER_HOOD_STEP_POLICY_PANEL: FundamentalsCardPanel = guardrailsPanel([
  framed(
    'Що відбувається',
    'Код перевіряє, чи дозволено конкретну дію з конкретним ресурсом у поточному контексті. Рішення залежить від правил доступу, інструмента, ресурсу та прав суб’єкта.',
  ),
  framed(
    'Можливі рішення',
    guardrailsPolicyVerdictsIntroBody(
      'Policy engine повертає одне з трьох рішень відповідно до правил доступу.',
    ),
  ),
  framed(
    'Приклад login_spec',
    'Читання дозволеного звіту може отримати `ALLOW`, а читання файлу із секретами — `DENY`. Створення Jira issue може вимагати підтвердження.',
  ),
  guardrailsNestedPick('Що перевіряє QA', 'Перевірки policy engine', GR_QA_POLICY_NESTED),
  terminology([
    {
      termUk: 'Policy engine',
      bodyUk: 'компонент коду, який ухвалює рішення про доступ відповідно до правил.',
    },
  ]),
]);

export const GUARDRAILS_UNDER_HOOD_STEP_HUMAN_PANEL: FundamentalsCardPanel = guardrailsPanel([
  framed(
    'Що відбувається',
    'Якщо policy вимагає погодження, workflow зупиняється та очікує на рішення уповноваженої людини. До отримання належного підтвердження захищена дія не виконується.',
  ),
  framed(
    'Приклад login_spec',
    'Агент підготував заголовок та опис bug для Jira. Людина перевіряє запропонований вміст і підтверджує створення issue. Сама пропозиція моделі не є погодженням.',
  ),
  guardrailsNestedPick('Що перевіряє QA', 'Перевірки human approval', GR_QA_HUMAN_NESTED),
  terminology([
    {
      termUk: 'Human gate',
      bodyUk: 'контрольна точка, у якій для продовження потрібне підтвердження людини.',
    },
  ]),
]);

export const GUARDRAILS_UNDER_HOOD_STEP_EXECUTOR_PANEL: FundamentalsCardPanel = guardrailsPanel([
  framed(
    'Що відбувається',
    'Executor виконує допущений виклик інструмента. Перед виконанням система має переконатися, що пройдено всі необхідні перевірки та виконано умови погодження, якщо воно потрібне.\n\nПісля виконання результат може проходити перевірку, очищення та обмеження розміру перед передаванням у контекст наступного запиту моделі.',
  ),
  framed(
    'Приклад login_spec',
    'Після перевірки доступу executor читає дозволений Playwright-звіт. Отриманий результат передається наступному етапу лише після передбачених системою перевірок.',
  ),
  guardrailsNestedPick('Що перевіряє QA', 'Перевірки executor та результату', [
    ...GR_QA_EXECUTOR_NESTED,
    ...GR_QA_OUTPUT_NESTED,
  ]),
  terminology([
    {
      termUk: 'Executor',
      bodyUk: 'компонент, який фактично виконує дозволені виклики інструментів.',
    },
  ]),
]);
