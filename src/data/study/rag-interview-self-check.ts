import type { StudyInterviewDeck, StudyInterviewQuestion } from './study-interview-types';

export type RagInterviewQuestion = StudyInterviewQuestion;

export const RAG_INTERVIEW_DECK_ID = 'concept-03-rag-interview';

export const RAG_INTERVIEW_QUESTIONS: RagInterviewQuestion[] = [
  {
    id: 'q1',
    questionUk: 'Що таке RAG і яку проблему він вирішує?',
    answerUk:
      'RAG (retrieval-augmented generation) — це коли застосунок **спочатку знаходить** релевантні фрагменти зовнішніх знань і **додає їх у prompt**, а потім generative LLM формує відповідь з опорою на цей контекст. Проблема: модель не має автоматичного доступу до вашого Confluence, postmortem і закритих інцидентів; без retrieval вона опирається лише на те, що вже в запиті.',
    pitfallUk: 'Помилка: «модель сама ходить у wiki / vector DB» — пошук і ACL виконує код.',
  },
  {
    id: 'q2',
    questionUk: 'Які дві основні фази RAG?',
    answerUk:
      '**Offline (підготовка знань):** документи → parse → chunks → індекс — коли оновлюється корпус. **Runtime (запит):** query → retriever → відбір evidence → context builder → LLM — на кожен run investigation. Індексацію не змішують з кожним викликом моделі: store будують заздалегідь, на запиті лише читають.',
    pitfallUk: 'Помилка: описувати reindex «на льоту» разом із кожною відповіддю LLM.',
  },
  {
    id: 'q3',
    questionUk: 'Що таке chunk і навіщо ділити документи?',
    answerUk:
      '**Chunk** — фрагмент документа з `chunk_id`, полем `text` і metadata, який можна знайти в індексі й передати в prompt з посиланням на `source_id`. Ділити, бо embedding і context window не вміщують цілий postmortem; поганий розмір або «розірване» речення (наприклад про `#login-btn`) руйнує recall.',
    pitfallUk: 'Помилка: «передаємо весь PDF INC-442» — у курсі в prompt йде один уривок `chk-442-a`.',
  },
  {
    id: 'q4',
    questionUk: 'Чи потрібна для RAG векторна база?',
    answerUk:
      '**Ні, не обов’язково.** RAG — це retrieval + augment + generation; індекс може бути BM25, hybrid (vector + ключові слова) або інший пошук по metadata. Vector DB — поширений варіант для similarity, але визначення RAG від нього не залежить. Вибір залежить від даних, мови й latency.',
    pitfallUk: 'Помилка: «без vector DB це не RAG».',
  },
  {
    id: 'q5',
    questionUk: 'Що таке hits і чи всі вони йдуть до LLM?',
    answerUk:
      '**Hits** — результати пошуку (candidates / authorized hits з `chunk_id`, score, `source_id`). До LLM потрапляє лише **selected evidence** після ACL, metadata filters, rerank і token budget. У навчальному run login_spec у hits можуть бути INC-442 і INC-318, але в Retrieved context часто лише INC-442.',
    pitfallUk: 'Помилка: «якщо chunk у top-k, модель його точно бачила».',
  },
  {
    id: 'q6',
    questionUk: 'Де в RAG працює код, а де LLM?',
    answerUk:
      '**Код:** loader, parse, chunker, embed/index, retriever, фільтри, context builder, перевірки citation після генерації. **LLM:** синтез відповіді природною мовою з уже переданого context. Модель не індексує документи і не виконує programmatic search.',
    pitfallUk: 'Помилка: змішувати embedding model (offline) з generative LLM (runtime).',
  },
  {
    id: 'q7',
    questionUk: 'Якщо відповідь містить правильний source_id, чи можна їй довіряти?',
    answerUk:
      '**Ні, недостатньо.** Треба три шари: (A) `source_id` справді в **selected evidence** цього run; (B) теза підтверджується **текстом chunk**; (C) пояснює **поточне** падіння (DOM, Playwright trace, логи CI). Правильний INC-442 у citation не доводить root cause сьогоднішнього `login_spec`.',
    pitfallUk: 'Помилка: «citation доводить root cause» або «pass A = pass усе».',
  },
  {
    id: 'q8',
    questionUk: 'Як би ти тестував RAG як QA?',
    answerUk:
      'Окремо: **індексація** (reindex, версія індексу), **retrieval** (golden queries, recall@k без LLM), **ізоляція** (tenant A ≠ B), **selected context** у trace, **citation/groundedness**, **oracle** поточного збою. Додати сценарії застарілого індексу й порожнього пошуку. Приклад: після зміни postmortem про `#login-btn` — chunk у індексі; query login staging → очікуваний `chk-442-a`; QA звіряє trace і DOM, не лише текст відповіді.',
    pitfallUk: 'Помилка: один e2e «чи звучить відповідь розумно» без шару retrieval.',
  },
  {
    id: 'q9',
    questionUk: 'Що робити, якщо пошук нічого не знайшов або недоступний?',
    answerUk:
      'Поведінку задає **продукт і harness**: чесно повідомити про брак доказів, зупинити run, retry за правилами або деградувати без RAG з явним попередженням. Не вигадувати факти так, ніби документи знайдені. Це політика застосунку, не «дефолт» generative model.',
    pitfallUk: 'Помилка: дозволити моделі галюцинувати postmortem, коли retrieval порожній.',
  },
  {
    id: 'q10',
    questionUk: 'Чим звичайний RAG відрізняється від агентного сценарію з RAG?',
    answerUk:
      '**Класичний RAG** у курсі — заданий pipeline: сигнал CI → query → retriever → context → одна (або фіксована) генерація. **Агентний сценарій** може **сам вирішити**, коли шукати, уточнити query, викликати tool і чи потрібен ще крок — RAG лишається інструментом harness, а не єдиним лінійним скриптом. Спочатку варто міцно зрозуміти лінійний ланцюг пошук → контекст → відповідь.',
    pitfallUk: 'Помилка: називати будь-який tool call «Agentic RAG» без відокремлення retrieval pipeline.',
  },
];

export const RAG_INTERVIEW_PITCH_UK =
  'RAG вирішує проблему актуальних зовнішніх знань: наш застосунок offline готує індекс з документів, а на запиті код programmatically знаходить фрагменти, перевіряє доступ і збирає context у messages. Generative LLM лише формує відповідь з опорою на відібрані уривки — вона не читає wiki напряму. Як QA я розділяю тести індексації, retrieval, ізоляції tenant і groundedness відповіді, включно з oracle поточного падіння тесту.';

export const RAG_INTERVIEW_PITCH_EN =
  'RAG adds external, up-to-date knowledge at answer time: we build a searchable index offline, and at runtime application code retrieves chunks, enforces access control, and assembles the prompt context. The generative LLM only answers from that selected context—it does not query our wiki by itself. As QA I test indexing, retrieval, tenant isolation, and whether citations match selected evidence and the current failure, not just whether the wording sounds plausible.';

/** Еталонний deck — інші теми копіюють структуру, не текст */
export const RAG_INTERVIEW_DECK: StudyInterviewDeck = {
  deckId: RAG_INTERVIEW_DECK_ID,
  headingUk: 'Перевір себе перед співбесідою',
  leadUk:
    'Спочатку сформулюйте відповідь уголос або про себе, потім розгорніть підказку. Позначки зберігаються лише в цьому браузері й не змінюють прогрес теми на карті курсу.',
  questions: RAG_INTERVIEW_QUESTIONS,
  pitchUk: RAG_INTERVIEW_PITCH_UK,
  pitchEn: RAG_INTERVIEW_PITCH_EN,
  nextLinks: [
    {
      to: '/topic/concept-15/study',
      label: 'Vector Database',
      hintUk: ' — як влаштований векторний пошук і hybrid індекси (після класичного RAG).',
    },
    {
      to: '/agent-architecture?tab=cag',
      label: 'Підготовлений контекст (атлас)',
      hintUk: ' — коли context готують заздалегідь (CAG курсу); не плутати з Cache-Augmented у книзі.',
    },
    {
      to: '/topic/concept-16/study',
      label: 'Agentic Workflows',
      hintUk:
        ' — агент може сам вирішувати, коли викликати retrieval; спершу закріпіть лінійний RAG пошук → контекст → відповідь.',
    },
  ],
};
