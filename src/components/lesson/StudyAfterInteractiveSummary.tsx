import type { StudyAfterInteractiveSummary } from '../../data/study/study-teaching-card-types';
import { parseLessonBold } from './lessonRichText';

type Props = {
  summary: StudyAfterInteractiveSummary;
};

/** Статичний підсумок після інтерактивних карток (видно одразу, без вибору). */
export function StudyAfterInteractiveSummary({ summary }: Props) {
  const hasCards = summary.cards.length > 0;
  const hasFootnote = Boolean(summary.footnoteUk?.trim());
  const hasHeading = Boolean(summary.sectionTitleUk?.trim());
  if (!hasCards && !hasFootnote && !hasHeading) return null;

  const isPair = summary.cards.length === 2 || summary.cards.length === 4;
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
      {summary.sectionTitleUk?.trim() ? (
        <h4 className="study-after-interactive-summary-heading">{summary.sectionTitleUk}</h4>
      ) : null}
      {hasCards ? (
      <ul className={gridClass}>
        {summary.cards.map((card, index) => (
          <li
            key={card.titleUk?.trim() ? card.titleUk : `body-${index}`}
            className="study-after-interactive-summary-card"
          >
            {card.titleUk?.trim() ? (
              <h5 className="study-after-interactive-summary-card-title">{card.titleUk}</h5>
            ) : null}
            {card.listLeadUk?.trim() ? (
              <p className="study-after-interactive-summary-card-list-lead study-learner-explanation">
                {parseLessonBold(card.listLeadUk)}
              </p>
            ) : null}
            {card.listItems?.length ? (
              <ul className="study-after-interactive-summary-card-list study-learner-explanation">
                {card.listItems.map((item) => (
                  <li key={item} className="study-after-interactive-summary-card-list-item">
                    {parseLessonBold(item)}
                  </li>
                ))}
              </ul>
            ) : null}
            {card.bodyUk?.trim() ? (
              <p className="study-after-interactive-summary-card-body study-learner-explanation">
                {parseLessonBold(card.bodyUk)}
              </p>
            ) : null}
            {card.noteUk?.trim() ? (
              <p className="study-after-interactive-summary-card-note study-learner-explanation muted small">
                {parseLessonBold(card.noteUk)}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
      ) : null}
      {summary.footnoteUk?.trim() ? (
        <p
          className={
            hasCards
              ? 'study-after-interactive-summary-footnote study-learner-explanation muted small'
              : 'study-after-interactive-summary-solo-body study-learner-explanation'
          }
        >
          {parseLessonBold(summary.footnoteUk)}
        </p>
      ) : null}
    </section>
  );
}
