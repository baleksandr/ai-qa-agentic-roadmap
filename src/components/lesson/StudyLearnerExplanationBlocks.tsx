import type { StudyLabeledPair } from '../../data/study/study-learner-panel-sections';
import { expandStudyExplanationBlocks } from '../../lib/studyLabeledPanelText';
import { LessonRichParagraphs } from './lessonRichText';
import { StudyLabeledExplanationStack } from './StudyLabeledExplanationStack';

type Props = {
  bodyUk: string;
  /** Явні пари після абзаца (пріоритет над авто-розбором хвоста). */
  labeledPairs?: StudyLabeledPair[];
  className?: string;
};

/**
 * Текст панелі + окремі рядки «назва — пояснення» (`StudyLabeledExplanation`).
 * Авто: лише цілий абзац-пара або речення після крапки з короткою назвою (напр. «Агентний run — …»).
 */
export function StudyLearnerExplanationBlocks({ bodyUk, labeledPairs, className }: Props) {
  const expanded = labeledPairs?.length
    ? { mainUk: bodyUk.trim(), labeledPairs }
    : expandStudyExplanationBlocks(bodyUk);

  if (!expanded.mainUk && !expanded.labeledPairs.length) return null;

  return (
    <>
      {expanded.mainUk ? (
        <LessonRichParagraphs
          text={expanded.mainUk}
          className={className ?? 'study-learner-panel-value-p study-learner-explanation'}
        />
      ) : null}
      {expanded.labeledPairs.length > 0 ? (
        <StudyLabeledExplanationStack items={expanded.labeledPairs} />
      ) : null}
    </>
  );
}
