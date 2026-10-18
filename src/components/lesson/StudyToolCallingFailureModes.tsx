import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';
import {
  TOOL_CALLING_FAILURE_BUNDLE,
  TOOL_CALLING_FAILURE_INTRO_UK,
} from '../../data/study/tool-calling-study-bundles';
import { StudyLearnerExplanationBlocks } from './StudyLearnerExplanationBlocks';

const TC_FAILURE_HINT_UK =
  'Натисніть картку збою, щоб прочитати пояснення поруч. На телефоні воно з’явиться під картками.';

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
      <p className="study-harness-section-cards-hint study-interaction-hint" role="note">
        <span className="study-interaction-hint-label">Підказка</span>
        <span className="study-interaction-hint-text">{TC_FAILURE_HINT_UK}</span>
      </p>
      <StudyTeachingCardsSection bundle={TOOL_CALLING_FAILURE_BUNDLE} />
    </section>
  );
}
