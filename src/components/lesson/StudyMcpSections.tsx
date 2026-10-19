import { MCP_REMEMBER_THESES } from '../../data/study/mcp-remember';
import {
  MCP_COMPONENTS_BUNDLE,
  MCP_COMPONENTS_INTRO_UK,
  MCP_FAILURES_BUNDLE,
  MCP_FAILURES_INTRO_UK,
  MCP_PRODUCTION_BUNDLE,
  MCP_PRODUCTION_INTRO_UK,
  MCP_LLM_CODE_BUNDLE,
  MCP_LLM_CODE_INTRO_UK,
  MCP_SEQUENCE_BUNDLE,
  MCP_SEQUENCE_INTRO_UK,
  MCP_RUN_BUNDLE,
  MCP_RUN_INTRO_UK,
  MCP_WHY_BUNDLE,
  MCP_WHY_INTRO_UK,
} from '../../data/study/mcp-study-bundles';
import { StudyLabeledExplanation } from './StudyLabeledExplanation';
import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';

const MCP_TEACHING_CLASS =
  'study-mcp-teaching-cards study-memory-state-teaching-cards study-memory-state-panel-qa-pick';

export function StudyMcpWhy() {
  return (
    <StudyTeachingCardsSection
      bundle={MCP_WHY_BUNDLE}
      className={MCP_TEACHING_CLASS}
      compactSectionIntroUk={MCP_WHY_INTRO_UK}
    />
  );
}

export function StudyMcpRun() {
  return (
    <StudyTeachingCardsSection
      bundle={MCP_RUN_BUNDLE}
      className={`${MCP_TEACHING_CLASS} study-mcp-run-cards`}
      compactSectionIntroUk={MCP_RUN_INTRO_UK}
    />
  );
}

export function StudyMcpComponents() {
  return (
    <StudyTeachingCardsSection
      bundle={MCP_COMPONENTS_BUNDLE}
      className={`${MCP_TEACHING_CLASS} study-mcp-components-cards`}
      compactSectionIntroUk={MCP_COMPONENTS_INTRO_UK}
    />
  );
}

export function StudyMcpSequence() {
  return (
    <StudyTeachingCardsSection
      bundle={MCP_SEQUENCE_BUNDLE}
      className={`${MCP_TEACHING_CLASS} study-mcp-sequence-cards`}
      compactSectionIntroUk={MCP_SEQUENCE_INTRO_UK}
    />
  );
}

export function StudyMcpLlmCode() {
  return (
    <StudyTeachingCardsSection
      bundle={MCP_LLM_CODE_BUNDLE}
      className={`${MCP_TEACHING_CLASS} study-mcp-llm-code-cards`}
      compactSectionIntroUk={MCP_LLM_CODE_INTRO_UK}
    />
  );
}

export function StudyMcpFailures() {
  return (
    <StudyTeachingCardsSection
      bundle={MCP_FAILURES_BUNDLE}
      className={`${MCP_TEACHING_CLASS} study-mcp-failures-cards`}
      compactSectionIntroUk={MCP_FAILURES_INTRO_UK}
    />
  );
}

export function StudyMcpProduction() {
  return (
    <StudyTeachingCardsSection
      bundle={MCP_PRODUCTION_BUNDLE}
      className={`${MCP_TEACHING_CLASS} study-mcp-production-cards`}
      compactSectionIntroUk={MCP_PRODUCTION_INTRO_UK}
    />
  );
}

export function StudyMcpRememberInterview() {
  return (
    <aside className="lesson-callout lesson-key-idea study-remember-rich study-mcp-remember study-memory-state-remember">
      <span className="lesson-callout-label">Запам’ятати</span>
      <div className="study-memory-state-remember-theses">
        {MCP_REMEMBER_THESES.map((thesis) => (
          <StudyLabeledExplanation
            key={thesis.termUk}
            termUk={thesis.termUk}
            explanationUk={thesis.explanationUk}
            className="study-memory-state-remember-thesis study-learner-labeled-line"
          />
        ))}
      </div>
    </aside>
  );
}
