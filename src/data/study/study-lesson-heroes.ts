/** Заголовок Study Mode (еталон — concept-03 RAG). */
export type StudyLessonHeroLetter = {
  char: string;
  en: string;
  uk: string;
};

export type StudyLessonHero = {
  topicId: string;
  /** Коротка назва в хедері (RAG, Tool calling) */
  topicLabel: string;
  /** Повна англ. назва в <abbr> */
  abbrEn: string;
  abbrTitle?: string;
  /** Після « — » український підзаголовок */
  taglineUk: string;
  letters: StudyLessonHeroLetter[];
  /** sr-only для <h1> */
  pageTitleUk: string;
  /** aria-label для ribbon у блоці outcomes */
  outcomesFlowAriaLabel: string;
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

const TOOL_CALLING_HERO: StudyLessonHero = {
  topicId: 'concept-10',
  topicLabel: 'Tool calling',
  abbrEn: 'Structured tool / function calling',
  abbrTitle: 'LLM tool calling (function calling)',
  taglineUk: 'пропозиція моделі й виконання в коді',
  pageTitleUk: 'Tool calling — пропозиція моделі й виконання в коді',
  outcomesFlowAriaLabel: 'Tool calling у run investigation',
  letters: [
    { char: 'T', en: 'Tool schema', uk: 'allow-list операцій і типів args' },
    { char: 'C', en: 'Call', uk: 'структурований tool_call від LLM' },
    { char: 'R', en: 'Run', uk: 'handler після policy; I/O не в моделі' },
  ],
};

const HERO_BY_TOPIC: Record<string, StudyLessonHero> = {
  'concept-03': RAG_HERO,
  'concept-10': TOOL_CALLING_HERO,
};

export function getStudyLessonHero(topicId: string): StudyLessonHero | null {
  return HERO_BY_TOPIC[topicId] ?? null;
}
