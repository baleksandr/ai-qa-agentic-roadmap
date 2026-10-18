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
  /** Підзаголовок під назвою або після abbr */
  taglineUk: string;
  letters: StudyLessonHeroLetter[];
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
  taglineUk: 'спільний словник перед агентом і investigation',
  pageTitleUk: 'AI / LLM Fundamentals — базовий словник курсу',
  outcomesFlowAriaLabel: 'Від запиту до відповіді моделі',
  letters: [
    { char: 'A', en: 'AI scope', uk: 'де живе LLM серед інших підходів' },
    { char: 'L', en: 'LLM inference', uk: 'токени, context, next-token' },
    { char: 'Q', en: 'QA lens', uk: 'що тестувати в investigation після login_spec' },
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

const MEMORY_STATE_HERO: StudyLessonHero = {
  topicId: 'concept-01',
  topicLabel: 'Memory & State',
  abbrEn: 'Run state and durable memory',
  abbrTitle: 'Memory and state in agent systems',
  taglineUk: 'що зберегти між кроками run і з минулого',
  pageTitleUk: 'Memory & State — збереження між кроками investigation',
  outcomesFlowAriaLabel: 'State і memory в одному run investigation',
  letters: [
    { char: 'S', en: 'State', uk: 'поточний run: крок, статус, observations' },
    { char: 'M', en: 'Memory', uk: 'збережене з минулого для нового контексту' },
    { char: 'C', en: 'Context builder', uk: 'код обирає, що потрапить у prompt' },
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
  'concept-06': partIiHero('concept-06', 'MCP', 'Model Context Protocol', 'стандарт tools між client і server', 'MCP — протокол інтеграцій', 'MCP у investigation', [
    { char: 'M', en: 'Model client', uk: 'harness як клієнт' },
    { char: 'C', en: 'Context', uk: 'tools і resources' },
    { char: 'P', en: 'Protocol', uk: 'контракт виклику' },
  ]),
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
  'concept-13': partIiHero('concept-13', 'Fine-tuning', 'Weight adaptation', 'навчання на ваших прикладах', 'Fine-tuning — до навчання ваг', 'Fine-tune vs RAG', [
    { char: 'F', en: 'Fit', uk: 'стиль/формат' },
    { char: 'T', en: 'Train', uk: 'offline job' },
    { char: 'W', en: 'Weights', uk: 'нова модель version' },
  ]),
  'concept-14': partIiHero('concept-14', 'Prompt Engineering', 'Instruction design', 'role, constraints, format', 'Prompt Engineering — дизайн промптів', 'Prompt для investigation', [
    { char: 'P', en: 'Prompt', uk: 'messages[] дизайн' },
    { char: 'E', en: 'Examples', uk: 'few-shot' },
    { char: 'F', en: 'Format', uk: 'JSON / schema' },
  ]),
  'concept-15': partIiHero('concept-15', 'Vector Database', 'Embedding index', 'similarity search для chunks', 'Vector DB — векторний індекс', 'Vector search у RAG', [
    { char: 'V', en: 'Vectors', uk: 'embeddings chunks' },
    { char: 'D', en: 'DB', uk: 'Top-K + metadata' },
    { char: 'S', en: 'Search', uk: 'код + ACL' },
  ]),
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
