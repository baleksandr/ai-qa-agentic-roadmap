import type { StudyAfterInteractiveSummary } from '../../data/study/study-teaching-card-types';
import { parseLessonBold } from './lessonRichText';

type Props = {
  summary: StudyAfterInteractiveSummary;
};

/** Статичний підсумок після інтерактивних карток (видно одразу, без вибору). */
export function StudyAfterInteractiveSummary({ summary }: Props) {
  if (!summary.cards.length) return null;

  const isPair = summary.cards.length === 2;
  const gridClass = [
    'study-after-interactive-summary-grid',
    isPair ? 'study-after-interactive-summary-grid--pair' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section
      className="study-after-interactive-summary"
      aria-label={summary.sectionTitleUk}
    >
      <h4 className="study-after-interactive-summary-heading">{summary.sectionTitleUk}</h4>
      <ul className={gridClass}>
        {summary.cards.map((card, index) => (
          <li
            key={card.titleUk?.trim() ? card.titleUk : `body-${index}`}
            className="study-after-interactive-summary-card"
          >
            {card.titleUk?.trim() ? (
              <h5 className="study-after-interactive-summary-card-title">{card.titleUk}</h5>
            ) : null}
            <p className="study-after-interactive-summary-card-body study-learner-explanation">
              {parseLessonBold(card.bodyUk)}
            </p>
            {card.noteUk?.trim() ? (
              <p className="study-after-interactive-summary-card-note study-learner-explanation muted small">
                {parseLessonBold(card.noteUk)}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
      {summary.footnoteUk?.trim() ? (
        <p className="study-after-interactive-summary-footnote study-learner-explanation muted small">
          {parseLessonBold(summary.footnoteUk)}
        </p>
      ) : null}
    </section>
  );
}
