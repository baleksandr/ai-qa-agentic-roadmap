import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';
import {
  TOOL_CALLING_ONE_FLOW_BUNDLE,
  TOOL_CALLING_ONE_FLOW_SITUATION_UK,
} from '../../data/study/tool-calling-study-bundles';
import { StudyLearnerExplanationBlocks } from './StudyLearnerExplanationBlocks';

const TC_ONE_FLOW_HINT_UK =
  'Натисніть картку, щоб прочитати пояснення поруч. На телефоні воно з’явиться під картками.';

/** §2 «Один виклик tool у run investigation» — шість кроків; крок 6 лише на гілці продовження run. */
export function StudyToolCallingOneFlow() {
  return (
    <section
      className="study-rag-one-query study-tool-calling-one-flow study-rag-pipeline-glossary study-teaching-cards-layout"
      aria-label="Один виклик tool"
    >
      <div className="study-rag-story-intro lesson-callout lesson-key-idea">
        <span className="lesson-callout-label">Вихідна ситуація</span>
        <StudyLearnerExplanationBlocks bodyUk={TOOL_CALLING_ONE_FLOW_SITUATION_UK} />
      </div>
      <p className="study-harness-section-cards-hint study-interaction-hint" role="note">
        <span className="study-interaction-hint-label">Підказка</span>
        <span className="study-interaction-hint-text">{TC_ONE_FLOW_HINT_UK}</span>
      </p>
      <StudyTeachingCardsSection bundle={TOOL_CALLING_ONE_FLOW_BUNDLE} />
    </section>
  );
}
