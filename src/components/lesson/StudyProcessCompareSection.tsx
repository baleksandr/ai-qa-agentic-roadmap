import { useMemo, useState } from 'react';
import type { StudyProcessCompareBundle } from '../../data/study/study-process-compare-types';
import { StudyLearnerPanelBody } from './StudyLearnerPanelBody';
import { StudyProcessCompareCard } from './StudyProcessCompareCard';
import { StudySectionCardsInteractionHint } from './StudySectionCardsInteractionHint';

type Props = {
  bundle: StudyProcessCompareBundle;
};

/** Порівняння двох (і більше) процесів: картки з видимими кроками + панель деталей. */
export function StudyProcessCompareSection({ bundle }: Props) {
  const primary = useMemo(() => bundle.cards.filter((c) => c.tier === 'primary'), [bundle.cards]);
  const secondary = useMemo(() => bundle.cards.filter((c) => c.tier === 'secondary'), [bundle.cards]);
  const [activeKey, setActiveKey] = useState(bundle.cards[0]?.key ?? '');
  const active = bundle.cards.find((c) => c.key === activeKey) ?? bundle.cards[0];
  const activeCardIndex = bundle.cards.findIndex((c) => c.key === activeKey);
  const parentCardNumber =
    activeCardIndex >= 0 ? String(activeCardIndex + 1) : undefined;

  return (
    <section className="study-teaching-cards study-process-compare" aria-label={bundle.ariaLabel}>
      {bundle.questionUk ? (
        <div className="study-process-compare-scenario lesson-callout lesson-key-idea" role="note">
          <span className="lesson-callout-label">Спільний сценарій</span>
          <p className="study-process-compare-question study-learner-explanation">{bundle.questionUk}</p>
        </div>
      ) : null}

      {!bundle.hideSectionCardsInteractionHint ? (
        <StudySectionCardsInteractionHint>
          {bundle.sectionCardsInteractionHintUk}
        </StudySectionCardsInteractionHint>
      ) : null}

      <div className="study-process-compare-primary-grid" role="group" aria-label="Основні режими">
        {primary.map((card) => (
          <StudyProcessCompareCard
            key={card.key}
            card={card}
            active={activeKey === card.key}
            onSelect={() => setActiveKey(card.key)}
          />
        ))}
      </div>

      {secondary.length > 0 ? (
        <div className="study-process-compare-secondary-grid" role="group" aria-label="Уточнення">
          {secondary.map((card) => (
            <StudyProcessCompareCard
              key={card.key}
              card={card}
              active={activeKey === card.key}
              onSelect={() => setActiveKey(card.key)}
            />
          ))}
        </div>
      ) : null}

      {active ? (
        <aside
          className="study-process-compare-panel study-rag-qa-detail-panel study-step-detail-panel"
          aria-live="polite"
          aria-label={`Деталі: ${active.titleUk}`}
        >
          <h4 className="study-rag-qa-panel-title">{active.titleUk}</h4>
          {!active.panel.sections?.length && active.teaserUk ? (
            <p className="study-tc-lesson-line">{active.teaserUk}</p>
          ) : null}
          <div className="study-rag-qa-panel-body">
            <StudyLearnerPanelBody panel={active.panel} parentCardNumber={parentCardNumber} />
          </div>
        </aside>
      ) : null}

      {bundle.footerUk ? (
        <p className="study-process-compare-footer lesson-p">{bundle.footerUk}</p>
      ) : null}
    </section>
  );
}
