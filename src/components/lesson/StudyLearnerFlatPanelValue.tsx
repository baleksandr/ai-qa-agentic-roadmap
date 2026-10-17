import { isRelationConceptSectionLabel, parseRelationTextToConceptCards } from '../../lib/studyLabeledPanelText';
import { StudyLearnerConceptMiniCards } from './StudyLearnerConceptMiniCards';
import { StudyLearnerExplanationBlocks } from './StudyLearnerExplanationBlocks';

type Props = {
  labelUk: string;
  bodyUk: string;
};

/** Плоский рядок панелі: мінікартки для зв’язків (legacy relationUk); пари «назва — пояснення» — лише через sections / StudyLabeledExplanation. */
export function StudyLearnerFlatPanelValue({ labelUk, bodyUk }: Props) {
  const text = bodyUk.trim();
  if (!text) return null;

  if (isRelationConceptSectionLabel(labelUk)) {
    const cards = parseRelationTextToConceptCards(text);
    if (cards) {
      return <StudyLearnerConceptMiniCards items={cards.items} footnoteUk={cards.footnoteUk} />;
    }
  }

  return <StudyLearnerExplanationBlocks bodyUk={text} />;
}
