import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';
import {
  TOOL_CALLING_DATA_TRANSFER_BUNDLE,
  TOOL_CALLING_DATA_TRANSFER_INTRO_UK,
} from '../../data/study/tool-calling-study-bundles';
import { StudyLearnerExplanationBlocks } from './StudyLearnerExplanationBlocks';

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
      <StudyTeachingCardsSection bundle={TOOL_CALLING_DATA_TRANSFER_BUNDLE} />
    </section>
  );
}
