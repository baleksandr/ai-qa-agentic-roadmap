import { parseLessonBold } from './lessonRichText';
import { StudyTermAccent } from './StudyTermAccent';

type Props = {
  termUk: string;
  explanationUk: string;
  /** За замовчуванням « — »; для QA-рядків передайте « → » через separatorUk. */
  separatorUk?: string;
  className?: string;
};

/** Термін (акцент) + роздільник + пояснення (звичайний текст). Поля даних — без Markdown у назві. */
export function StudyLabeledExplanation({
  termUk,
  explanationUk,
  separatorUk = ' — ',
  className = 'study-learner-labeled-line',
}: Props) {
  return (
    <p className={className}>
      <span className="study-learner-labeled-head">
        <StudyTermAccent>{termUk}</StudyTermAccent>
        <span className="study-learner-label-sep">{separatorUk}</span>
      </span>
      <span className="study-learner-explanation">{parseLessonBold(explanationUk)}</span>
    </p>
  );
}
