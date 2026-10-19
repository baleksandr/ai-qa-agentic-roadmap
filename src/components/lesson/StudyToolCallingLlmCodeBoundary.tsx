import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';
import { StudyLearnerExplanationBlocks } from './StudyLearnerExplanationBlocks';
import { TOOL_CALLING_LLM_CODE_INTRO_UK } from '../../data/study/tool-calling-llm-code-flow';
import {
  TOOL_CALLING_LLM_CODE_FLOW_BUNDLE,
  TOOL_CALLING_LLM_CODE_RISKS_BUNDLE,
  TOOL_CALLING_LLM_CODE_ROLES_BUNDLE,
} from '../../data/study/tool-calling-study-bundles';

/** §4 «Де код, а де LLM?» — шість кроків, дві межі, три ролі. */
export function StudyToolCallingLlmCodeBoundary() {
  return (
    <section
      className="study-tool-calling-llm-code study-rag-pipeline-glossary study-teaching-cards-layout"
      aria-label="Де код, а де LLM"
    >
      <div className="study-rag-story-intro lesson-callout lesson-key-idea">
        <span className="lesson-callout-label">Хто насправді читає звіт</span>
        <StudyLearnerExplanationBlocks bodyUk={TOOL_CALLING_LLM_CODE_INTRO_UK} />
      </div>

      <StudyTeachingCardsSection bundle={TOOL_CALLING_LLM_CODE_FLOW_BUNDLE} />

      <StudyTeachingCardsSection bundle={TOOL_CALLING_LLM_CODE_RISKS_BUNDLE} />

      <StudyTeachingCardsSection
        bundle={TOOL_CALLING_LLM_CODE_ROLES_BUNDLE}
        className="study-tool-calling-llm-code-roles"
      />
    </section>
  );
}
