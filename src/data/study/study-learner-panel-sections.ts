/** Структурні секції навчальної панелі (спільний контракт для Fundamentals і інших тем). */

/** Явна пара «назва — пояснення» (`StudyLabeledExplanation`). */
export type StudyLabeledPair = { termUk: string; explanationUk: string };

export type StudyLearnerPanelProseSection = {
  type: 'prose';
  labelUk: string;
  /** Коротка головна теза — акцентом (якщо немає labeledLead). */
  thesisUk?: string;
  /** Термін кольором + пояснення (наприклад LLM — мовна модель…). */
  labeledLead?: StudyLabeledPair;
  bodyUk: string;
  /** Пари після абзаца (або замість авто-розбору хвоста «Термін — …»). */
  labeledPairs?: StudyLabeledPair[];
};

export type StudyLearnerPanelMiniCardsSection = {
  type: 'miniCards';
  labelUk: string;
  captionUk?: string;
  /** `flow` — вертикальний ланцюг зі стрілками між мінікартками (киберпанк у панелі). */
  layout?: 'stack' | 'flow';
  items: Array<{ titleUk: string; bodyUk: string }>;
};

/** Дві мінікартки термінів у ряд + спільний підсумок (не для довільного тексту). */
export type StudyLearnerPanelTermPairCardsSection = {
  type: 'termPairCards';
  labelUk: string;
  cards: Array<{
    termUk: string;
    fullNameUk?: string;
    explanationUk: string;
  }>;
  conclusionLabelUk: string;
  conclusionUk: string;
};

export type StudyLearnerPanelTaxonomySection = {
  type: 'taxonomy';
  labelUk: string;
  items: Array<{ termUk: string; bodyUk: string }>;
  footnoteUk?: string;
};

export type StudyLearnerPanelMechanismChecksSection = {
  type: 'mechanismChecks';
  labelUk: string;
  rows: Array<{ mechanismUk: string; checkUk: string }>;
};

export type StudyLearnerPanelPlainSection = {
  type: 'plain';
  labelUk: string;
  bodyUk: string;
  /** Підблок «QA-перевірка» після основного тексту (не дублювати в bodyUk). */
  qaCheckUk?: string;
};

/** Лише текст перевірки; заголовок «QA-перевірка» — у `StudyLearnerPanelQaCheck`. */
export type StudyLearnerPanelQaCheckSection = {
  type: 'qaCheck';
  bodyUk: string;
};

export type StudyLearnerPanelLabeledLinesSection = {
  type: 'labeledLines';
  labelUk: string;
  items: StudyLabeledPair[];
  /** Повноширинна внутрішня картка з читабельними частинами (§19 VLM). */
  panelCard?: boolean;
};

export type StudyModelResponseCheckStatus = 'yes' | 'pending' | 'no';

export type StudyModelResponseFieldRow = {
  labelUk: string;
  /** Зрозуміле значення поля (коротко). */
  valueUk: string;
  /** Коротке пояснення для учня (опційно, окремий рядок під значенням). */
  explanationUk?: string;
  technicalUk: string;
};

export type StudyModelResponseCheckRow = {
  labelUk: string;
  status: StudyModelResponseCheckStatus;
  statusTextUk: string;
};

/** Шапка навчального прикладу в картці полів (бейдж + підпис, без тексту під сіткою). */
export type StudyModelResponseTeachingHeader = {
  badgeUk: string;
  captionUk: string;
};

/** Навчальна картка відповіді моделі над картками перевірок (§14 «Формат»). */
export type StudyModelResponseExample = {
  blockLabelUk: string;
  introUk?: string;
  /** Бейдж і підпис у шапці оформленого блоку полів (§16 тощо). */
  teachingExampleHeader?: StudyModelResponseTeachingHeader;
  mainCardTitleUk: string;
  fields: StudyModelResponseFieldRow[];
  /** Короткий підсумок під сіткою полів (§14), не використовувати разом із teachingExampleHeader. */
  fieldsSummaryUk?: string;
  checksSectionTitleUk?: string;
  checks?: StudyModelResponseCheckRow[];
  conclusionUk?: string;
  schemaSectionTitleUk: string;
  schemaRules: Array<{ fieldKeyUk: string; ruleUk: string }>;
  jsonExample: string;
};

/** Процес або змістовний перелік у панелі: картки + деталь обраного + опційно блок QA-доказів. */
export type StudyLearnerPanelProcessStepPickSection = {
  type: 'processStepPick';
  labelUk: string;
  pickAriaLabel: string;
  /** `process` — кроки run; `concepts` — питання/аспекти одного твердження без «Крок N». */
  presentation?: 'process' | 'concepts';
  /** Замість довгого `leadUk` — структурований приклад відповіді над картками. */
  modelResponseExample?: StudyModelResponseExample;
  leadUk?: string;
  /** Пари «назва — пояснення» над картками (разом із або замість `leadUk`). */
  leadLabeledPairs?: StudyLabeledPair[];
  interactionHintUk?: string;
  showActorInPanel?: boolean;
  showStepIndexInPanel?: boolean;
  /** Для `presentation: 'concepts'` — список `ul` без стрілок процесу між картками. */
  conceptGroups?: Array<{ headingUk: string; stepKeys: string[] }>;
  steps: Array<{
    key: string;
    titleUk: string;
    teaserUk: string;
    actorUk: string;
    detailUk?: string;
    /** Підписані блоки в боковій панелі вкладеної картки (замість одного `detailUk`). */
    detailSections?: Array<{
      labelUk: string;
      bodyUk?: string;
      labeledLead?: StudyLabeledPair;
      labeledPairs?: StudyLabeledPair[];
    }>;
    exampleUk?: string;
    qaCheckUk?: string;
    terms?: Array<{ label: string; text: string }>;
  }>;
  qaEvidence?: {
    labelUk: string;
    items: StudyLabeledPair[];
  };
  /** Підсумок під вкладеними картками в тій самій секції (§19 LLM/SLM). */
  pickConclusionLabelUk?: string;
  pickConclusionUk?: string;
  /**
   * `sidebar` — картки зліва, панель справа (за замовчуванням).
   * `rowAbovePanel` — картки в ряд зверху, пояснення обраної під ними.
   */
  navLayout?: 'sidebar' | 'rowAbovePanel';
};

/** Посилання на повний урок теми в «Увесь маршрут» (`topics.registry` → `/topic/:id/study`). */
export type StudyLearnerPanelCourseLessonLinkSection = {
  type: 'courseLessonLink';
  topicId: string;
  linkLabelUk: string;
};

/** Картка полів і JSON у розгортанні (§3 PE формат, §14 тощо). */
export type StudyLearnerPanelModelResponseExampleSection = {
  type: 'modelResponseExample';
  labelUk: string;
  block: StudyModelResponseExample;
};

export type StudyLearnerPanelSection =
  | StudyLearnerPanelProseSection
  | StudyLearnerPanelMiniCardsSection
  | StudyLearnerPanelTermPairCardsSection
  | StudyLearnerPanelTaxonomySection
  | StudyLearnerPanelMechanismChecksSection
  | StudyLearnerPanelPlainSection
  | StudyLearnerPanelQaCheckSection
  | StudyLearnerPanelLabeledLinesSection
  | StudyLearnerPanelProcessStepPickSection
  | StudyLearnerPanelModelResponseExampleSection
  | StudyLearnerPanelCourseLessonLinkSection;
