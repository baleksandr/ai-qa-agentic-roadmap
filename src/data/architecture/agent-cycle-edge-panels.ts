import { getSimNode } from '../../lib/archSimGeometry';
import {
  AGENT_STATE_READ_ID,
  AGENT_STATE_WRITE_ID,
} from '../../lib/agentCycleEdgeVisibility';
import type { ArchitectureSchema, SimStepPanel } from '../../types/architecture-simulation';

export type AgentEdgeBranch = 'spine' | 'data' | 'allow' | 'deny' | 'loop' | 'finish' | 'fail';

export type AgentEdgeMeta = {
  calloutUk: string;
  branch: AgentEdgeBranch;
  panel: SimStepPanel;
};

const AGENT_EDGE_META: Record<string, AgentEdgeMeta> = {
  'e-human-harness': {
    calloutUk: 'CI / людина → подія падіння та шляхи → Harness',
    branch: 'spine',
    panel: {
      what: 'Старт run: harness отримує назву тесту, текст помилки й шляхи до report/trace/logs.',
      who: 'CI або QA передає параметри, harness лише приймає.',
      input: 'Метадані login_spec і каталог артефактів.',
      output: 'Подія старту в harness.',
      recipient: 'Harness готує перший context.',
      why: 'Без явного старту агент не знає, що розбирати.',
      risks: 'Неправильний шлях, відсутній звіт.',
      qaAgent: 'Після червоного CI — старт з playwright-report.',
    },
  },
  'e-harness-llm': {
    calloutUk: 'Harness → messages і tools → LLM',
    branch: 'spine',
    panel: {
      what: 'Перший або наступний виклик моделі з повним context.',
      who: 'Harness збирає запит, LLM лише відповідає.',
      input: 'messages[], tool schemas, state.',
      output: 'HTTP-запит до API моделі.',
      recipient: 'LLM provider.',
      why: 'Модель бачить лише переданий context.',
      risks: 'Занадто великий context, секрети в messages.',
    },
  },
  'e-llm-harness-call': {
    calloutUk: 'LLM → пропозиція tool call → Перевірка',
    branch: 'spine',
    panel: {
      what: 'Structured пропозиція інструмента (ім’я + args), ще без виконання.',
      who: 'LLM пропонує, перевірка в harness.',
      input: 'Context і tool definitions.',
      output: 'Proposed tool call.',
      recipient: 'Validation / policy.',
      why: 'Спочатку перевірка, потім I/O.',
      risks: 'Вигаданий path або tool name.',
      qaAgent: 'Часто readPlaywrightReport — лише пропозиція.',
    },
  },
  'e-validation-tools': {
    calloutUk: 'Перевірка → allow → Інструменти',
    branch: 'allow',
    panel: {
      what: 'Гілка дозволу: policy і sandbox пройдені, handler може читати файли.',
      who: 'Код перевірки, не LLM.',
      input: 'Tool call від моделі.',
      output: 'allow → запуск handler.',
      recipient: 'Інструмент застосунку.',
      why: 'Без allow немає читання report/trace.',
      risks: 'Path traversal, хибний deny.',
      qaAgent: 'Лише дозволена директорія звіту.',
    },
  },
  'e-validation-deny': {
    calloutUk: 'Перевірка → deny (policy) → Harness',
    branch: 'deny',
    panel: {
      what: 'Гілка заборони: tool не виконується, run зупиняється або повертає помилку в harness. Це не веде до Result.',
      who: 'Policy engine у harness.',
      input: 'Tool call, що не пройшов whitelist або path.',
      output: 'deny без executor span.',
      recipient: 'Harness і людина в trace.',
      why: 'Безпека важливіша за продовження циклу.',
      risks: 'Обхід через інший tool, неочікуваний deny.',
      qaAgent: 'У trace після deny не має бути виконання handler.',
    },
  },
  'e-tools-artifacts': {
    calloutUk: 'Інструмент → запит read → Артефакти',
    branch: 'data',
    panel: {
      what: 'Handler просить файл у sandbox (report, trace, logs). Артефакти — дані на диску, не виконавець.',
      who: 'Інструмент читає, артефакти лише зберігають файли CI.',
      input: 'Дозволений path.',
      output: 'Запит на читання.',
      recipient: 'Файлова система / артефакти Playwright.',
      why: 'Докази лежать поза моделлю.',
      risks: 'Відсутній файл, занадто великий HTML.',
    },
  },
  'e-artifacts-tools': {
    calloutUk: 'Артефакти → фрагмент файлу → Інструмент',
    branch: 'data',
    panel: {
      what: 'Уривок report або trace повертається в handler після читання.',
      who: 'Дані з диска, код інструмента формує message.',
      input: 'Вміст дозволеного файлу.',
      output: 'Snippet для context.',
      recipient: 'Harness додасть у messages.',
      why: 'Модель отримує доказ через tool result, не напряму з диска.',
      risks: 'PII у фрагменті, обрізання важливого рядка.',
    },
  },
  'e-tools-harness': {
    calloutUk: 'Інструмент → tool result (успіх) → Harness',
    branch: 'allow',
    panel: {
      what: 'Гілка успішного читання: результат tool потрапляє в harness для наступного виклику LLM.',
      who: 'Handler повернув message, harness зберігає.',
      input: 'Sanitized tool result.',
      output: 'Новий фрагмент у messages.',
      recipient: 'Наступний крок LLM у циклі.',
      why: 'Петля agentic run збирає докази перед висновком.',
      risks: 'Переповнення context великим HTML.',
      qaAgent: 'readReport реально виконує код, не модель.',
    },
  },
  'e-tool-fail': {
    calloutUk: 'Інструмент → помилка I/O або API → Harness',
    branch: 'fail',
    panel: {
      what: 'Гілка збою tool або API (з умов завершення run): виконання зупиняється з помилкою, без фінального Result для людини.',
      who: 'Handler або зовнішній API повертає fail, harness фіксує stop.',
      input: 'Помилка читання, timeout, 403.',
      output: 'Помилка run у trace.',
      recipient: 'On-call / QA, не картка Result.',
      why: 'Відрізнити збій інфраструктури від успішного розслідування.',
      risks: 'Приховати fail за загальним текстом моделі.',
      qaAgent: 'Перевірити stop reason і відсутність executor після deny/fail.',
    },
  },
  'e-llm-done': {
    calloutUk: 'LLM → відповідь без нового tool → Harness',
    branch: 'loop',
    panel: {
      what: 'Модель повертає текст або structured answer без нового tool call.',
      who: 'LLM + harness валідація schema.',
      input: 'Повний context після доказів.',
      output: 'Кандидат фінальної відповіді.',
      recipient: 'Harness і stop rules.',
      why: 'Завершити цикл, коли доказів достатньо.',
      risks: 'Висновок без посилань на report/trace.',
    },
  },
  'e-harness-state-write': {
    calloutUk: 'Застосунок → запис → Стан run',
    branch: 'data',
    panel: {
      what:
        'Після кроку login_spec код зберігає runId, номер кроку, текст помилки CI та вже отримані фрагменти звіту або інструментів.',
      who: 'Код застосунку пише в сховище стану, не модель.',
      input: 'Подія завершення кроку: що зробили й що повернула модель або інструмент.',
      output: 'Оновлений запис стану для цього runId.',
      recipient: 'Картка «Стан run» (дані на диску).',
      why: 'Щоб наступний крок продовжив той самий розслідувальний запуск, а не почав з нуля.',
      risks: 'Запис без runId або перезапис чужого run.',
      qaAgent: 'У trace після кожного кроку видно оновлення state з тим самим runId.',
    },
  },
  'e-state-harness-read': {
    calloutUk: 'Стан run → читання → Застосунок',
    branch: 'data',
    panel: {
      what:
        'Перед наступним викликом моделі для login_spec код зчитує збережений стан: які кроки вже пройдені й які фрагменти звіту вже в контексті.',
      who: 'Код застосунку читає дані; картка стану їх не виконує.',
      input: 'runId поточного розслідування.',
      output: 'Номер кроку, історія messages і результати попередніх інструментів.',
      recipient: 'Застосунок готує наступний запит до моделі.',
      why: 'Продовжити цикл після readPlaywrightReport без втрати вже зібраних доказів.',
      risks: 'Читання порожнього або застарілого стану після збою.',
      qaAgent: 'Після петлі harness→LLM у trace той самий runId і зростаючий номер кроку.',
    },
  },
  'e-harness-rag-query': {
    calloutUk: 'Harness → пошуковий запит → RAG',
    branch: 'data',
    panel: {
      what:
        'Harness надсилає пошуковий запит у базу документів (наприклад, postmortem про минулі падіння login_spec). Це ще не відповідь моделі.',
      who: 'Код retriever у harness; не LLM.',
      input: 'Текст задачі й метадані run.',
      output: 'Запит до індексу документів.',
      recipient: 'Блок пошуку документів (RAG).',
      why: 'Додати зовнішні знання, яких немає в артефактах цього запуску.',
      unknown: 'Які фрагменти повернуться і чи будуть релевантні.',
      qaAgent:
        'Минулий postmortem може підказати гіпотезу, але не доводить причину падіння цього конкретного run.',
      risks: 'Плутати знайдений документ із вмістом звіту цього run.',
    },
  },
  'e-rag-rag-enrich': {
    calloutUk: 'RAG → фрагменти з джерелами → збагачення запиту',
    branch: 'data',
    panel: {
      what:
        'Пошук повертає уривки з посиланнями на джерела. Код harness отримує їх і готує наступний запит до моделі.',
      who: 'Retriever повертає дані, harness збирає messages.',
      input: 'Результати пошуку (chunks + citation ids).',
      output: 'Підготовлений запит із доданими фрагментами.',
      recipient: 'Крок «додавання фрагментів» на основному маршруті.',
      why: 'Модель бачить корпоративні нотатки разом із даними CI.',
      unknown: 'Чи модель правильно використає citation і не переплутає з поточним звітом.',
      qaAgent: 'Перевірити, що citation не підміняє читання playwright-report цього run.',
      risks: 'Модель цитує postmortem, але не читає актуальний звіт.',
    },
  },
  'e-rag-enrich-llm': {
    calloutUk: 'Harness → запит із фрагментами → LLM',
    branch: 'spine',
    panel: {
      what: 'Після RAG harness надсилає моделі повний context із знайденими фрагментами та citation.',
      who: 'Harness формує HTTP-запит, LLM лише відповідає.',
      input: 'messages[] із фрагментами документів і метаданими run.',
      output: 'Запит до API моделі.',
      recipient: 'LLM provider.',
      why: 'Модель отримує зовнішні знання разом із описом падіння login_spec.',
      risks: 'Плутати знайдений документ із вмістом звіту цього run.',
      qaAgent: 'Перевірити наявність citation і читання report цього CI run.',
    },
  },
  'e-validation-mcp': {
    calloutUk: 'Перевірка → дозвіл → MCP',
    branch: 'allow',
    panel: {
      what:
        'Після дозволу harness звертається до інструмента через MCP-адаптер — це спосіб підключення, не окреме «джерело правди».',
      who: 'Harness після policy; MCP лише транспорт до tool server.',
      input: 'Дозволений tool call (ім’я + args).',
      output: 'Запит до MCP-сервісу.',
      recipient: 'MCP-адаптер на шляху до інструмента.',
      why: 'Показати протокол доступу, коли інструменти підключені через MCP.',
      unknown: 'Чи MCP-сервер доступний і що поверне виклик.',
      qaAgent: 'Дозвіл і sandbox як і для локального handler — MCP не замінює policy.',
      risks: 'Вважати MCP окремим «агентом» без harness.',
    },
  },
  'e-mcp-tools': {
    calloutUk: 'MCP → виклик інструмента → результат',
    branch: 'allow',
    panel: {
      what:
        'MCP-адаптер виконує readPlaywrightReport (або інший дозволений tool) і повертає результат або помилку harness.',
      who: 'Інструмент за MCP; harness отримує нормалізовану відповідь.',
      input: 'Валідовані аргументи після дозволу.',
      output: 'Tool result або помилка I/O.',
      recipient: 'Harness → за потреби наступний запит до моделі.',
      why: 'Відрізнити протокол підключення від самого читання звіту.',
      unknown: 'Вміст звіту до успішного читання.',
      qaAgent: 'У trace видно MCP span; при вимкненому MCP той самий handler викликається локально.',
      risks: 'Таймаут MCP-сервера без fallback на локальний handler.',
    },
  },
  'e-tools-tool-ingest': {
    calloutUk: 'Інструмент → фрагмент або помилка → Код приймає результат',
    branch: 'allow',
    panel: {
      what: 'Після readPlaywrightReport інструмент повертає уривок HTML або помилку I/O; код приймає це в поточний run.',
      who: 'Handler інструмента виконує читання; код на картці прийому зберігає результат.',
      input: 'Tool result або fail message.',
      output: 'Оновлені messages і запис стану run.',
      recipient: 'Наступний крок — запит до моделі з фактами.',
      why: 'Маршрут після інструмента обов’язково йде через код, а не напряму до результату.',
      risks: 'Пропустити крок прийому — модель не побачить факти звіту.',
      qaAgent: 'У trace tool span перед оновленням messages на цьому кроці.',
    },
  },
  'e-tool-ingest-llm-refine': {
    calloutUk: 'Код → факти звіту → Модель уточнює висновок',
    branch: 'spine',
    panel: {
      what: 'Код надсилає моделі лише те, що реально отримано з інструмента; модель уточнює висновок login_spec.',
      who: 'Код формує HTTP-запит; модель відповідає.',
      input: 'messages[] із фрагментом звіту.',
      output: 'Текст або structured відповідь.',
      recipient: 'Крок «Код готує результат».',
      why: 'Висновок спирається на прочитаний звіт, а не на вигаданий вміст.',
      risks: 'Запит без фрагмента після успішного readReport.',
      qaAgent: 'Перевірити наявність tool result у messages перед цим викликом.',
    },
  },
  'e-llm-refine-prepare': {
    calloutUk: 'Модель → уточнений текст → Код готує результат',
    branch: 'spine',
    panel: {
      what: 'Модель повернула кандидат висновку; код перевіряє докази й готує фінальний артефакт.',
      who: 'Модель — текст; код — валідація й stop rules.',
      input: 'Відповідь моделі та trace.',
      output: 'Дані для картки Result.',
      recipient: 'Код готує результат.',
      why: 'Людина отримує перевірений підсумок, а не сирий output моделі.',
      risks: 'Пропустити перевірку evidence.',
      qaAgent: 'Посилання на report у фінальному Result.',
    },
  },
  'e-prepare-result': {
    calloutUk: 'Код готує результат → Результат run',
    branch: 'finish',
    panel: {
      what: 'Фінальна картка для людини: summary, evidence links, stop reason. Джерело — код підготовки, не стан run.',
      who: 'Harness після валідації schema.',
      input: 'Перевірений висновок і метадані run.',
      output: 'summary, evidence, draft bug або помилка завершення.',
      recipient: 'QA-інженер.',
      why: 'Зрозуміло, хто підготував відповідь для людини.',
      risks: 'Висновок без доказів.',
      qaAgent: 'Стрілка на схемі йде від «Код готує результат», не від «Стан run».',
    },
  },
  'e-llm-direct-prepare': {
    calloutUk: 'Модель → достатня відповідь без інструмента → Код готує результат',
    branch: 'loop',
    panel: {
      what: 'Окрема гілка: модель одразу дала достатній текст без readReport — код іде до підготовки результату.',
      who: 'Модель + harness; не замінює основний приклад читання звіту.',
      input: 'Текстова відповідь без tool call.',
      output: 'Кандидат для prepare-result.',
      recipient: 'Код готує результат.',
      why: 'Показати альтернативу без інструмента.',
      risks: 'Висновок без доказів з CI.',
      qaAgent: 'У навчальному login_spec сценарії очікується читання звіту, не ця гілка.',
    },
  },
};

export function getAgentEdgeMeta(edgeId: string): AgentEdgeMeta | undefined {
  return AGENT_EDGE_META[edgeId];
}

export type AgentTransitionPanelView = {
  titleUk: string;
  leadUk?: string;
  fromUk: string;
  payloadUk: string;
  toUk: string;
  purposeUk: string;
  /** Бічна операція зі станом run — не обов’язковий крок кожного запуску. */
  scope?: 'sideState' | 'main';
};

const STATE_SIDE_NOTE_UK =
  'Бічна операція зі станом run: не кожен запуск обов’язково проходить ці два переходи послідовно. Код може записувати або читати прогрес між основними кроками маршруту до моделі та результату.';

const STATE_WRITE_LEAD_UK =
  `${STATE_SIDE_NOTE_UK} Тут код зберігає в «Стан run», що вже зроблено в цьому розслідуванні. Модель сховище не викликає.`;

const STATE_READ_LEAD_UK =
  `${STATE_SIDE_NOTE_UK} Тут код зчитує збережений прогрес перед наступним запитом до моделі. Модель сховище не читає.`;

export function getAgentTransitionPanelView(
  edgeId: string,
  schema: ArchitectureSchema,
): AgentTransitionPanelView | undefined {
  const meta = getAgentEdgeMeta(edgeId);
  const edge = schema.edges.find((e) => e.id === edgeId);
  if (!meta || !edge) return undefined;
  const fromNode = getSimNode(schema, edge.from);
  const toNode = getSimNode(schema, edge.to);
  const fromUk = fromNode?.label ?? edge.from;
  const toUk = toNode?.label ?? edge.to;
  const payloadUk = meta.panel.input?.trim() || meta.panel.what.trim();
  const purposeUk =
    meta.panel.why?.trim() || meta.panel.problem?.trim() || meta.panel.what.trim();

  if (edgeId === AGENT_STATE_WRITE_ID) {
    return {
      titleUk: 'Бічний зв’язок: Код застосунку → Стан run',
      leadUk: STATE_WRITE_LEAD_UK,
      scope: 'sideState',
      fromUk: 'Код застосунку',
      payloadUk:
        'Номер кроку, ідентифікатор run, текст помилки CI та вже отримані фрагменти звіту або інструментів.',
      toUk: 'Стан run',
      purposeUk: 'Код зберігає прогрес, щоб продовжити те саме розслідування, а не починати run з нуля.',
    };
  }

  if (edgeId === AGENT_STATE_READ_ID) {
    return {
      titleUk: 'Бічний зв’язок: Стан run → Код застосунку',
      leadUk: STATE_READ_LEAD_UK,
      scope: 'sideState',
      fromUk: 'Стан run',
      payloadUk:
        'Збережені кроки, історія повідомлень і результати попередніх інструментів для цього run.',
      toUk: 'Код застосунку',
      purposeUk: 'Код відновлює контекст перед наступним запитом до моделі.',
    };
  }

  if (edgeId === 'e-llm-direct-prepare') {
    return {
      titleUk: 'Відповідь без інструмента',
      leadUk:
        'Альтернатива основному сценарію login_spec: модель одразу дає достатній текст без readReport. На навчальній схемі успіху очікується читання звіту.',
      fromUk,
      payloadUk,
      toUk,
      purposeUk,
      scope: 'main',
    };
  }

  return {
    titleUk: meta.calloutUk,
    fromUk,
    payloadUk,
    toUk,
    purposeUk,
    scope: 'main',
  };
}
