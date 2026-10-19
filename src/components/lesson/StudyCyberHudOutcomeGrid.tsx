import type { StudyAfterInteractiveSummaryCard } from '../../data/study/study-teaching-card-types';
import { LessonRichParagraphs } from './lessonRichText';

type Props = {
  cards: StudyAfterInteractiveSummaryCard[];
  ariaLabel: string;
  className?: string;
};

/** Статичні навчальні результати — Neon HUD, не клікабельні. */
export function StudyCyberHudOutcomeGrid({ cards, ariaLabel, className = '' }: Props) {
  if (!cards.length) return null;

  return (
    <ul
      className={`study-cyber-hud-outcome-grid${className ? ` ${className}` : ''}`}
      aria-label={ariaLabel}
    >
      {cards.map((card) => (
        <li key={card.titleUk}>
          <article className="study-cyber-hud-outcome-card study-cyber-hud-surface study-cyber-hud-surface--static">
            <h3 className="study-cyber-hud-outcome-card__title">{card.titleUk}</h3>
            {card.bodyUk?.trim() ? (
              <LessonRichParagraphs
                text={card.bodyUk}
                className="study-cyber-hud-outcome-card__body study-learner-explanation"
              />
            ) : null}
          </article>
        </li>
      ))}
    </ul>
  );
}
