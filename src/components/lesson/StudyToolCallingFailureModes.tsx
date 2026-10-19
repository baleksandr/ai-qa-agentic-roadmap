import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';
import {
  TOOL_CALLING_FAILURE_BUNDLE,
  TOOL_CALLING_FAILURE_INTRO_UK,
} from '../../data/study/tool-calling-study-bundles';
import { StudyLearnerExplanationBlocks } from './StudyLearnerExplanationBlocks';

/** §5 «Де може зламатися?» — сім інтерактивних карток із структурованими панелями. */
export function StudyToolCallingFailureModes() {
  return (
    <section
      className="study-tool-calling-failures study-rag-pipeline-glossary study-teaching-cards-layout"
      aria-label="Де може зламатися tool calling"
    >
      <div className="study-rag-story-intro lesson-callout lesson-key-idea">
        <span className="lesson-callout-label">Сім місць, де виклик інструмента може піти не так</span>
        <StudyLearnerExplanationBlocks bodyUk={TOOL_CALLING_FAILURE_INTRO_UK} />
      </div>
      <StudyTeachingCardsSection bundle={TOOL_CALLING_FAILURE_BUNDLE} />
    </section>
  );
}
