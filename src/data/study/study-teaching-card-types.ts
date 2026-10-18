import type { ChainStageDetail } from './rag-chain-stage-details';
import type { FundamentalsCardPanel, StudyPanelTermEntry } from './fundamentals-card-panels';
import type { StudyModelResponseExample } from './study-learner-panel-sections';

/** Зміст бокової панелі для однієї навчальної картки (без заглушок). */
export type StudyTeachingCardPanel = {
  whatUk: string;
  inputUk: string;
  outputUk: string;
  linkUk: string;
  exampleUk: string;
  failureUk: string;
  testUk: string;
};

export type StudyTeachingCardStep = {
  key: string | number;
  titleUk: string;
  teaserUk: string;
  cardActorUk?: string;
  cardBadgeUk?: string;
  /** Крок ланцюга лише на одній гілці (напр. другий виклик моделі після harness). */
  optionalRouteStep?: boolean;
  detail: ChainStageDetail;
  /** Структурна панель Fundamentals (пріоритет над markdown у detail). */
  fundamentalsPanel?: FundamentalsCardPanel;
};

/** Група понять у лівій колонці (не процесний ланцюг). */
export type StudyTeachingConceptGroup = {
  headingUk: string;
  stepKeys: (string | number)[];
};

export type StudyTeachingCardsPresentation = 'process' | 'concepts';

/** Компактні картки-підсумок після інтерактивного блоку (не клікабельні, без панелі). */
export type StudyAfterInteractiveSummaryCard = {
  titleUk: string;
  bodyUk: string;
  noteUk?: string;
  /** Підпис перед маркованим списком у картці. */
  listLeadUk?: string;
  /** Окремі пункти списку (не в один рядок). */
  listItems?: string[];
};

export type StudyAfterInteractiveSummary = {
  sectionTitleUk: string;
  cards: StudyAfterInteractiveSummaryCard[];
  /** Компактна примітка під усіма картками (на повну ширину блоку). */
  footnoteUk?: string;
};

/** Окрема картка-сценарій над блоком понять (наприклад один agent run). */
export type StudyTeachingIntroScenarioCard = {
  titleUk: string;
  bodyUk: string;
  /** Компактна схема подій (розділювач →). */
  flowLineUk: string;
  noteUk?: string;
};

/** Дві компактні картки під вступом розділу (Reasoning §7). */
export type StudyTeachingIntroMiniCard = {
  titleUk: string;
  bodyUk: string;
};

export type StudyTeachingCourseContinueLink = {
  sentenceUk: string;
  topicId: string;
  linkLabelUk: string;
};

export type StudyTeachingCardsBundle = {
  ariaLabel: string;
  /** Картка «один run» / умовний сценарій під визначенням розділу. */
  introScenarioCard?: StudyTeachingIntroScenarioCard;
  introMiniCards?: StudyTeachingIntroMiniCard[];
  /** Коротка нотатка поруч із introMiniCards (не дублює панелі карток). */
  sectionAsideNoteUk?: string;
  leadUk?: string;
  /** Короткий рядок кроків для компактної схеми зверху (лише presentation `process`). */
  flowArrowLine?: string;
  /** `vertical` — один стовпчик кроків зверху вниз (наприклад §4 tool calling). */
  flowTrackLayout?: 'ribbon' | 'vertical';
  /** Не показувати оглядову схему кроків над картками (дублює інтерактив). */
  hideFlowOverview?: boolean;
  /** Не показувати «Картка N» над заголовком у правій панелі (назва картки лишається в h4). */
  hidePanelMainCardLabel?: boolean;
  /** `concepts` — аспекти теми, без «Крок N з M» і стрілкового процесу. */
  presentation?: StudyTeachingCardsPresentation;
  conceptsHeadingUk?: string;
  conceptGroups?: StudyTeachingConceptGroup[];
  /** Підпис callout над картками; за замовчуванням «Розбір по кроках». */
  introCalloutLabelUk?: string;
  /** @deprecated UI-підказка — лише `StudyPageCardsHint` на рівні сторінки. */
  cardsInteractionHintUk?: string;
  steps: StudyTeachingCardStep[];
  /** Підсумок після карток і панелі (наприклад «Як це перевіряти» у §15). */
  afterInteractiveSummary?: StudyAfterInteractiveSummary;
  /** Умовний приклад даних над картками (§16 structured output тощо). */
  introDataExample?: StudyModelResponseExample;
  /** Перехід до наступної частини маршруту після інтерактиву (одне речення + посилання). */
  courseContinueLink?: StudyTeachingCourseContinueLink;
};

export function teachingPanelToMarkdown(p: StudyTeachingCardPanel): string {
  return [
    `**Простими словами.** ${p.whatUk}`,
    `**Вхід.** ${p.inputUk}`,
    `**Вихід.** ${p.outputUk}`,
    `**Зв’язок у ланцюгу.** ${p.linkUk}`,
    `**Приклад для QA investigation.** ${p.exampleUk}`,
    `**Що може піти не так.** ${p.failureUk}`,
    `**Як помітити під час тестування.** ${p.testUk}`,
  ].join('\n\n');
}

export function teachingPanelToFundamentals(
  p: StudyTeachingCardPanel,
  opts?: { omitInputOutput?: boolean; terms?: StudyPanelTermEntry[] },
): FundamentalsCardPanel {
  const ioParts: string[] = [];
  if (!opts?.omitInputOutput) {
    if (p.inputUk.trim()) ioParts.push(`Вхід: ${p.inputUk}`);
    if (p.outputUk.trim()) ioParts.push(`Вихід: ${p.outputUk}`);
  }
  const io = ioParts.length ? ioParts.join('\n\n') : undefined;
  return {
    whatUk: p.whatUk,
    exampleUk: p.exampleUk,
    relationUk: p.linkUk,
    inputOutputUk: io,
    failureUk: p.failureUk,
    qaUk: p.testUk,
    terms: opts?.terms,
  };
}

export function buildTeachingCardDetail(
  titleUk: string,
  teaserUk: string,
  panel: StudyTeachingCardPanel,
  opts?: {
    cardActorUk?: string;
    cardBadgeUk?: string;
    visualKey?: string;
    terms?: Array<{ label: string; text: string }>;
  },
): ChainStageDetail {
  return {
    titleUk,
    bodyUk: '',
    qaUk: '',
    cardTeaserUk: teaserUk,
    cardActorUk: opts?.cardActorUk,
    cardBadgeUk: opts?.cardBadgeUk,
    visualKey: opts?.visualKey,
    terms: opts?.terms,
    panelMarkdownUk: teachingPanelToMarkdown(panel),
  };
}
