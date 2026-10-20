import {
  AGENTIC_WORKFLOWS_EXAMPLE_BUNDLE,
  AGENTIC_WORKFLOWS_EXAMPLE_INTRO_UK,
  AGENTIC_WORKFLOWS_FAILURES_BUNDLE,
  AGENTIC_WORKFLOWS_FAILURES_INTRO_UK,
  AGENTIC_WORKFLOWS_PRODUCTION_BUNDLE,
  AGENTIC_WORKFLOWS_PRODUCTION_INTRO_UK,
  AGENTIC_WORKFLOWS_VS_ORCHESTRATION_BUNDLE,
  AGENTIC_WORKFLOWS_VS_ORCHESTRATION_INTRO_UK,
  AGENTIC_WORKFLOWS_WHY_BUNDLE,
  AGENTIC_WORKFLOWS_WHY_INTRO_UK,
} from '../../data/study/agentic-workflows-study-bundles';
import { AGENTIC_WORKFLOWS_REMEMBER_BULLETS } from '../../data/study/agentic-workflows-remember';
import { StudyRememberTakeaways } from './StudyRememberTakeaways';
import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';

const AW_TEACHING_CLASS =
  'study-agentic-workflows-teaching-cards study-memory-state-teaching-cards study-memory-state-panel-qa-pick';

export function StudyAgenticWorkflowsWhy() {
  return (
    <StudyTeachingCardsSection
      bundle={AGENTIC_WORKFLOWS_WHY_BUNDLE}
      className={AW_TEACHING_CLASS}
      compactSectionIntroUk={AGENTIC_WORKFLOWS_WHY_INTRO_UK}
    />
  );
}

export function StudyAgenticWorkflowsExample() {
  return (
    <StudyTeachingCardsSection
      bundle={AGENTIC_WORKFLOWS_EXAMPLE_BUNDLE}
      className={AW_TEACHING_CLASS}
      compactSectionIntroUk={AGENTIC_WORKFLOWS_EXAMPLE_INTRO_UK}
    />
  );
}

export function StudyAgenticWorkflowsVsOrchestration() {
  return (
    <StudyTeachingCardsSection
      bundle={AGENTIC_WORKFLOWS_VS_ORCHESTRATION_BUNDLE}
      className={AW_TEACHING_CLASS}
      compactSectionIntroUk={AGENTIC_WORKFLOWS_VS_ORCHESTRATION_INTRO_UK}
    />
  );
}

export function StudyAgenticWorkflowsFailures() {
  return (
    <StudyTeachingCardsSection
      bundle={AGENTIC_WORKFLOWS_FAILURES_BUNDLE}
      className={AW_TEACHING_CLASS}
      compactSectionIntroUk={AGENTIC_WORKFLOWS_FAILURES_INTRO_UK}
    />
  );
}

export function StudyAgenticWorkflowsProduction() {
  return (
    <StudyTeachingCardsSection
      bundle={AGENTIC_WORKFLOWS_PRODUCTION_BUNDLE}
      className={AW_TEACHING_CLASS}
      compactSectionIntroUk={AGENTIC_WORKFLOWS_PRODUCTION_INTRO_UK}
    />
  );
}

export function StudyAgenticWorkflowsRememberInterview() {
  return (
    <aside
      className="lesson-callout lesson-key-idea study-remember-rich study-agentic-workflows-remember study-memory-state-remember"
    >
      <span className="lesson-callout-label">Запам’ятати</span>
      <StudyRememberTakeaways bullets={AGENTIC_WORKFLOWS_REMEMBER_BULLETS} />
    </aside>
  );
}
