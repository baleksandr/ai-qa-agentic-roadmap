export type StudyInterviewDeepInfoCard = {
  titleUk: string;
  bodyUk: string;
};

/** Блокове визначення в «Коротко» (термін акцентом, пояснення звичайним текстом). */
export type StudyInterviewBriefDefinition = {
  termUk: string;
  /** EN-відповідник після UA-назви, не замість пояснення. */
  termEn?: string;
  leadUk: string;
  /** Окремий навчальний приклад під визначенням. */
  exampleUk?: string;
};

export type StudyInterviewQuestion = {
  id: string;
  questionUk: string;
  /** Одношарова відповідь (legacy decks). Для нових — `answerBriefUk` + `answerDeepUk`. */
  answerUk?: string;
  /** 2–3 речення для співбесіди (або продовження після `answerBriefDefinition`). */
  answerBriefUk?: string;
  answerBriefDefinition?: StudyInterviewBriefDefinition;
  /** Детальне пояснення (markdown: абзаци, списки) */
  answerDeepUk?: string;
  /** Підпис над `answerDeepUk` (за замовчуванням — з deck). */
  answerDeepLabelUk?: string;
  /** Окремі інформаційні картки в середині відповіді (без JSON). */
  deepInfoCards?: StudyInterviewDeepInfoCard[];
  /** `scenario` — вертикальний ланцюг «підготували → сталося → QA». */
  deepInfoCardsLayout?: 'grid' | 'scenario';
  /** Кроки ланцюга після `answerDeepUk` (міні-блоки з →). */
  answerDeepFlowStages?: string[];
  answerDeepFlowCaptionUk?: string;
  pitfallUk?: string;
};

export type StudyInterviewNextLink = {
  to: string;
  label: string;
  hintUk: string;
};

export type StudyInterviewDeck = {
  deckId: string;
  headingUk: string;
  leadUk: string;
  /** За замовчуванням — «Коротко для співбесіди». */
  answerBriefLabelUk?: string;
  /** За замовчуванням — «Розберімо до гвинтиків». */
  answerDeepLabelUk?: string;
  questions: StudyInterviewQuestion[];
  pitchUk: string;
  pitchEn: string;
  nextLinks: StudyInterviewNextLink[];
  /** Текст на картці посилання (наприклад «Перейти до теми ↗»). */
  nextLinkCtaUk?: string;
};
