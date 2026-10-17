import { useEffect, useMemo, useState } from 'react';
import { chainStageDetailToMarkdown, type ChainStageDetail } from '../../data/study/rag-chain-stage-details';
import { STUDY_EMPTY_PANEL_UK } from '../../lib/studyLearnerCopy';
import { MarkdownBody } from '../MarkdownBody';
import { StudyDetailFlyout } from './StudyDetailFlyout';
import { StudyFlowStageCard } from './StudyFlowStageCard';
import {
  studyInteractiveCardActiveClass,
  studyInteractiveCardSelectionProps,
} from '../../lib/studyInteractiveCardState';
import { StudyPanelTerms } from './StudyPanelTerms';

export type StageDetailLookup = (stage: string, stageIndex: number) => ChainStageDetail | null;

type Props = {
  stages: string[];
  layout?: 'ribbon' | 'cards' | 'auto';
  ariaLabel?: string;
  numbered?: boolean;
  stageDetailLookup?: StageDetailLookup;
  /** Деталі в блоці (як QA) або fullscreen flyout */
  detailPlacement?: 'flyout' | 'inline';
  /** Вертикальний ланцюг кроків — не розтягує картки на всю ширину */
  cardFlow?: 'row' | 'column';
};

export function StudyFlowRibbon({
  stages,
  layout = 'auto',
  ariaLabel = 'Послідовність кроків',
  numbered = true,
  stageDetailLookup,
  detailPlacement = 'flyout',
  cardFlow = 'row',
}: Props) {
  const [flyout, setFlyout] = useState<{ title: string; markdown: string } | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const useCards =
    layout === 'cards' ||
    (layout === 'auto' && stages.some((s) => s.length > 32 || /\[|embed|Documents/i.test(s)));

  const flowColumn = useCards && cardFlow === 'column';

  const firstDetailIndex = useMemo(() => {
    if (!stageDetailLookup) return null;
    const i = stages.findIndex((s, idx) => stageDetailLookup(s, idx));
    return i >= 0 ? i : null;
  }, [stages, stageDetailLookup]);

  useEffect(() => {
    if (detailPlacement !== 'inline' || !stageDetailLookup) return;
    setActiveIndex((prev) => {
      if (prev !== null && stageDetailLookup(stages[prev], prev)) return prev;
      return firstDetailIndex;
    });
  }, [detailPlacement, stageDetailLookup, stages, firstDetailIndex]);

  if (stages.length < 2) return null;

  const openDetail = (stage: string, index: number) => {
    if (!stageDetailLookup) return;
    const d = stageDetailLookup(stage, index);
    if (!d) return;
    if (detailPlacement === 'inline') {
      setActiveIndex(index);
      return;
    }
    setFlyout({
      title: d.titleUk,
      markdown: chainStageDetailToMarkdown(d),
    });
  };

  const activeDetail =
    detailPlacement === 'inline' && activeIndex !== null && stageDetailLookup
      ? stageDetailLookup(stages[activeIndex], activeIndex)
      : null;

  const richCards = useCards && !!stageDetailLookup;

  const flowClass = [
    'study-transfer-flow',
    useCards ? 'study-flow-cards' : '',
    flowColumn ? 'is-column' : '',
    detailPlacement === 'inline' ? 'is-compact' : '',
    richCards ? 'is-rich' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const inner = useCards ? (
    <div className={flowClass} role="list" aria-label={ariaLabel}>
      {stages.map((stage, i) => (
        <div key={`${i}-${stage.slice(0, 24)}`} className="study-transfer-segment" role="listitem">
          {i > 0 && (
            <span className="study-transfer-arrow" aria-hidden="true">
              {flowColumn ? '↓' : '→'}
            </span>
          )}
          {richCards ? (
            <StudyFlowStageCard
              stageLabel={stage}
              index={i}
              total={stages.length}
              detail={stageDetailLookup?.(stage, i) ?? null}
              clickable={!!stageDetailLookup}
              active={detailPlacement === 'inline' && activeIndex === i}
              onOpen={() => openDetail(stage, i)}
              layout={flowColumn && detailPlacement === 'inline' ? 'pipeline' : 'default'}
            />
          ) : (
            <StageCard
              stage={stage}
              index={i}
              total={stages.length}
              numbered={numbered}
              clickable={!!stageDetailLookup}
              active={detailPlacement === 'inline' && activeIndex === i}
              onOpen={() => openDetail(stage, i)}
            />
          )}
        </div>
      ))}
    </div>
  ) : (
    <div className="study-flow-ribbon" role="list" aria-label={ariaLabel}>
      {stages.map((stage, i) => (
        <div key={`${i}-${stage}`} className="study-flow-ribbon-segment" role="listitem">
          {i > 0 && (
            <span className="study-flow-ribbon-chevron" aria-hidden="true">
              <span className="study-flow-ribbon-chevron-icon">→</span>
            </span>
          )}
          <StageRibbonStep
            stage={stage}
            index={i}
            total={stages.length}
            numbered={numbered}
            clickable={!!stageDetailLookup}
            onOpen={() => openDetail(stage, i)}
          />
        </div>
      ))}
    </div>
  );

  if (detailPlacement === 'inline' && stageDetailLookup) {
    return (
      <div className="study-step-detail-layout">
        <div className="study-step-detail-nav study-flow-detail-main">{inner}</div>
        <aside className="study-step-detail-panel study-rag-qa-detail-panel study-flow-detail-panel" aria-live="polite">
          {activeDetail ? (
            <>
              <p className="study-rag-qa-panel-label">Пояснення кроку</p>
              <h4 className="study-rag-qa-panel-title">{activeDetail.titleUk}</h4>
              <div className="study-rag-qa-panel-body markdown-body study-detail-panel-with-terms">
                <MarkdownBody
                  markdown={chainStageDetailToMarkdown(activeDetail, { omitTerms: true })}
                  studyTables
                  studyPanelLabels
                />
                {activeDetail.terms?.length ? <StudyPanelTerms terms={activeDetail.terms} /> : null}
              </div>
            </>
          ) : (
            <p className="study-rag-qa-panel-empty muted small">{STUDY_EMPTY_PANEL_UK}</p>
          )}
        </aside>
      </div>
    );
  }

  return (
    <>
      {inner}
      <StudyDetailFlyout
        open={!!flyout}
        title={flyout?.title ?? ''}
        markdown={flyout?.markdown ?? ''}
        onClose={() => setFlyout(null)}
      />
    </>
  );
}

function StageCard({
  stage,
  index,
  total,
  numbered,
  clickable,
  active,
  onOpen,
}: {
  stage: string;
  index: number;
  total: number;
  numbered: boolean;
  clickable: boolean;
  active?: boolean;
  onOpen: () => void;
}) {
  const className = `study-transfer-card study-interactive-card ${index === 0 ? 'is-input' : index === total - 1 ? 'is-output' : 'is-middle'}${clickable ? ' is-clickable' : ''}${clickable ? studyInteractiveCardActiveClass(active ?? false) : ''}`;
  const content = (
    <>
      {numbered && <span className="study-flow-ribbon-num">{index + 1}</span>}
      <span className="study-transfer-card-kind">{cardKind(index, total)}</span>
      <p className="study-transfer-card-text">{stage}</p>
      {clickable && <span className="study-stage-more">Деталі</span>}
    </>
  );
  if (clickable) {
    return (
      <button
        type="button"
        className={className}
        onClick={onOpen}
        {...studyInteractiveCardSelectionProps(active ?? false)}
      >
        {content}
      </button>
    );
  }
  return <div className={className}>{content}</div>;
}

function StageRibbonStep({
  stage,
  index,
  total,
  numbered,
  clickable,
  onOpen,
}: {
  stage: string;
  index: number;
  total: number;
  numbered: boolean;
  clickable: boolean;
  onOpen: () => void;
}) {
  const className = `study-flow-ribbon-step${index === 0 ? ' is-first' : ''}${index === total - 1 ? ' is-last' : ''}${clickable ? ' is-clickable study-interactive-card' : ''}`;
  const content = (
    <>
      {numbered && <span className="study-flow-ribbon-num">{index + 1}</span>}
      <span className="study-flow-ribbon-label">{stage}</span>
    </>
  );
  if (clickable) {
    return (
      <button type="button" className={className} onClick={onOpen}>
        {content}
      </button>
    );
  }
  return <div className={className}>{content}</div>;
}

function cardKind(index: number, total: number): string {
  if (index === 0) return 'Вхід';
  if (index === total - 1 && total > 2) return 'Результат';
  if (index === total - 1) return 'Вихід';
  return 'Крок';
}
