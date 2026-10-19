import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';
import {
  TOOL_CALLING_ONE_FLOW_BUNDLE,
  TOOL_CALLING_ONE_FLOW_SITUATION_UK,
} from '../../data/study/tool-calling-study-bundles';
import { StudyLearnerExplanationBlocks } from './StudyLearnerExplanationBlocks';

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
      <StudyTeachingCardsSection bundle={TOOL_CALLING_ONE_FLOW_BUNDLE} />
    </section>
  );
}
