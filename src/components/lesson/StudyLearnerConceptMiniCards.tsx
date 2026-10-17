import { LessonRichParagraphs } from './lessonRichText';
import { StudyLabeledExplanation } from './StudyLabeledExplanation';

type Item = { termUk: string; bodyUk: string };

type Props = {
  items: Item[];
  footnoteUk?: string;
  listClassName?: string;
};

/** Мінікартки «термін — пояснення» (зв’язок понять, приклади). */
export function StudyLearnerConceptMiniCards({
  items,
  footnoteUk,
  listClassName = 'study-learner-panel-mini-list',
}: Props) {
  return (
    <div className="study-learner-panel-mini-wrap">
      <ul className={listClassName}>
        {items.map((item) => (
          <li key={item.termUk} className="study-learner-panel-mini-card">
            <StudyLabeledExplanation termUk={item.termUk} explanationUk={item.bodyUk} />
          </li>
        ))}
      </ul>
      {footnoteUk?.trim() ? (
        <LessonRichParagraphs
          text={footnoteUk}
          className="study-learner-panel-footnote study-learner-explanation muted small"
        />
      ) : null}
    </div>
  );
}
