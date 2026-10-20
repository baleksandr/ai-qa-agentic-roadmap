import {
  A2A_FAILURES_BUNDLE,
  A2A_FAILURES_INTRO_UK,
  A2A_LLM_CODE_BUNDLE,
  A2A_LLM_CODE_INTRO_UK,
  A2A_QA_DEV_FLOW_BUNDLE,
  A2A_QA_DEV_FLOW_INTRO_UK,
  A2A_WHY_BUNDLE,
  A2A_WHY_INTRO_UK,
} from '../../data/study/a2a-study-bundles';
import { A2A_REMEMBER_BULLETS } from '../../data/study/a2a-remember';
import { StudyRememberTakeaways } from './StudyRememberTakeaways';
import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';

const A2A_TEACHING_CLASS =
  'study-a2a-teaching-cards study-agentic-workflows-teaching-cards study-memory-state-teaching-cards study-memory-state-panel-qa-pick';

export function StudyA2aWhy() {
  return (
    <StudyTeachingCardsSection
      bundle={A2A_WHY_BUNDLE}
      className={A2A_TEACHING_CLASS}
      compactSectionIntroUk={A2A_WHY_INTRO_UK}
    />
  );
}

export function StudyA2aQaDevFlow() {
  return (
    <StudyTeachingCardsSection
      bundle={A2A_QA_DEV_FLOW_BUNDLE}
      className={A2A_TEACHING_CLASS}
      compactSectionIntroUk={A2A_QA_DEV_FLOW_INTRO_UK}
    />
  );
}

export function StudyA2aLlmCode() {
  return (
    <StudyTeachingCardsSection
      bundle={A2A_LLM_CODE_BUNDLE}
      className={A2A_TEACHING_CLASS}
      compactSectionIntroUk={A2A_LLM_CODE_INTRO_UK}
    />
  );
}

export function StudyA2aFailures() {
  return (
    <StudyTeachingCardsSection
      bundle={A2A_FAILURES_BUNDLE}
      className={A2A_TEACHING_CLASS}
      compactSectionIntroUk={A2A_FAILURES_INTRO_UK}
    />
  );
}

export function StudyA2aRememberInterview() {
  return (
    <aside
      className="lesson-callout lesson-key-idea study-remember-rich study-a2a-remember study-memory-state-remember"
    >
      <span className="lesson-callout-label">Запам’ятати</span>
      <StudyRememberTakeaways bullets={A2A_REMEMBER_BULLETS} />
    </aside>
  );
}
