import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';
import {
  TOOL_CALLING_DATA_TRANSFER_BUNDLE,
  TOOL_CALLING_DATA_TRANSFER_INTRO_UK,
} from '../../data/study/tool-calling-study-bundles';
import { StudyLearnerExplanationBlocks } from './StudyLearnerExplanationBlocks';

const TC_DATA_HINT_UK =
  'Натисніть картку, щоб прочитати пояснення поруч. На телефоні воно з’явиться під картками.';

/** §3 «Які дані передаються під час Tool Calling?» — три поняття, не кроки run. */
export function StudyToolCallingComponents() {
  return (
    <section
      className="study-tool-calling-data-transfer study-rag-pipeline-glossary study-teaching-cards-layout"
      aria-label="Які дані передаються під час Tool Calling"
    >
      <div className="study-rag-story-intro lesson-callout lesson-key-idea">
        <StudyLearnerExplanationBlocks bodyUk={TOOL_CALLING_DATA_TRANSFER_INTRO_UK} />
      </div>
      <p className="study-harness-section-cards-hint study-interaction-hint" role="note">
        <span className="study-interaction-hint-label">Підказка</span>
        <span className="study-interaction-hint-text">{TC_DATA_HINT_UK}</span>
      </p>
      <StudyTeachingCardsSection bundle={TOOL_CALLING_DATA_TRANSFER_BUNDLE} />
    </section>
  );
}
