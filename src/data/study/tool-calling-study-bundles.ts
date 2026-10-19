import { fundamentalsConceptStep } from './fundamentals-teaching-step';
import type { StudyTeachingCardsBundle } from './study-teaching-card-types';
import {
  TOOL_CALLING_WHY_TEXT_VS_ACTION,
  TOOL_CALLING_WHY_TOOL_CALL,
  TOOL_CALLING_WHY_TOOL_SCHEMA,
  TOOL_CALLING_WHY_VS_RAG,
} from './tool-calling-why-panels';
import {
  TOOL_CALLING_FLOW_STEP_1,
  TOOL_CALLING_FLOW_STEP_2,
  TOOL_CALLING_FLOW_STEP_3,
  TOOL_CALLING_FLOW_STEP_4,
  TOOL_CALLING_FLOW_STEP_5,
  TOOL_CALLING_FLOW_STEP_6,
} from './tool-calling-one-flow-panels';
import {
  TOOL_CALLING_DATA_PROPOSAL,
  TOOL_CALLING_DATA_RESULT,
  TOOL_CALLING_DATA_SCHEMA,
} from './tool-calling-data-panels';
import {
  TOOL_CALLING_QA_CAT_DUPLICATE,
  TOOL_CALLING_QA_CAT_PERMISSION,
  TOOL_CALLING_QA_CAT_SANDBOX,
  TOOL_CALLING_QA_CAT_SCHEMA,
  TOOL_CALLING_QA_CAT_TRACE,
  TOOL_CALLING_QA_CAT_TRUNCATION,
  TOOL_CALLING_QA_GWT_BAD_PATH,
  TOOL_CALLING_QA_GWT_JIRA,
} from './tool-calling-qa-panels';
import {
  TOOL_CALLING_FAIL_DUPLICATE_WRITE,
  TOOL_CALLING_FAIL_HUGE_RESULT,
  TOOL_CALLING_FAIL_INVALID_ARGS,
  TOOL_CALLING_FAIL_PERMISSION,
  TOOL_CALLING_FAIL_TIMEOUT,
  TOOL_CALLING_FAIL_UNKNOWN_TOOL,
  TOOL_CALLING_FAIL_WRONG_TOOL,
} from './tool-calling-failure-panels';
import {
  TOOL_CALLING_LLM_CODE_STEP_1,
  TOOL_CALLING_LLM_CODE_STEP_2,
  TOOL_CALLING_LLM_CODE_STEP_3,
  TOOL_CALLING_LLM_CODE_STEP_4,
  TOOL_CALLING_LLM_CODE_STEP_5,
  TOOL_CALLING_LLM_CODE_STEP_6,
  TOOL_CALLING_LLM_RISK_JIRA,
  TOOL_CALLING_LLM_RISK_PATH,
  TOOL_CALLING_LLM_ROLE_CODE,
  TOOL_CALLING_LLM_ROLE_HUMAN,
  TOOL_CALLING_LLM_ROLE_MODEL,
} from './tool-calling-llm-code-panels';
import {
  TOOL_CALLING_PROD_MAX_STEPS,
  TOOL_CALLING_PROD_RATE_LIMIT,
  TOOL_CALLING_PROD_TRACE,
  TOOL_CALLING_PROD_VERSIONING,
} from './tool-calling-production-panels';

export const TOOL_CALLING_WHY_BUNDLE: StudyTeachingCardsBundle = {
  ariaLabel: 'Чотири поняття tool calling',
  presentation: 'concepts',
  steps: [
    fundamentalsConceptStep(
      'tc-why-text-action',
      'Текст і дія',
      'Текст моделі ще не відкрив файл',
      TOOL_CALLING_WHY_TEXT_VS_ACTION,
    ),
    fundamentalsConceptStep(
      'tc-why-schema',
      'Опис інструмента',
      'Що код повідомляє моделі про доступні інструменти',
      TOOL_CALLING_WHY_TOOL_SCHEMA,
    ),
    fundamentalsConceptStep(
      'tc-why-call',
      'Пропозиція tool call',
      'Структурована пропозиція без виконання',
      TOOL_CALLING_WHY_TOOL_CALL,
    ),
    fundamentalsConceptStep(
      'tc-why-rag',
      'Tool Calling і RAG',
      'Дія під час run і фрагменти в контексті',
      TOOL_CALLING_WHY_VS_RAG,
    ),
  ],
};

export const TOOL_CALLING_ONE_FLOW_SITUATION_UK =
  'CI повідомив, що login_spec зупинився під час пошуку #login-btn. Звіт Playwright ще не читали. Нижче показано один можливий шлях: модель пропонує прочитати звіт, код перевіряє цю пропозицію, а інструмент повертає дані або помилку.';

export const TOOL_CALLING_DATA_TRANSFER_INTRO_UK =
  'У §2 ми простежили, хто виконує кожну дію. Тепер подивимося, що саме передається між частинами системи: спочатку опис інструмента, потім пропозиція моделі його викликати, а після виконання — результат або помилка. Це три різні повідомлення, які з’являються в різний час.';

export const TOOL_CALLING_DATA_TRANSFER_BUNDLE: StudyTeachingCardsBundle = {
  ariaLabel: 'Три види даних під час tool calling',
  presentation: 'concepts',
  steps: [
    fundamentalsConceptStep(
      'tc-data-schema',
      'Опис інструмента',
      'Що застосунок повідомляє моделі про доступну дію',
      TOOL_CALLING_DATA_SCHEMA,
    ),
    fundamentalsConceptStep(
      'tc-data-proposal',
      'Пропозиція виклику',
      'Що модель повертає коду, коли хоче використати інструмент',
      TOOL_CALLING_DATA_PROPOSAL,
    ),
    fundamentalsConceptStep(
      'tc-data-result',
      'Результат інструмента',
      'Що повертає код після фактичної спроби виконання',
      TOOL_CALLING_DATA_RESULT,
    ),
  ],
};

export const TOOL_CALLING_FAILURE_INTRO_UK =
  'Після падіння login_spec модель може запропонувати прочитати звіт. На цьому шляху помилка можлива ще до читання, під час роботи інструмента або після отримання результату. Окремо розберемо ризик повторної дії із записом у Jira. Натисніть збій, щоб побачити конкретну ситуацію, реакцію коду й перевірку QA.';

export const TOOL_CALLING_FAILURE_BUNDLE: StudyTeachingCardsBundle = {
  ariaLabel: 'Сім збоїв tool calling',
  presentation: 'concepts',
  sectionCardsInteractionHintUk:
    'Натисніть картку збою, щоб прочитати пояснення поруч. На телефоні воно з’явиться під картками.',
  steps: [
    fundamentalsConceptStep(
      'tc-fail-hallucinated-tool',
      'Невідомий інструмент',
      'Модель назвала дію, якої немає в застосунку',
      TOOL_CALLING_FAIL_UNKNOWN_TOOL,
    ),
    fundamentalsConceptStep(
      'tc-fail-invalid-args',
      'Неправильні аргументи',
      'Форма даних або шлях до звіту не пройшли перевірку',
      TOOL_CALLING_FAIL_INVALID_ARGS,
    ),
    fundamentalsConceptStep(
      'tc-fail-wrong-tool',
      'Недоречний інструмент',
      'Інструмент дозволений, але не допомагає цій задачі',
      TOOL_CALLING_FAIL_WRONG_TOOL,
    ),
    fundamentalsConceptStep(
      'tc-fail-duplicate-write',
      'Повторна дія із записом',
      'Повтор може створити другий тікет Jira',
      TOOL_CALLING_FAIL_DUPLICATE_WRITE,
    ),
    fundamentalsConceptStep(
      'tc-fail-huge-result',
      'Завеликий результат',
      'Повний звіт не вміщується в запит до моделі',
      TOOL_CALLING_FAIL_HUGE_RESULT,
    ),
    fundamentalsConceptStep(
      'tc-fail-timeout',
      'Інструмент не відповів',
      'Час очікування минув або сервіс повернув помилку',
      TOOL_CALLING_FAIL_TIMEOUT,
    ),
    fundamentalsConceptStep(
      'tc-fail-permission',
      'Немає дозволу',
      'Дія відома, але для цієї цілі заборонена',
      TOOL_CALLING_FAIL_PERMISSION,
    ),
  ],
};

export const TOOL_CALLING_QA_INTRO_UK =
  'QA перевіряє три різні речі: чи працює сам інструмент, чи код безпечно обробляє пропозицію моделі та чи модель отримує фактичний результат. Для перевірки коду справжня модель не потрібна: їй можна підставити наперед відому пропозицію виклику.';

export const TOOL_CALLING_QA_GWT_NOTE_UK =
  'Це навчальні приклади перевірок, а не звіт про запущені тести цього сайту.';

export const TOOL_CALLING_QA_CATEGORIES_BUNDLE: StudyTeachingCardsBundle = {
  ariaLabel: 'Шість категорій перевірок tool calling',
  presentation: 'concepts',
  conceptsHeadingUk: 'Категорії перевірок',
  sectionCardsInteractionHintUk:
    'Натисніть категорію, щоб прочитати план перевірки поруч. На телефоні панель з’явиться під картками.',
  steps: [
    fundamentalsConceptStep(
      'tc-qa-schema',
      'Форма аргументів',
      'Некоректні дані не доходять до читання',
      TOOL_CALLING_QA_CAT_SCHEMA,
    ),
    fundamentalsConceptStep(
      'tc-qa-sandbox',
      'Шлях до файла',
      'За межі дозволеної теки не читають',
      TOOL_CALLING_QA_CAT_SANDBOX,
    ),
    fundamentalsConceptStep(
      'tc-qa-permission',
      'Дозвіл на дію',
      'Після відмови запису в Jira немає',
      TOOL_CALLING_QA_CAT_PERMISSION,
    ),
    fundamentalsConceptStep(
      'tc-qa-duplicate',
      'Повтор запису',
      'Повтор не створює другу задачу',
      TOOL_CALLING_QA_CAT_DUPLICATE,
    ),
    fundamentalsConceptStep(
      'tc-qa-truncation',
      'Великий звіт',
      'Модель отримує потрібний доказ або повідомлення про нестачу даних',
      TOOL_CALLING_QA_CAT_TRUNCATION,
    ),
    fundamentalsConceptStep(
      'tc-qa-trace',
      'Trace',
      'Видно пропозицію, рішення та фактичний результат',
      TOOL_CALLING_QA_CAT_TRACE,
    ),
  ],
};

export const TOOL_CALLING_QA_GWT_BUNDLE: StudyTeachingCardsBundle = {
  ariaLabel: 'Повні навчальні сценарії',
  presentation: 'concepts',
  conceptsHeadingUk: 'Повні сценарії',
  steps: [
    fundamentalsConceptStep(
      'tc-gwt-bad-path',
      'Заборонений шлях до файла',
      'Відмова до читання зовнішнього файла',
      TOOL_CALLING_QA_GWT_BAD_PATH,
    ),
    fundamentalsConceptStep(
      'tc-gwt-duplicate-jira',
      'Втрачена відповідь Jira',
      'Повтор без другого тікета',
      TOOL_CALLING_QA_GWT_JIRA,
    ),
  ],
};

export const TOOL_CALLING_LLM_CODE_FLOW_BUNDLE: StudyTeachingCardsBundle = {
  ariaLabel: 'Шість кроків readPlaywrightReport після login_spec',
  presentation: 'process',
  hideFlowOverview: true,
  sectionCardsInteractionHintUk: 'Оберіть крок, щоб побачити, хто діє і що передає далі.',
  steps: [
    fundamentalsConceptStep(
      'tc-llc-1',
      'Код готує запит',
      'Передає моделі факт збою й опис інструмента',
      TOOL_CALLING_LLM_CODE_STEP_1,
    ),
    fundamentalsConceptStep(
      'tc-llc-2',
      'Модель пропонує читання',
      'Пропонує readPlaywrightReport, файл ще не відкрито',
      TOOL_CALLING_LLM_CODE_STEP_2,
    ),
    fundamentalsConceptStep(
      'tc-llc-3',
      'Код перевіряє пропозицію',
      'Перевіряє інструмент, аргументи й доступ',
      TOOL_CALLING_LLM_CODE_STEP_3,
    ),
    fundamentalsConceptStep(
      'tc-llc-4',
      'Інструмент намагається прочитати звіт',
      'Перше справжнє звернення до файла',
      TOOL_CALLING_LLM_CODE_STEP_4,
    ),
    fundamentalsConceptStep(
      'tc-llc-5',
      'Код записує результат',
      'Зберігає дані або помилку для наступного кроку',
      TOOL_CALLING_LLM_CODE_STEP_5,
    ),
    fundamentalsConceptStep(
      'tc-llc-6',
      'Модель формує відповідь, якщо потрібен наступний виклик',
      'Будує текст лише з переданих фактів',
      TOOL_CALLING_LLM_CODE_STEP_6,
    ),
  ],
};

export const TOOL_CALLING_LLM_CODE_RISKS_BUNDLE: StudyTeachingCardsBundle = {
  hideSectionCardsInteractionHint: true,
  ariaLabel: 'Дві межі на практиці',
  presentation: 'concepts',
  conceptGroups: [
    {
      headingUk: 'Дві межі на практиці',
      stepKeys: ['tc-llc-risk-path', 'tc-llc-risk-jira'],
    },
  ],
  steps: [
    fundamentalsConceptStep(
      'tc-llc-risk-path',
      'Небезпечний шлях до файла',
      'Модель запропонувала файл поза дозволеною областю',
      TOOL_CALLING_LLM_RISK_PATH,
    ),
    fundamentalsConceptStep(
      'tc-llc-risk-jira',
      'Повторне створення задачі',
      'Повтор може створити другий Jira issue',
      TOOL_CALLING_LLM_RISK_JIRA,
    ),
  ],
};

export const TOOL_CALLING_LLM_CODE_ROLES_BUNDLE: StudyTeachingCardsBundle = {
  hideSectionCardsInteractionHint: true,
  ariaLabel: 'Ролі в прикладі login_spec',
  presentation: 'concepts',
  conceptsHeadingUk: 'Ролі',
  steps: [
    fundamentalsConceptStep(
      'tc-llc-role-model',
      'Модель — пропонує',
      'Пропонує інструмент, не відкриває файл',
      TOOL_CALLING_LLM_ROLE_MODEL,
    ),
    fundamentalsConceptStep(
      'tc-llc-role-code',
      'Код — перевіряє та виконує',
      'Готує, перевіряє, викликає інструмент',
      TOOL_CALLING_LLM_ROLE_CODE,
    ),
    fundamentalsConceptStep(
      'tc-llc-role-human',
      'Людина — вирішує там, де це потрібно',
      'Підтверджує ризикові дії за policy',
      TOOL_CALLING_LLM_ROLE_HUMAN,
    ),
  ],
};

export const TOOL_CALLING_ONE_FLOW_BUNDLE: StudyTeachingCardsBundle = {
  ariaLabel: 'Шість кроків одного виклику tool після login_spec',
  presentation: 'process',
  /** Дві фази — без дубля багатокрокової схеми над картками. */
  flowArrowLine: 'пропозиція моделі → результат інструмента',
  steps: [
    fundamentalsConceptStep(
      'tc-flow-1',
      'Код готує доступні інструменти',
      'Передає моделі задачу та опис інструментів',
      TOOL_CALLING_FLOW_STEP_1,
    ),
    fundamentalsConceptStep(
      'tc-flow-2',
      'Модель пропонує читання',
      'Повертає tool call, але файл ще не читає',
      TOOL_CALLING_FLOW_STEP_2,
    ),
    fundamentalsConceptStep(
      'tc-flow-3',
      'Код перевіряє пропозицію',
      'Перевіряє інструмент, аргументи й дозвіл',
      TOOL_CALLING_FLOW_STEP_3,
    ),
    fundamentalsConceptStep(
      'tc-flow-4',
      'Інструмент намагається прочитати звіт',
      'Після дозволу повертає дані або помилку',
      TOOL_CALLING_FLOW_STEP_4,
    ),
    fundamentalsConceptStep(
      'tc-flow-5',
      'Код записує результат',
      'Harness зберігає дані або помилку й вирішує, чи продовжувати run',
      TOOL_CALLING_FLOW_STEP_5,
    ),
    {
      ...fundamentalsConceptStep(
        'tc-flow-6',
        'Модель формує наступну відповідь',
        'Новий turn лише після того, як код додав результат інструмента',
        TOOL_CALLING_FLOW_STEP_6,
        undefined,
        'LLM',
      ),
      optionalRouteStep: true,
    },
  ],
};

export const TOOL_CALLING_PRODUCTION_BUNDLE: StudyTeachingCardsBundle = {
  ariaLabel: 'Production і observability для tool calling',
  presentation: 'concepts',
  introCalloutLabelUk: 'Як підтримувати інструменти після випуску',
  leadUk:
    'У production недостатньо знати, що модель запропонувала readPlaywrightReport. Потрібно бачити, чи код дозволив дію, чи інструмент справді виконався, яку помилку повернув і коли розслідування зупинилося. Окремо команда стежить за змінами контрактів і навантаженням на зовнішні сервіси.',
  steps: [
    fundamentalsConceptStep(
      'tc-prod-trace',
      'Trace: що справді відбулося',
      'Відрізнити пропозицію моделі від виконання інструмента',
      TOOL_CALLING_PROD_TRACE,
    ),
    fundamentalsConceptStep(
      'tc-prod-version',
      'Версії інструментів',
      'Зміна аргументів не повинна тихо ламати виклики',
      TOOL_CALLING_PROD_VERSIONING,
    ),
    fundamentalsConceptStep(
      'tc-prod-rate',
      'Ліміти зовнішнього сервісу',
      'Зовнішній API може тимчасово не приймати нові запити',
      TOOL_CALLING_PROD_RATE_LIMIT,
    ),
    fundamentalsConceptStep(
      'tc-prod-max-steps',
      'Межа кроків агента',
      'Цикл пропозицій не триває безкінечно',
      TOOL_CALLING_PROD_MAX_STEPS,
    ),
  ],
};
