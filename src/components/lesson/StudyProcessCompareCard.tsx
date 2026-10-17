import type { ProcessCompareCard } from '../../data/study/study-process-compare-types';
import {
  studyInteractiveCardActiveClass,
  studyInteractiveCardSelectionProps,
} from '../../lib/studyInteractiveCardState';
import { StudyInteractiveCardTitle } from './StudyInteractiveCardTitle';

type Props = {
  card: ProcessCompareCard;
  active: boolean;
  onSelect: () => void;
};

export function StudyProcessCompareCard({ card, active, onSelect }: Props) {
  return (
    <button
      type="button"
      className={`study-process-compare-card study-process-compare-card--${card.tier} study-interactive-card${studyInteractiveCardActiveClass(active)}`}
      {...studyInteractiveCardSelectionProps(active)}
      onClick={onSelect}
    >
      <header className="study-process-compare-card-head">
        <StudyInteractiveCardTitle as="h4" className="study-process-compare-card-title">
          {card.titleUk}
        </StudyInteractiveCardTitle>
        {card.subtitleUk ? (
          <p className="study-process-compare-card-sub muted small">{card.subtitleUk}</p>
        ) : null}
      </header>
      {card.steps.length > 0 ? (
        <ol className="study-process-compare-card-steps">
          {card.steps.map((step) => (
            <li key={step.labelUk}>
              <span className="study-process-compare-step-label">{step.labelUk}</span>
              <span className="study-process-compare-step-text">{step.textUk}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="study-process-compare-card-teaser-only">{card.teaserUk}</p>
      )}
      {card.hallmarkUk?.trim() ? (
        <p className="study-process-compare-card-hallmark">
          <span className="study-process-compare-hallmark-label">Ключова ознака:</span>
          {card.hallmarkUk}
        </p>
      ) : null}
    </button>
  );
}
