import { parseLessonBold } from './lessonRichText';
import { StudyTermAccent } from './StudyTermAccent';

type Props = {
  termUk: string;
  termEn?: string;
  leadUk: string;
};

/**
 * Блокове визначення: термін окремим рядком, пояснення нижче (без тире між ними).
 * Для «термін — пояснення» в одному рядку — `StudyLabeledExplanation` / `StudyLearnerKeyPhraseLine`.
 */
export function StudyDefinitionAccent({ termUk, termEn, leadUk }: Props) {
  const ariaLabel = termEn ? `Визначення: ${termUk}, ${termEn}` : `Визначення: ${termUk}`;

  return (
    <aside className="study-definition-accent" aria-label={ariaLabel}>
      <span className="study-definition-accent-marker" aria-hidden="true">◇</span>
      <div className="study-definition-accent-body">
        <div className="study-definition-accent-lead">
          <p className="study-definition-accent-term">
            <StudyTermAccent>{termUk}</StudyTermAccent>
            {termEn?.trim() ? (
              <span className="study-definition-accent-term-en" lang="en">
                {' '}
                <span className="muted">({termEn.trim()})</span>
              </span>
            ) : null}
          </p>
          <p className="study-definition-accent-definition study-learner-explanation">
            {parseLessonBold(leadUk)}
          </p>
        </div>
      </div>
    </aside>
  );
}
