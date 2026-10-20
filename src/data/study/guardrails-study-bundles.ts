import type { StudyTeachingCardsBundle } from './study-teaching-card-types';
import { fundamentalsConceptStep } from './fundamentals-teaching-step';
import {
  GUARDRAILS_DATA_TRANSFER_POLICY_PANEL,
  GUARDRAILS_DATA_TRANSFER_PROPOSED_PANEL,
  GUARDRAILS_DATA_TRANSFER_SANITIZED_PANEL,
} from './guardrails-data-transfer-panels';
import {
  GUARDRAILS_COMPONENT_APPROVAL_PANEL,
  GUARDRAILS_COMPONENT_BUDGETS_PANEL,
  GUARDRAILS_COMPONENT_LISTS_PANEL,
  GUARDRAILS_COMPONENT_MATRIX_PANEL,
  GUARDRAILS_COMPONENT_SANDBOX_PANEL,
  GUARDRAILS_COMPONENT_VALIDATORS_PANEL,
} from './guardrails-components-panels';
import {
  GUARDRAILS_FULL_EXAMPLE_ALLOW_PANEL,
  GUARDRAILS_FULL_EXAMPLE_APPROVAL_PANEL,
  GUARDRAILS_FULL_EXAMPLE_DENY_PANEL,
  GUARDRAILS_FULL_EXAMPLE_REGISTRY_PANEL,
} from './guardrails-full-example-panels';
import {
  GUARDRAILS_TOPIC_INTRO_COMPONENTS,
  GUARDRAILS_TOPIC_INTRO_DATA_TRANSFER,
  GUARDRAILS_TOPIC_INTRO_FULL_EXAMPLE,
  GUARDRAILS_LLM_CODE_PRINCIPLE_UK,
  GUARDRAILS_TOPIC_INTRO_LLM_CODE,
  GUARDRAILS_TOPIC_INTRO_SEQUENCE,
  GUARDRAILS_TOPIC_INTRO_WHY,
} from './guardrails-section-topic-intros';
import {
  GUARDRAILS_LLM_CODE_EXECUTOR_PANEL,
  GUARDRAILS_LLM_CODE_HUMAN_PANEL,
  GUARDRAILS_LLM_CODE_LLM_ROLE_PANEL,
  GUARDRAILS_LLM_CODE_OUTPUT_PANEL,
  GUARDRAILS_LLM_CODE_POLICY_PANEL,
  GUARDRAILS_LLM_CODE_SCHEMA_PANEL,
} from './guardrails-llm-code-panels';
import {
  GUARDRAILS_UNDER_HOOD_STEP_EXECUTOR_PANEL,
  GUARDRAILS_UNDER_HOOD_STEP_HUMAN_PANEL,
  GUARDRAILS_UNDER_HOOD_STEP_INPUT_PANEL,
  GUARDRAILS_UNDER_HOOD_STEP_MODEL_PANEL,
  GUARDRAILS_UNDER_HOOD_STEP_POLICY_PANEL,
  GUARDRAILS_UNDER_HOOD_STEP_SCHEMA_PANEL,
} from './guardrails-under-hood-sequence-panels';
import {
  GUARDRAILS_WHY_APPROVAL_PANEL,
  GUARDRAILS_WHY_POLICY_PANEL,
  GUARDRAILS_WHY_PROPOSAL_PANEL,
  GUARDRAILS_WHY_SCHEMA_PANEL,
} from './guardrails-why-panels';

const GUARDRAILS_PANEL_UI = {
  hidePanelMainCardLabel: true,
  hidePanelStepTitle: true,
} as const;

export const GUARDRAILS_WHY_INTRO_UK =
  'Після падіння login_spec агент може не лише аналізувати результат тесту, а й пропонувати дії: створити Jira issue, прочитати файл або викликати інший інструмент. Не кожна запропонована дія є дозволеною. Навіть якщо модель сформувала коректний виклик, застосунок повинен окремо перевірити, чи дозволена ця дія для конкретного користувача, ресурсу та середовища. Guardrails — це контроль перед виконанням, який не дозволяє самій моделі визначати межі власних повноважень.';

export const GUARDRAILS_FULL_EXAMPLE_INTRO_UK =
  'Один агент працює за спільними правилами доступу. Читання дозволених логів може бути дозволене, запис у production БД — заборонений, створення bug у Jira — доступне лише після підтвердження, а видалення issue — неможливе, якщо відповідного інструмента немає в реєстрі.\n\nРізні дії проходять різні перевірки. Безпека не працює за принципом “дозволити все” або “заборонити все”.';

export const GUARDRAILS_FULL_EXAMPLE_BUNDLE: StudyTeachingCardsBundle = {
  ariaLabel: 'Повний простий приклад guardrails',
  presentation: 'concepts',
  hideFlowOverview: true,
  ...GUARDRAILS_PANEL_UI,
  sectionTopicIntroUk: GUARDRAILS_TOPIC_INTRO_FULL_EXAMPLE,
  compactSectionIntroUk: GUARDRAILS_FULL_EXAMPLE_INTRO_UK,
  steps: [
    fundamentalsConceptStep(
      'gr-ex-allow',
      'Дозволено (ALLOW)',
      'Read-only доступ до дозволених шляхів у sandbox',
      GUARDRAILS_FULL_EXAMPLE_ALLOW_PANEL,
      'ALLOW',
      'Читання production-логів',
    ),
    fundamentalsConceptStep(
      'gr-ex-deny',
      'Заборонено (DENY)',
      'Політика відхиляє запис у бойову базу',
      GUARDRAILS_FULL_EXAMPLE_DENY_PANEL,
      'DENY',
      'Запис у production БД',
    ),
    fundamentalsConceptStep(
      'gr-ex-approval',
      'Потрібне підтвердження (NEEDS_APPROVAL)',
      'Перед створенням issue потрібно погодження людини',
      GUARDRAILS_FULL_EXAMPLE_APPROVAL_PANEL,
      'NEEDS_APPROVAL',
      'Створення bug у Jira',
    ),
    fundamentalsConceptStep(
      'gr-ex-registry',
      'Інструмента немає в реєстрі',
      'Агент не може викликати незареєстрований інструмент',
      GUARDRAILS_FULL_EXAMPLE_REGISTRY_PANEL,
      undefined,
      'Видалення issue у Jira',
    ),
  ],
};

export const GUARDRAILS_DATA_TRANSFER_BUNDLE: StudyTeachingCardsBundle = {
  ariaLabel: 'Послідовність етапів і передача даних',
  presentation: 'concepts',
  hideFlowOverview: true,
  hidePanelMainCardLabel: true,
  hidePanelStepTitle: false,
  sectionTopicIntroUk: GUARDRAILS_TOPIC_INTRO_DATA_TRANSFER,
  steps: [
    fundamentalsConceptStep(
      'gr-dt-proposed',
      'Пропонована дія та аргументи',
      'Модель формує виклик інструмента, але дія ще не виконана',
      GUARDRAILS_DATA_TRANSFER_PROPOSED_PANEL,
      'Proposed action',
    ),
    fundamentalsConceptStep(
      'gr-dt-policy',
      'Рішення policy engine',
      'Код визначає, чи дозволено дію, чи її потрібно відхилити або погодити',
      GUARDRAILS_DATA_TRANSFER_POLICY_PANEL,
      'Policy decision',
    ),
    fundamentalsConceptStep(
      'gr-dt-sanitized',
      'Перевірений результат',
      'Результат дозволеної дії проходить перевірки перед передаванням моделі',
      GUARDRAILS_DATA_TRANSFER_SANITIZED_PANEL,
      'Verified result',
    ),
  ],
};

export const GUARDRAILS_LLM_CODE_BUNDLE: StudyTeachingCardsBundle = {
  ariaLabel: 'Де код, а де LLM у guardrails',
  presentation: 'process',
  hideFlowOverview: true,
  ...GUARDRAILS_PANEL_UI,
  sectionTopicIntroUk: GUARDRAILS_TOPIC_INTRO_LLM_CODE,
  compactSectionIntroLabelUk: 'Головний принцип',
  compactSectionIntroUk: GUARDRAILS_LLM_CODE_PRINCIPLE_UK,
  sectionCardsInteractionHintUk:
    'Оберіть картку ліворуч, щоб побачити пояснення. На телефоні панель з’явиться під картками.',
  steps: [
    fundamentalsConceptStep(
      'gr-llm-role',
      'Роль LLM',
      'Пропонує інструмент і формує аргументи, але не визначає власні права доступу',
      GUARDRAILS_LLM_CODE_LLM_ROLE_PANEL,
      undefined,
      'LLM',
    ),
    fundamentalsConceptStep(
      'gr-llm-schema',
      'Schema validation',
      'Код перевіряє обов’язкові поля, типи даних і допустимі параметри',
      GUARDRAILS_LLM_CODE_SCHEMA_PANEL,
      undefined,
      'Код',
    ),
    fundamentalsConceptStep(
      'gr-llm-policy',
      'Policy engine',
      'Код визначає, чи дозволена дія для конкретного користувача, ресурсу та середовища',
      GUARDRAILS_LLM_CODE_POLICY_PANEL,
      undefined,
      'Код',
    ),
    fundamentalsConceptStep(
      'gr-llm-human',
      'Human approval',
      'Людина підтверджує дію, якщо цього вимагає політика',
      GUARDRAILS_LLM_CODE_HUMAN_PANEL,
      undefined,
      'Людина',
    ),
    fundamentalsConceptStep(
      'gr-llm-executor',
      'Executor',
      'Код виконує дію лише після проходження всіх необхідних перевірок',
      GUARDRAILS_LLM_CODE_EXECUTOR_PANEL,
      undefined,
      'Код',
    ),
    fundamentalsConceptStep(
      'gr-llm-output',
      'Перевірка результату',
      'Код перевіряє результат інструмента перед передаванням його моделі',
      GUARDRAILS_LLM_CODE_OUTPUT_PANEL,
      undefined,
      'Код',
    ),
  ],
  afterInteractiveSummary: {
    sectionTitleUk: 'Підсумок розділу',
    cards: [],
    footnoteUk:
      'LLM пропонує → код перевіряє → людина погоджує за потреби → executor виконує → код перевіряє результат.\n\nТочний порядок окремих технічних перевірок залежить від реалізації. Незмінний принцип полягає в тому, що пропозиція моделі не є дозволом на виконання, а заборонена дія не повинна створювати побічних ефектів.',
  },
};

export const GUARDRAILS_UNDER_HOOD_SEQUENCE_BUNDLE: StudyTeachingCardsBundle = {
  ariaLabel: 'Послідовність перевірок guardrails',
  presentation: 'process',
  hideFlowOverview: true,
  hidePanelMainCardLabel: true,
  hidePanelStepTitle: false,
  sectionTopicIntroUk: GUARDRAILS_TOPIC_INTRO_SEQUENCE,
  steps: [
    fundamentalsConceptStep(
      'gr-uh-input',
      'Input checks',
      'Код перевіряє вхідні дані перед передаванням моделі',
      GUARDRAILS_UNDER_HOOD_STEP_INPUT_PANEL,
      undefined,
      'Код',
    ),
    fundamentalsConceptStep(
      'gr-uh-model',
      'Model output',
      'LLM формує відповідь або пропонує виклик інструмента',
      GUARDRAILS_UNDER_HOOD_STEP_MODEL_PANEL,
      undefined,
      'LLM',
    ),
    fundamentalsConceptStep(
      'gr-uh-schema',
      'Schema validation',
      'Код перевіряє структуру та аргументи виклику',
      GUARDRAILS_UNDER_HOOD_STEP_SCHEMA_PANEL,
      undefined,
      'Код',
    ),
    fundamentalsConceptStep(
      'gr-uh-policy',
      'Policy engine',
      'Код визначає, чи дозволена дія для конкретного ресурсу',
      GUARDRAILS_UNDER_HOOD_STEP_POLICY_PANEL,
      undefined,
      'Код',
    ),
    fundamentalsConceptStep(
      'gr-uh-human',
      'Human gate',
      'Людина погоджує дію, якщо цього вимагає політика',
      GUARDRAILS_UNDER_HOOD_STEP_HUMAN_PANEL,
      undefined,
      'Людина + код',
    ),
    fundamentalsConceptStep(
      'gr-uh-executor',
      'Executor',
      'Код виконує дію після проходження обов’язкових перевірок',
      GUARDRAILS_UNDER_HOOD_STEP_EXECUTOR_PANEL,
      undefined,
      'Код',
    ),
  ],
  afterInteractiveSummary: {
    sectionTitleUk: 'Важливо пам’ятати',
    cards: [],
    footnoteUk:
      'Це логічна послідовність, а не вимога до єдиної реалізації. Конкретна система може виконувати додаткові перевірки або повторювати їх безпосередньо перед операцією. `DENY` зупиняє дію, `NEEDS_APPROVAL` очікує погодження, а `ALLOW` не скасовує інших обов’язкових перевірок.',
  },
};

export const GUARDRAILS_COMPONENTS_INTRO_UK =
  'Guardrails — це не одна перевірка і не лише системний промпт. Це набір механізмів, які перевіряють дані, контролюють доступ до інструментів, обмежують виконання та за потреби зупиняють workflow до погодження людини.';

export const GUARDRAILS_COMPONENTS_BUNDLE: StudyTeachingCardsBundle = {
  ariaLabel: 'Компоненти guardrails',
  presentation: 'concepts',
  hideFlowOverview: true,
  ...GUARDRAILS_PANEL_UI,
  sectionTopicIntroUk: GUARDRAILS_TOPIC_INTRO_COMPONENTS,
  steps: [
    fundamentalsConceptStep(
      'gr-comp-validators',
      'Input / output validators',
      'Перевіряють вхідні дані та результати',
      GUARDRAILS_COMPONENT_VALIDATORS_PANEL,
    ),
    fundamentalsConceptStep(
      'gr-comp-matrix',
      'Tool permission matrix',
      'Визначає, хто і які інструменти може викликати',
      GUARDRAILS_COMPONENT_MATRIX_PANEL,
    ),
    fundamentalsConceptStep(
      'gr-comp-sandbox',
      'Sandbox',
      'Обмежує середовище виконання та доступні ресурси',
      GUARDRAILS_COMPONENT_SANDBOX_PANEL,
    ),
    fundamentalsConceptStep(
      'gr-comp-lists',
      'Allow / deny lists',
      'Явно визначають дозволені та заборонені можливості',
      GUARDRAILS_COMPONENT_LISTS_PANEL,
    ),
    fundamentalsConceptStep(
      'gr-comp-budgets',
      'Budgets',
      'Обмежують витрати, кількість кроків і час роботи',
      GUARDRAILS_COMPONENT_BUDGETS_PANEL,
    ),
    fundamentalsConceptStep(
      'gr-comp-approval',
      'Approval UI',
      'Дозволяє людині підтвердити або відхилити ризикову дію',
      GUARDRAILS_COMPONENT_APPROVAL_PANEL,
    ),
  ],
};

export const GUARDRAILS_WHY_BUNDLE: StudyTeachingCardsBundle = {
  ariaLabel: 'Навіщо guardrails',
  presentation: 'concepts',
  hideFlowOverview: true,
  ...GUARDRAILS_PANEL_UI,
  sectionTopicIntroUk: GUARDRAILS_TOPIC_INTRO_WHY,
  steps: [
    fundamentalsConceptStep(
      'gr-why-proposal',
      'Пропозиція моделі ≠ дозвіл',
      'Модель пропонує дію, але не надає собі права її виконувати.',
      GUARDRAILS_WHY_PROPOSAL_PANEL,
    ),
    fundamentalsConceptStep(
      'gr-why-schema',
      'Schema — перевірка даних',
      'Перевіряємо структуру виклику, типи та параметри.',
      GUARDRAILS_WHY_SCHEMA_PANEL,
    ),
    fundamentalsConceptStep(
      'gr-why-policy',
      'Policy — правила доступу',
      'Визначаємо, чи дозволена дія в конкретному контексті.',
      GUARDRAILS_WHY_POLICY_PANEL,
    ),
    fundamentalsConceptStep(
      'gr-why-approval',
      'Approval та executor',
      'Перевіряємо погодження й умови перед виконанням.',
      GUARDRAILS_WHY_APPROVAL_PANEL,
    ),
  ],
};
