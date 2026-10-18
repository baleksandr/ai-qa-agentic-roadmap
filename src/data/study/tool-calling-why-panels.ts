import type { FundamentalsCardPanel } from './fundamentals-card-panels';

export const TOOL_CALLING_WHY_TEXT_NOT_FILE: FundamentalsCardPanel = {
  sections: [
    {
      type: 'plain',
      labelUk: 'Текст моделі не відкриває файл',
      bodyUk:
        'Після падіння login_spec модель може написати «потрібно перевірити звіт». Щоб отримати фактичні дані зі звіту Playwright, застосунок має перевірити пропозицію й викликати інструмент.',
    },
  ],
  terms: [],
};

export const TOOL_CALLING_WHY_TEXT_VS_ACTION: FundamentalsCardPanel = {
  sections: [
    {
      type: 'plain',
      labelUk: 'Простими словами',
      bodyUk:
        'Речення «відкрий звіт» у відповіді моделі — лише текст. Дію виконує код після перевірок.',
    },
    {
      type: 'plain',
      labelUk: 'У прикладі login_spec',
      bodyUk:
        'Модель може сказати «треба подивитися Playwright-звіт». Поки harness не виконав readPlaywrightReport, жоден файл не відкрили.',
    },
    {
      type: 'qaCheck',
      bodyUk:
        'Чи є в trace окремий запис про виконання інструмента, а не лише текст моделі про «перевірку звіту»?',
    },
  ],
  terms: [],
};

export const TOOL_CALLING_WHY_TOOL_SCHEMA: FundamentalsCardPanel = {
  sections: [
    {
      type: 'plain',
      labelUk: 'Простими словами',
      bodyUk:
        'Код описує назву інструмента, його призначення та форму аргументів. Такий опис не дає автоматичного дозволу читати будь-який файл.',
    },
    {
      type: 'plain',
      labelUk: 'У прикладі login_spec',
      bodyUk:
        'У запиті до моделі з’являється readPlaywrightReport з полем для шляху до звіту. Це довідка для моделі, а не команда диску.',
    },
    {
      type: 'qaCheck',
      bodyUk:
        'Чи збігається опис інструмента в запиті моделі з тим контрактом, який перевіряє код після пропозиції?',
    },
  ],
  terms: [{ label: 'Tool schema', text: 'Опис назви інструмента й форми аргументів для моделі та валідатора.' }],
};

export const TOOL_CALLING_WHY_TOOL_CALL: FundamentalsCardPanel = {
  sections: [
    {
      type: 'plain',
      labelUk: 'Простими словами',
      bodyUk:
        'Модель повертає структуровану пропозицію з назвою інструмента й аргументами. До виконання файл не прочитано.',
    },
    {
      type: 'plain',
      labelUk: 'У прикладі login_spec',
      bodyUk:
        'Модель пропонує readPlaywrightReport із шляхом до index.html звіту. У trace це видно як пропозицію, а не як вміст файлу.',
    },
    {
      type: 'qaCheck',
      bodyUk:
        'Чи відрізняєте в trace пропозицію tool call від події виконання handler?',
    },
  ],
  terms: [{ label: 'Tool call', text: 'Структурована пропозиція моделі викликати інструмент з аргументами.' }],
};

export const TOOL_CALLING_WHY_VS_RAG: FundamentalsCardPanel = {
  sections: [
    {
      type: 'plain',
      labelUk: 'Простими словами',
      bodyUk:
        'Tool Calling дає застосунку змогу виконати конкретну дозволену дію під час run. RAG додає знайдені фрагменти джерел до контексту моделі. Якщо RAG використовує інструмент пошуку, ці механізми можуть працювати разом.',
    },
    {
      type: 'plain',
      labelUk: 'У прикладі login_spec',
      bodyUk:
        'Щоб побачити фактичний звіт тесту, потрібен виклик readPlaywrightReport. Окремий пошук у wiki не замінює читання артефакта цього запуску, якщо його не передали в контекст.',
    },
    {
      type: 'qaCheck',
      bodyUk:
        'Чи не плутаєте фрагмент з пошуку в індексі з результатом readPlaywrightReport для цього CI run?',
    },
  ],
  terms: [],
};
