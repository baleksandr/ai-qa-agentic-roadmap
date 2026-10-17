import type { PhraseParagraphItem } from '../../types/lessonBlocks';
import { StudyLabeledExplanation } from './StudyLabeledExplanation';

/** Markdown / JSON: явна пара «фраза — пояснення» (`:::study-key-phrase`, phraseParagraphs). */
export function StudyLearnerKeyPhraseLine({ phraseUk, detailUk }: PhraseParagraphItem) {
  return (
    <StudyLabeledExplanation
      termUk={phraseUk}
      explanationUk={detailUk}
      className="lesson-p study-learner-phrase-p study-learner-labeled-line"
    />
  );
}
