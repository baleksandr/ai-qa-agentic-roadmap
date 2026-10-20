import {
  MULTI_AGENT_EXAMPLE_BUNDLE,
  MULTI_AGENT_EXAMPLE_INTRO_UK,
  MULTI_AGENT_FAILURES_BUNDLE,
  MULTI_AGENT_FAILURES_INTRO_UK,
  MULTI_AGENT_LLM_CODE_BUNDLE,
  MULTI_AGENT_LLM_CODE_INTRO_UK,
  MULTI_AGENT_WHY_BUNDLE,
  MULTI_AGENT_WHY_INTRO_UK,
} from '../../data/study/multi-agent-study-bundles';
import { MULTI_AGENT_REMEMBER_BULLETS } from '../../data/study/multi-agent-remember';
import { StudyRememberTakeaways } from './StudyRememberTakeaways';
import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';

const MA_TEACHING_CLASS =
  'study-multi-agent-teaching-cards study-agentic-workflows-teaching-cards study-memory-state-teaching-cards study-memory-state-panel-qa-pick';

export function StudyMultiAgentWhy() {
  return (
    <StudyTeachingCardsSection
      bundle={MULTI_AGENT_WHY_BUNDLE}
      className={MA_TEACHING_CLASS}
      compactSectionIntroUk={MULTI_AGENT_WHY_INTRO_UK}
    />
  );
}

export function StudyMultiAgentExample() {
  return (
    <StudyTeachingCardsSection
      bundle={MULTI_AGENT_EXAMPLE_BUNDLE}
      className={MA_TEACHING_CLASS}
      compactSectionIntroUk={MULTI_AGENT_EXAMPLE_INTRO_UK}
    />
  );
}

export function StudyMultiAgentLlmCode() {
  return (
    <StudyTeachingCardsSection
      bundle={MULTI_AGENT_LLM_CODE_BUNDLE}
      className={MA_TEACHING_CLASS}
      compactSectionIntroUk={MULTI_AGENT_LLM_CODE_INTRO_UK}
    />
  );
}

export function StudyMultiAgentFailures() {
  return (
    <StudyTeachingCardsSection
      bundle={MULTI_AGENT_FAILURES_BUNDLE}
      className={MA_TEACHING_CLASS}
      compactSectionIntroUk={MULTI_AGENT_FAILURES_INTRO_UK}
    />
  );
}

export function StudyMultiAgentRememberInterview() {
  return (
    <aside
      className="lesson-callout lesson-key-idea study-remember-rich study-multi-agent-remember study-memory-state-remember"
    >
      <span className="lesson-callout-label">Запам’ятати</span>
      <StudyRememberTakeaways bullets={MULTI_AGENT_REMEMBER_BULLETS} />
    </aside>
  );
}
