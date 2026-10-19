import type { ChainStageDetail } from '../../data/study/rag-chain-stage-details';
import {
  studyFlowStageActorBadge,
  studyFlowStageGlyphLabel,
  studyFlowStageKindBadge,
} from '../../lib/studyFlowStageCardUi';
import {
  studyInteractiveCardActiveClass,
  studyInteractiveCardSelectionProps,
} from '../../lib/studyInteractiveCardState';
import { StudyInteractiveCardTitle } from './StudyInteractiveCardTitle';

type Props = {
  stageLabel: string;
  index: number;
  total: number;
  detail: ChainStageDetail | null;
  clickable: boolean;
  active?: boolean;
  onOpen: () => void;
  /** Компактні картки в лівій колонці §3 (RAG pipeline, tool calling). */
  layout?: 'default' | 'pipeline';
  /** Повний короткий опис з уроку (не обрізати; пріоритет над cardTeaserUk). */
  listTeaserUk?: string;
  /** Якщо немає ChainStageDetail (QA, guardrails hint тощо). */
  navBadgeUk?: string;
  navActorUk?: string;
  /** У режимі понять — без номера «кроку» на картці. */
  showStepNumber?: boolean;
  /** Ієрархічний номер картки (1, 2, 3.1 …) перед назвою. */
  cardNumberUk?: string;
  /** Компактна навігація: лише назва, без підпису, CTA і номера. */
  compactNav?: boolean;
};

function stepKind(index: number, total: number): string {
  if (index === 0) return 'Вхід';
  if (index === total - 1 && total > 2) return 'Результат';
  if (index === total - 1) return 'Вихід';
  return 'Крок';
}

function visualKeyFromStage(stage: string, detail: ChainStageDetail | null): string {
  if (detail?.visualKey) return detail.visualKey;
  const s = stage.toLowerCase();
  if (s.includes('document')) return 'documents';
  if (s.includes('parse')) return 'parse';
  if (s.includes('chunk')) return 'chunks';
  if (s.includes('embed') || s.includes('index')) return 'embed';
  if (s.includes('searchable')) return 'store';
  if (s.includes('запит') || s === 'query') return 'query';
  if (s.includes('retriever')) return 'retrieve';
  if (s.includes('hit')) return 'hits';
  if (s.includes('filter') || s.includes('метадан')) return 'filter';
  if (s.includes('context') || s.includes('evidence')) return 'context';
  if (s.includes('api') || s.includes('модел') || s.includes('відповідь')) return 'llm';
  return 'step';
}

export function StudyFlowStageCard({
  stageLabel,
  index,
  total,
  detail,
  clickable,
  active,
  onOpen,
  layout = 'default',
  listTeaserUk,
  navBadgeUk,
  navActorUk,
  showStepNumber = true,
  cardNumberUk,
  compactNav = false,
}: Props) {
  const showCardNumber = Boolean(cardNumberUk?.trim());
  const autoKind = stepKind(index, total);
  const kind = compactNav
    ? null
    : studyFlowStageKindBadge(navBadgeUk, detail?.cardBadgeUk, autoKind, showCardNumber);
  const title = detail?.titleUk ?? stageLabel;
  const teaser = compactNav
    ? listTeaserUk?.trim() || ''
    : listTeaserUk?.trim() ||
      detail?.cardTeaserUk ||
      (detail?.outputUk ? detail.outputUk.replace(/\*\*/g, '') : stageLabel);
  const showNavFoot = compactNav
    ? Boolean(clickable && teaser?.trim())
    : Boolean(teaser?.trim() || clickable);
  const actor = compactNav
    ? null
    : studyFlowStageActorBadge(navActorUk, detail?.cardActorUk, showCardNumber);
  const showMetaBadges = !compactNav && Boolean(kind?.trim() || actor?.trim());
  const visual = visualKeyFromStage(stageLabel, detail);
  const glyphLabel = compactNav ? null : studyFlowStageGlyphLabel(visual, showCardNumber);
  const position =
    index === 0 ? 'is-input' : index === total - 1 ? 'is-output' : 'is-middle';

  const className = [
    'study-flow-stage-card',
    `study-flow-stage-card--${visual}`,
    position,
    showCardNumber ? 'has-card-number' : '',
    layout === 'pipeline' ? 'is-pipeline-compact' : '',
    layout === 'pipeline' && !glyphLabel ? 'is-pipeline-no-glyph' : '',
    compactNav ? 'is-compact-nav' : '',
    clickable ? 'is-clickable study-interactive-card' : '',
    clickable ? studyInteractiveCardActiveClass(active ?? false) : '',
  ]
    .filter(Boolean)
    .join(' ');

  const cardNumberBadge = showCardNumber ? (
    <span className="study-card-number" aria-hidden="true">{cardNumberUk}</span>
  ) : null;

  const inner =
    layout === 'pipeline' ? (
      <>
        {cardNumberBadge}
        <div className="study-flow-stage-card-top study-flow-stage-card-top--pipeline">
          {glyphLabel ? (
            <span className={`study-flow-stage-glyph study-flow-stage-glyph--${visual}`} aria-hidden="true">
              {glyphLabel}
            </span>
          ) : null}
          <div className="study-flow-stage-card-meta study-flow-stage-card-meta--pipeline">
            <StudyInteractiveCardTitle as="h5" className="study-flow-stage-title">
              {title}
            </StudyInteractiveCardTitle>
            {showMetaBadges ? (
              <div className="study-flow-stage-card-badges">
                {kind ? <span className="study-flow-stage-kind">{kind}</span> : null}
                {actor ? (
                  <span className={`study-flow-stage-actor${actor === 'LLM' ? ' is-llm' : ''}`}>{actor}</span>
                ) : null}
              </div>
            ) : null}
          </div>
          {showStepNumber && !showCardNumber ? (
            <span className="study-flow-stage-num" aria-label={`Крок ${index + 1}`}>
              {index + 1}
            </span>
          ) : null}
        </div>
        {showNavFoot ? (
          <div className="study-flow-stage-card-foot">
            {teaser?.trim() ? <p className="study-flow-stage-teaser">{teaser}</p> : null}
            {clickable && (
              <span className="study-flow-stage-cta">
                Деталі
                <span className="study-flow-stage-cta-arrow" aria-hidden="true">→</span>
              </span>
            )}
          </div>
        ) : null}
      </>
    ) : (
      <>
        {cardNumberBadge}
        <div className="study-flow-stage-card-top">
          {glyphLabel ? (
            <span className={`study-flow-stage-glyph study-flow-stage-glyph--${visual}`} aria-hidden="true">
              {glyphLabel}
            </span>
          ) : null}
          <div className="study-flow-stage-card-meta">
            {showMetaBadges ? (
              <div className="study-flow-stage-card-badges">
                {kind ? <span className="study-flow-stage-kind">{kind}</span> : null}
                {actor ? (
                  <span className={`study-flow-stage-actor${actor === 'LLM' ? ' is-llm' : ''}`}>{actor}</span>
                ) : null}
              </div>
            ) : null}
            {showStepNumber ? (
              <span className="study-flow-stage-num" aria-label={`Крок ${index + 1}`}>
                {index + 1}
              </span>
            ) : null}
          </div>
        </div>
        <StudyInteractiveCardTitle as="h5" className="study-flow-stage-title">
          {title}
        </StudyInteractiveCardTitle>
        <p className="study-flow-stage-teaser">{teaser}</p>
        {clickable && (
          <span className="study-flow-stage-cta">
            Деталі
            <span className="study-flow-stage-cta-arrow" aria-hidden="true">→</span>
          </span>
        )}
      </>
    );

  const stepNavAriaLabel =
    compactNav && showCardNumber && title.trim()
      ? `Картка ${cardNumberUk}. ${title}`
      : undefined;

  if (clickable) {
    return (
      <button
        type="button"
        className={className}
        onClick={onOpen}
        aria-label={stepNavAriaLabel}
        {...studyInteractiveCardSelectionProps(active ?? false)}
      >
        {active ? (
          <span className="sr-only">
            {showStepNumber
              ? 'Обраний крок, пояснення в панелі поруч'
              : 'Обрана картка, пояснення в панелі поруч'}
          </span>
        ) : null}
        {inner}
      </button>
    );
  }
  return <div className={className}>{inner}</div>;
}
