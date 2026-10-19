/** Заголовок Study Mode (еталон — concept-03 RAG). */
export type StudyLessonHeroLetter = {
  char: string;
  en: string;
  uk: string;
};

export type StudyLessonHeroIntroCard = {
  titleUk: string;
  bodyUk: string;
};

export type StudyLessonHero = {
  topicId: string;
  /** Коротка назва в хедері (RAG, Tool calling) */
  topicLabel: string;
  /** Повна англ. назва в <abbr> */
  abbrEn: string;
  abbrTitle?: string;
  /** Підзаголовок під назвою або після abbr (один рядок, якщо немає `taglineUkLines`) */
  taglineUk: string;
  /** Кілька рядків одного пояснення в хедері (наприклад concept-01). */
  taglineUkLines?: string[];
  letters: StudyLessonHeroLetter[];
  /** Компактні Neon HUD картки замість звичайної сітки літер (concept-01). */
  letterPresentation?: 'default' | 'cyber-hud';
  /** Замість сітки літер — інформаційні картки на всю ширину (concept-10). */
  introCards?: StudyLessonHeroIntroCard[];
  /** sr-only для <h1> */
  pageTitleUk: string;
  /** aria-label для ribbon у блоці outcomes */
  outcomesFlowAriaLabel: string;
};

const FUNDAMENTALS_HERO: StudyLessonHero = {
  topicId: 'fundamentals',
  topicLabel: 'Fundamentals',
  abbrEn: 'AI / LLM Fundamentals',
  abbrTitle: 'Artificial Intelligence and Large Language Model basics',
  taglineUk: 'Базові поняття LLM для вивчення агентів і роботи QA',
  pageTitleUk: 'AI / LLM Fundamentals — базовий словник курсу',
  outcomesFlowAriaLabel: 'Від запиту до відповіді моделі',
  letters: [
    { char: 'A', en: 'Основи AI', uk: 'Роль LLM у застосунку' },
    { char: 'L', en: 'Робота LLM', uk: 'Контекст і генерація токенів' },
    { char: 'Q', en: 'Погляд QA', uk: 'Що перевіряти в агенті' },
  ],
};

const RAG_HERO: StudyLessonHero = {
  topicId: 'concept-03',
  topicLabel: 'RAG',
  abbrEn: 'Retrieval-Augmented Generation',
  abbrTitle: 'Retrieval-Augmented Generation',
  taglineUk: 'пошук знань перед відповіддю',
  pageTitleUk: 'RAG — пошук знань перед відповіддю',
  outcomesFlowAriaLabel: 'RAG під час одного запиту',
  letters: [
    { char: 'R', en: 'Retrieval', uk: 'пошук / отримання фрагментів' },
    { char: 'A', en: 'Augmented', uk: 'доповнення prompt контекстом' },
    { char: 'G', en: 'Generation', uk: 'генерація відповіді моделлю' },
  ],
};

const VECTOR_DATABASE_HERO: StudyLessonHero = {
  topicId: 'concept-15',
  topicLabel: 'Vector Database',
  abbrEn: 'Індекс векторів',
  abbrTitle: 'Vector database for similarity search',
  taglineUk: 'Допомагає знайти фрагменти документів, схожі на запит',
  pageTitleUk: 'Vector Database — індекс векторів для пошуку фрагментів',
  outcomesFlowAriaLabel: 'Вектори, індекс і пошук у RAG',
  letterPresentation: 'cyber-hud',
  letters: [
    { char: 'V', en: 'Вектори', uk: 'Числовий опис тексту' },
    { char: 'І', en: 'Індекс', uk: 'Вектори та зв’язок із джерелом' },
    { char: 'P', en: 'Пошук', uk: 'Повертає близькі фрагменти' },
  ],
};

const FINE_TUNING_HERO: StudyLessonHero = {
  topicId: 'concept-13',
  topicLabel: 'Fine-tuning',
  abbrEn: 'Навчання моделі на прикладах',
  abbrTitle: 'Fine-tuning on example data',
  taglineUk: 'Як адаптувати відповіді моделі до повторюваної задачі',
  pageTitleUk: 'Fine-tuning — навчання моделі на прикладах',
  outcomesFlowAriaLabel: 'Приклади, навчання і перевірка fine-tuning',
  letterPresentation: 'cyber-hud',
  letters: [
    { char: 'E', en: 'Examples', uk: 'Input and expected response' },
    { char: 'T', en: 'Training', uk: 'Model parameters or adapter' },
    { char: 'E', en: 'Evaluation', uk: 'Tests before deployment' },
  ],
};

const MCP_HERO: StudyLessonHero = {
  topicId: 'concept-06',
  topicLabel: 'MCP',
  abbrEn: 'Model Context Protocol',
  abbrTitle: 'Model Context Protocol',
  taglineUk: 'Як застосунок підключає інструменти й джерела даних',
  pageTitleUk: 'MCP — Model Context Protocol',
  outcomesFlowAriaLabel: 'Host, MCP client і MCP server',
  letterPresentation: 'cyber-hud',
  letters: [
    { char: 'H', en: 'Host', uk: 'Керує роботою агента' },
    { char: 'C', en: 'MCP client', uk: 'Зв’язок із сервером' },
    { char: 'S', en: 'MCP server', uk: 'Надає інструменти й дані' },
  ],
};

const MEMORY_STATE_HERO: StudyLessonHero = {
  topicId: 'concept-01',
  topicLabel: 'Memory & State',
  abbrEn: 'Run state and durable memory',
  abbrTitle: 'Memory and state in agent systems',
  taglineUk: 'Як зберегти стан run і використати знання з минулого',
  pageTitleUk: 'Memory & State — збереження між кроками investigation',
  outcomesFlowAriaLabel: 'State і memory в одному run investigation',
  letterPresentation: 'cyber-hud',
  letters: [
    { char: 'S', en: 'State', uk: 'Стан поточного run' },
    { char: 'M', en: 'Memory', uk: 'Знання з минулих запусків' },
    { char: 'C', en: 'Context builder', uk: 'Збирає запит до моделі' },
  ],
};

const ORCHESTRATION_HERO: StudyLessonHero = {
  topicId: 'concept-02',
  topicLabel: 'Orchestration',
  abbrEn: 'Workflow coordination',
  abbrTitle: 'Orchestration of agents and services',
  taglineUk: 'порядок кроків, retries і human gates',
  pageTitleUk: 'Orchestration — керування workflow investigation',
  outcomesFlowAriaLabel: 'Orchestration після падіння login_spec',
  letters: [
    { char: 'W', en: 'Workflow', uk: 'граф кроків і залежностей' },
    { char: 'F', en: 'Flow control', uk: 'ready tasks, routing, retries' },
    { char: 'G', en: 'Gates', uk: 'human approve перед небезпечним кроком' },
  ],
};

const AGENT_HARNESS_HERO: StudyLessonHero = {
  topicId: 'concept-04',
  topicLabel: 'Agent Harness',
  abbrEn: 'Runtime around the LLM',
  abbrTitle: 'Agent harness (execution shell)',
  taglineUk: 'loop, tools, policy і tracing навколо моделі',
  pageTitleUk: 'Agent Harness — runtime навколо LLM',
  outcomesFlowAriaLabel: 'Harness loop після login_spec',
  letters: [
    { char: 'H', en: 'Harness', uk: 'код навколо model API' },
    { char: 'L', en: 'Loop', uk: 'turns до stop condition' },
    { char: 'T', en: 'Trace', uk: 'spans model/tool для QA' },
  ],
};

const REASONING_HERO: StudyLessonHero = {
  topicId: 'concept-12',
  topicLabel: 'Reasoning — як агент перевіряє свої припущення',
  abbrEn: '',
  abbrTitle: 'Reasoning',
  taglineUk: 'Від повідомлення про збій до висновку, підтвердженого доступними даними',
  pageTitleUk: 'Reasoning — перевірка припущень у investigation',
  outcomesFlowAriaLabel: 'Reasoning у розслідуванні login_spec',
  letters: [],
};

const TOOL_CALLING_HERO: StudyLessonHero = {
  topicId: 'concept-10',
  topicLabel: 'Tool Calling — виклик інструментів',
  abbrEn: '',
  abbrTitle: 'Tool Calling',
  taglineUk: 'Модель пропонує дію. Код перевіряє її й лише після дозволу запускає інструмент.',
  pageTitleUk: 'Tool Calling — виклик інструментів',
  outcomesFlowAriaLabel: 'Tool calling у run investigation',
  letters: [],
  introCards: [
    {
      titleUk: 'Опис інструмента',
      bodyUk: 'Код повідомляє моделі, які інструменти доступні та які аргументи вони приймають.',
    },
    {
      titleUk: 'Пропозиція моделі',
      bodyUk: 'Модель може повернути назву інструмента й аргументи. Це ще не виконання.',
    },
    {
      titleUk: 'Виконання кодом',
      bodyUk: 'Застосунок перевіряє пропозицію. Після дозволу інструмент повертає дані або помилку.',
    },
  ],
};

function partIiHero(
  topicId: string,
  topicLabel: string,
  abbrEn: string,
  taglineUk: string,
  pageTitleUk: string,
  outcomesFlowAriaLabel: string,
  letters: StudyLessonHeroLetter[],
): StudyLessonHero {
  return {
    topicId,
    topicLabel,
    abbrEn,
    abbrTitle: abbrEn,
    taglineUk,
    pageTitleUk,
    outcomesFlowAriaLabel,
    letters,
  };
}

const HERO_BY_TOPIC: Record<string, StudyLessonHero> = {
  fundamentals: FUNDAMENTALS_HERO,
  'concept-01': MEMORY_STATE_HERO,
  'concept-02': ORCHESTRATION_HERO,
  'concept-03': RAG_HERO,
  'concept-04': AGENT_HARNESS_HERO,
  'concept-05': partIiHero('concept-05', 'Evals', 'Systematic agent evaluation', 'регресія якості на golden set', 'Evals — регресія якості агента', 'Evals після зміни prompt', [
    { char: 'E', en: 'Examples', uk: 'набір кейсів login_spec' },
    { char: 'V', en: 'Verify', uk: 'метрики groundedness/tools' },
    { char: 'S', en: 'Score', uk: 'pass/fail gate у CI' },
  ]),
  'concept-06': MCP_HERO,
  'concept-07': partIiHero('concept-07', 'Skills', 'Modular agent skills', 'підмножина tools і prompt', 'Skills — модульні навички', 'Skill investigation', [
    { char: 'S', en: 'Select', uk: 'router обирає skill' },
    { char: 'K', en: 'Kit', uk: 'tools + instructions' },
    { char: 'L', en: 'Limit', uk: 'менший allow-list' },
  ]),
  'concept-08': partIiHero('concept-08', 'A2A', 'Agent-to-agent protocol', 'обмін задачами між сервісами', 'A2A — агент до агента', 'A2A delegate після investigation', [
    { char: 'A', en: 'Agent', uk: 'відправник задачі' },
    { char: '2', en: 'To', uk: 'транспорт між сервісами' },
    { char: 'A', en: 'Agent', uk: 'виконавець з контрактом' },
  ]),
  'concept-09': partIiHero('concept-09', 'Multi-Agent', 'Multiple specialized agents', 'ролі + координація', 'Multi-Agent — кілька агентів', 'Multi-agent після login_spec', [
    { char: 'M', en: 'Many', uk: 'різні prompts/tools' },
    { char: 'A', en: 'Actors', uk: 'investigation vs coding' },
    { char: 'P', en: 'Policy', uk: 'окремі guardrails' },
  ]),
  'concept-10': TOOL_CALLING_HERO,
  'concept-11': partIiHero('concept-11', 'Planning', 'Explicit run plans', 'кроки до tool chaos', 'Planning — план investigation', 'Plan після login_spec', [
    { char: 'P', en: 'Plan', uk: 'кроки з schema' },
    { char: 'L', en: 'Loop', uk: 'execute / replan' },
    { char: 'N', en: 'Next', uk: 'harness валідує крок' },
  ]),
  'concept-12': REASONING_HERO,
  'concept-13': FINE_TUNING_HERO,
  'concept-14': {
    topicId: 'concept-14',
    topicLabel: 'Prompt Engineering',
    abbrEn: '',
    abbrTitle: 'Prompt Engineering',
    taglineUk:
      'Як сформулювати завдання моделі, щоб її відповідь можна було перевірити й використати',
    pageTitleUk: 'Prompt Engineering — дизайн промптів',
    outcomesFlowAriaLabel: 'Prompt для investigation',
    letters: [
      {
        char: 'P',
        en: 'Prompt / запит',
        uk: 'Задача, правила та відомі факти, які застосунок передає моделі',
      },
      {
        char: 'E',
        en: 'Examples / приклади',
        uk: 'Зразки відповіді, які показують моделі бажаний спосіб виконання задачі',
      },
      {
        char: 'F',
        en: 'Format / формат',
        uk: 'Структура відповіді, яку код зможе перевірити, наприклад поля результату',
      },
    ],
  },
  'concept-15': VECTOR_DATABASE_HERO,
  'concept-16': partIiHero('concept-16', 'Agentic Workflows', 'Multi-step agent scenarios', 'сценарій з handoff', 'Agentic Workflows — сценарії', 'Workflow investigation→fix', [
    { char: 'W', en: 'Workflow', uk: 'етапи продукту' },
    { char: 'A', en: 'Artifacts', uk: 'structured handoff' },
    { char: 'G', en: 'Gate', uk: 'human між етапами' },
  ]),
  'concept-17': partIiHero('concept-17', 'Guardrails', 'Deterministic controls', 'policy навколо LLM', 'Guardrails — обмеження дій', 'Guardrails на tool proposal', [
    { char: 'G', en: 'Guard', uk: 'validators' },
    { char: 'P', en: 'Policy', uk: 'allow/deny/approve' },
    { char: 'S', en: 'Sandbox', uk: 'paths і tools' },
  ]),
  'concept-18': partIiHero('concept-18', 'Observability', 'Traces and metrics', 'видимість run у prod', 'Observability — traces', 'Trace investigation run', [
    { char: 'O', en: 'Observe', uk: 'spans model/tool' },
    { char: 'B', en: 'Bridge', uk: 'correlation id' },
    { char: 'S', en: 'Signals', uk: 'latency, errors' },
  ]),
  'concept-19': partIiHero('concept-19', 'Benchmarks', 'Standard model tests', 'порівняння моделей', 'Benchmarks — еталонні тести', 'Benchmark vs domain eval', [
    { char: 'B', en: 'Bench', uk: 'public sets' },
    { char: 'M', en: 'Measure', uk: 'агрегатні метрики' },
    { char: 'G', en: 'Gate', uk: 'разом з internal evals' },
  ]),
  'concept-20': partIiHero('concept-20', 'Production', 'Operating agents at scale', 'SLO, deploy, incidents', 'Production — агенти в проді', 'Production investigation', [
    { char: 'P', en: 'Prod', uk: 'real tenants' },
    { char: 'O', en: 'Ops', uk: 'on-call, rollback' },
    { char: 'S', en: 'Scale', uk: 'cost, limits' },
  ]),
};

export function getStudyLessonHero(topicId: string): StudyLessonHero | null {
  return HERO_BY_TOPIC[topicId] ?? null;
}
