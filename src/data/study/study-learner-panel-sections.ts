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

export type StudyLearnerPanelMiniCardTone =
  | 'neutral'
  | 'allow'
  | 'deny'
  /** Спростування гіпотези — стриманий рожевий акцент (Reasoning §4). */
  | 'refute'
  /** Інструмент запускався, але повернув помилку (корал, Reasoning §5). */
  | 'readFail'
  /** Завершення run без помилки (не «успіх» і не «відмова»). */
  | 'end'
  /** @deprecated використовуй `allow` */
  | 'investigationContinue'
  /** @deprecated використовуй `end` */
  | 'investigationEnd';

export type StudyLearnerPanelMiniCardsSection = {
  type: 'miniCards';
  labelUk: string;
  captionUk?: string;
  /** Лише картки — заголовок секції не дублювати над карткою. */
  hideSectionLabel?: boolean;
  /**
   * `flow` — ланцюг зі стрілками;
   * `titledStack` — outcome-картки;
   * `numberedStack` — номер + назва + текст (Reasoning §7 «Що робить QA»).
   */
  layout?: 'stack' | 'flow' | 'titledStack' | 'numberedStack';
  framed?: boolean;
  framedVariant?: 'default' | 'why' | 'expect' | 'limit';
  items: Array<{
    titleUk: string;
    bodyUk: string;
    footnoteUk?: string;
    tone?: StudyLearnerPanelMiniCardTone;
  }>;
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
  /** Окрема темна рамка навколо заголовка й тексту блоку. */
  framed?: boolean;
  /** Акцент рамки (§6 why, §7 expect/limit). */
  framedVariant?: 'default' | 'why' | 'expect' | 'limit';
};

/** Нумерований список дій у панелі (справжній `<ol>`, не `\n` у plain). */
export type StudyLearnerPanelOrderedListSection = {
  type: 'orderedList';
  labelUk: string;
  items: string[];
  /** Короткий текст після списку. */
  noteUk?: string;
  framed?: boolean;
  framedVariant?: 'default' | 'why' | 'expect' | 'limit';
};

/** Лише текст перевірки; заголовок «QA-перевірка» — у `StudyLearnerPanelQaCheck`. */
export type StudyLearnerPanelQaCheckSection = {
  type: 'qaCheck';
  bodyUk: string;
};

export type StudyLearnerPanelLabeledLinesSection = {
  type: 'labeledLines';
  labelUk: string;
  /** Короткий вступ над парами (наприклад примітка до прикладу). */
  leadUk?: string;
  items: StudyLabeledPair[];
  /** Повноширинна внутрішня картка з читабельними частинами (§19 VLM). */
  panelCard?: boolean;
  framed?: boolean;
  framedVariant?: 'default' | 'why' | 'expect' | 'limit';
};

/** Термін акцентом + пояснення блоком (виконавець кроку, визначення). */
export type StudyLearnerPanelDefinitionAccentSection = {
  type: 'definitionAccent';
  labelUk: string;
  termUk: string;
  termEn?: string;
  leadUk: string;
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
  /** Коли є `parentCardNumber`, не показувати «Картка N» у панелі вкладеного вибору. */
  showNestedCardNumberInPanel?: boolean;
  /** Оформлення блоків `detailSections` (кольори статусу, рамки). */
  pickPanelDetailVariant?: 'outcome';
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

/** Умовний зведений trace у `<details>` (Tool Calling §7). */
export type StudyLearnerPanelCollapsibleTraceSampleSection = {
  type: 'collapsibleTraceSample';
  summaryUk: string;
  jsonExample: string;
  fieldExplanations: StudyLabeledPair[];
  calloutUk: string;
};

/** Короткий вступ панелі інтерактивної картки («Що я зрозумію з цієї картки?»). */
export type StudyLearnerPanelCardIntentSection = {
  type: 'cardIntent';
  bodyUk: string;
  labelUk?: string;
  /** Без підпису «Що я зрозумію…» — лише текст вступу (Reasoning §6). */
  hideLabel?: boolean;
};

export type StudyLearnerPanelSection =
  | StudyLearnerPanelProseSection
  | StudyLearnerPanelMiniCardsSection
  | StudyLearnerPanelTermPairCardsSection
  | StudyLearnerPanelTaxonomySection
  | StudyLearnerPanelMechanismChecksSection
  | StudyLearnerPanelPlainSection
  | StudyLearnerPanelOrderedListSection
  | StudyLearnerPanelQaCheckSection
  | StudyLearnerPanelLabeledLinesSection
  | StudyLearnerPanelDefinitionAccentSection
  | StudyLearnerPanelProcessStepPickSection
  | StudyLearnerPanelModelResponseExampleSection
  | StudyLearnerPanelCollapsibleTraceSampleSection
  | StudyLearnerPanelCourseLessonLinkSection
  | StudyLearnerPanelCardIntentSection;
