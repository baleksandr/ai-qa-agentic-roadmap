import type { FundamentalsCardPanel } from './fundamentals-card-panels';
import { FUNDAMENTALS_DETERMINISM_COMPARE } from './fundamentals-determinism-compare';
import { FUNDAMENTALS_HALLUCINATION_CARDS } from './fundamentals-hallucination-cards';
import { FUNDAMENTALS_MODEL_API_CARDS } from './fundamentals-model-api-cards';
import { FUNDAMENTALS_MODEL_LANDSCAPE_CARDS } from './fundamentals-model-landscape-cards';
import { FUNDAMENTALS_REASONING_CARDS } from './fundamentals-reasoning-cards';
import { FUNDAMENTALS_COST_LATENCY_CARDS } from './fundamentals-cost-latency-cards';
import { FUNDAMENTALS_AGENT_STACK_CARDS } from './fundamentals-agent-stack-cards';
import { FUNDAMENTALS_STRUCTURED_OUTPUT_CARDS } from './fundamentals-structured-output-cards';
import type { StudyTeachingCardsBundle } from './study-teaching-card-types';

const LOGIN = 'Навчальний приклад після падіння login_spec.';

function card(
  key: string,
  titleUk: string,
  teaserUk: string,
  panel: FundamentalsCardPanel,
  actor?: string,
): StudyTeachingCardsBundle['steps'][0] {
  return {
    key,
    titleUk,
    teaserUk,
    cardActorUk: actor,
    fundamentalsPanel: panel,
    detail: {
      titleUk,
      bodyUk: '',
      qaUk: '',
      cardTeaserUk: teaserUk,
      cardActorUk: actor,
    },
  };
}

const WIDGET_BUNDLES: Record<string, StudyTeachingCardsBundle> = {
  'glossary-13-reasoning': FUNDAMENTALS_REASONING_CARDS,
  'glossary-14-hallucination': FUNDAMENTALS_HALLUCINATION_CARDS,
  'glossary-16-structured-output': FUNDAMENTALS_STRUCTURED_OUTPUT_CARDS,
  'glossary-17-model-api': FUNDAMENTALS_MODEL_API_CARDS,
  'glossary-05-training-inference': {    ariaLabel: 'Training і inference — два режими',
    leadUk: 'Під час роботи з IDE або агентом ви майже завжди на inference: ваги вже навчені.',
    steps: [
      card(
        'train',
        'Training',
        'Змінює параметри моделі.',
        {
          whatUk: 'Offline-процес на датасеті: оптимізація ваг, fine-tuning, оновлення версії моделі.',
          exampleUk: 'Fine-tune на внутрішніх шаблонах тікетів — це training, не зміна system prompt.',
          relationUk: 'Перед inference: після training з’являється нова model version для deploy.',
          inputOutputUk: 'Вхід: датасет + гіперпараметри. Вихід: checkpoint / нова версія.',
          qaUk: 'Gate релізу: eval на golden set після training job.',
        },
        'Offline job',
      ),
      card(
        'infer',
        'Inference',
        'Фіксовані ваги + ваш context.',
        {
          whatUk: 'Кожен запит до API: модель не «вчиться» з вашого промпту, лише генерує output.',
          exampleUk: `${LOGIN} Запит «напиши тест логіну» — inference з поточним model id.`,
          relationUk: 'Після training команда публікує model id; runtime лише inference.',
          failureUk: 'Плутанина: очікування, що один prompt «назавжди навчить» модель.',
          qaUk: 'Фіксуйте model id у trace; регресія при зміні alias провайдера.',
        },
        'LLM inference',
      ),
    ],
  },
  'glossary-09-context-parts': {
    ariaLabel: 'Що входить у context window',
    leadUk: 'Контекст — усе, що вміщено в один виклик; решта для моделі «не існує».',
    steps: [
      card('sys', 'System / developer', 'Правила й формат.', {
        whatUk: 'Стабільні інструкції: роль, політики, JSON schema, межі tools.',
        exampleUk: '«Не вигадуй шляхи до звітів» для investigation агента.',
        relationUk: 'Зазвичай перший шар context; дублюється на кожному кроці run.',
        qaUk: 'Перевірте, що секрети не потрапляють у system для всіх tenant.',
      }),
      card('hist', 'Історія діалогу', 'User / assistant / tool.', {
        whatUk: 'Попередні репліки та tool results, які клієнт знову надсилає в messages[].',
        exampleUk: 'Другий крок investigation бачить перший tool result у history.',
        relationUk: 'Разом із system займає ліміт токенів; росте з кожним кроком агента.',
        failureUk: 'Обрізання старих tool results — агент «забуває» read report.',
        qaUk: 'Тести з довгим synthetic run і перевіркою truncation policy.',
      }),
      card('rag', 'RAG / документи', 'Retrieved chunks.', {
        whatUk: 'Фрагменти wiki, postmortem, код — додає код пошуку, не сама модель.',
        exampleUk: 'Chunks про минулі login_spec інциденти в prompt.',
        relationUk: 'Між retrieval і user task; конкурує за токени з tool schemas.',
        qaUk: 'Citation ids у відповіді відповідають реальним chunks.',
      }),
      card('tools', 'Tool definitions + results', 'Схеми й спостереження.', {
        whatUk: 'JSON schemas tools і structured results після executor.',
        exampleUk: 'readPlaywrightReport повертає уривок trace у tool message.',
        relationUk: 'Після виклику tool результат стає частиною context для наступного inference.',
        inputOutputUk: 'Definitions — вхід API; results — вихід handler у messages.',
        qaUk: 'Розмір schemas у логах usage.prompt_tokens.',
      }),
      card('out', 'Місце під відповідь', 'Output tokens budget.', {
        whatUk: 'Частина window зарезервована під генерацію assistant; не безкінечна.',
        exampleUk: 'max_tokens обрізає JSON план посеред поля.',
        relationUk: 'Після input; finish_reason=length сигналізує обрізання.',
        failureUk: 'Lost in the middle: факти в середині довгого context гірше використовуються.',
        qaUk: 'Метрики task success vs довжина context у evals.',
      }),
    ],
  },
  'glossary-10-message-roles': {
    ariaLabel: 'Ролі messages у сучасному API',
    leadUk: 'Контракт prompt — хто що сказав і в якому форматі.',
    steps: [
      card('system', 'system / developer', 'Політики й формат.', {
        whatUk: 'Інструкції продукту: межі, tone, structured output, tool policy.',
        exampleUk: 'Developer message з JSON schema для плану investigation.',
        relationUk: 'Префікс context; змінюється рідше за user turns.',
        qaUk: 'Snapshot messages[] у тестах без PII.',
      }),
      card('user', 'user', 'Задача й дані.', {
        whatUk: 'Запит людини або тригер системи (тікет, падіння CI).',
        exampleUk: `${LOGIN} User message з id run і питанням «чому впав login_spec».`,
        relationUk: 'Після system; запускає перший inference або наступний крок loop.',
        qaUk: 'Чи не дублюються великі attachments у кожному user turn.',
      }),
      card('assistant', 'assistant', 'Відповіді моделі.', {
        whatUk: 'Текст або tool_calls, які модель уже згенерувала в цьому run.',
        exampleUk: 'Assistant пропонує tool_call readPlaywrightReport.',
        relationUk: 'Йде після user/tool; harness парсить tool_calls.',
        failureUk: 'Підміна assistant message в history — зламаний replay тестів.',
        qaUk: 'Перевірка цілісності history у integration tests.',
      }),
      card('tool', 'tool', 'Результати виконання.', {
        whatUk: 'Structured output handler після allow policy.',
        exampleUk: 'Фрагмент HTML звіту Playwright у tool message.',
        relationUk: 'Після assistant tool_call; вхід для наступного inference.',
        inputOutputUk: 'Вхід: payload executor. Вихід: tool message у messages[].',
        qaUk: 'Немає секретів з report у логах поза redaction policy.',
      }),
    ],
  },
  'glossary-12-sampling-params': {
    ariaLabel: 'Параметри генерації',
    leadUk: 'Керують варіативністю, не «істиною» відповіді.',
    steps: [
      card('temp', 'temperature', 'Випадковість вибору.', {
        whatUk: 'Вище — різноманітніше; 0 — майже завжди найімовірніший токен.',
        exampleUk: 'temperature=0 для стабільного regression summary.',
        relationUk: 'Після розподілу ймовірностей на кроці next-token.',
        failureUk: 'Flaky тести при temperature>0 без допустимого діапазону eval.',
        qaUk: 'Документуйте параметри в trace поруч із model id.',
      }),
      card('topp', 'top_p', 'Nucleus sampling.', {
        whatUk: 'Обрізає хвіст малоймовірних токенів перед вибором.',
        exampleUk: 'top_p=0.9 разом із низькою temperature для prod automation.',
        relationUk: 'Альтернатива/доповнення temperature на тому ж кроці.',
        qaUk: 'Порівняння поведінки при зміні лише top_p у eval harness.',
      }),
      card('max', 'max_tokens', 'Ліміт довжини.', {
        whatUk: 'Обмежує згенеровану відповідь; finish_reason=length при обрізанні.',
        exampleUk: 'План з 20 кроків обрізаний — JSON parser падає.',
        relationUk: 'Кінець циклу next-token; не розширює context window всього запиту.',
        qaUk: 'Assert повний schema; моніторинг finish_reason у metrics.',
      }),
      card('stop', 'stop sequences', 'Зупинка генерації.', {
        whatUk: 'Рядки-тригери, на яких API припиняє sampling.',
        exampleUk: 'Stop після закриття JSON об’єкта плану.',
        relationUk: 'Після кожного токена harness перевіряє stop match.',
        qaUk: 'Тести, що модель не дописує текст після валідного JSON.',
      }),
      card('seed', 'seed', 'Відтворюваність (обмежена).', {
        whatUk: 'Деякі провайдери дозволяють seed; не гарантує байт-в-байт на GPU.',
        exampleUk: 'Два CI run з seed — близькі, але не завжди ідентичні тексти.',
        relationUk: 'Параметр API разом із temperature.',
        failureUk: 'Тест, що вимагає exact string match на prod моделі.',
        qaUk: 'Eval на семантику/schema, не на повний текст.',
      }),
    ],
  },
  'glossary-15-determinism-compare': FUNDAMENTALS_DETERMINISM_COMPARE,
  'glossary-18-cost-factors': FUNDAMENTALS_COST_LATENCY_CARDS,
  'glossary-19-landscape': FUNDAMENTALS_MODEL_LANDSCAPE_CARDS,
  'glossary-20-agent-stack': FUNDAMENTALS_AGENT_STACK_CARDS,
};

export function getFundamentalsWidgetBundle(widgetId: string): StudyTeachingCardsBundle | null {
  return WIDGET_BUNDLES[widgetId] ?? null;
}
