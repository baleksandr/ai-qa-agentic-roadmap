import { parseLessonBold } from './lessonRichText';

export const STUDY_PANEL_QA_CHECK_LABEL_UK = 'QA-перевірка';

type Props = {
  bodyUk: string;
  className?: string;
};

/** Окремий підблок перевірки в навчальній панелі (не автопідсвітка «QA» у тексті). */
export function StudyLearnerPanelQaCheck({ bodyUk, className = '' }: Props) {
  const text = bodyUk.trim();
  if (!text) return null;
  return (
    <aside
      className={`study-learner-panel-qa-check ${className}`.trim()}
      aria-label={STUDY_PANEL_QA_CHECK_LABEL_UK}
    >
      <p className="study-learner-panel-qa-check-label">{STUDY_PANEL_QA_CHECK_LABEL_UK}</p>
      <div className="study-learner-panel-qa-check-body study-learner-explanation">
        {parseLessonBold(text)}
      </div>
    </aside>
  );
}
