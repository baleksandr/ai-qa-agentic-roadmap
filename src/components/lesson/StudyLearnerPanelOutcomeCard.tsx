import type { StudyLearnerPanelMiniCardTone } from '../../data/study/study-learner-panel-sections';
import { studyOutcomeCardClassName } from '../../lib/studyOutcomeCardTone';
import { LessonRichParagraphs, parseLessonBold } from './lessonRichText';

type Props = {
  titleUk: string;
  bodyUk: string;
  footnoteUk?: string;
  tone?: StudyLearnerPanelMiniCardTone;
};

/** Вкладена картка наслідку / пояснення в панелі уроку (кіберпанк, заголовок над текстом). */
export function StudyLearnerPanelOutcomeCard({ titleUk, bodyUk, footnoteUk, tone }: Props) {
  return (
    <div className={studyOutcomeCardClassName(tone)}>
      <p className="study-outcome-card__title">{titleUk}</p>
      <div className="study-outcome-card__body study-learner-explanation">
        <LessonRichParagraphs text={bodyUk} className="study-outcome-card__body-p" />
        {footnoteUk?.trim() ? (
          <p className="study-outcome-card__footnote muted small">{parseLessonBold(footnoteUk)}</p>
        ) : null}
      </div>
    </div>
  );
}
