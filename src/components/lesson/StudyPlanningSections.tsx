import {
  PLANNING_COMPONENTS_BUNDLE,
  PLANNING_COMPONENTS_INTRO_UK,
  PLANNING_FAILURES_BUNDLE,
  PLANNING_FAILURES_INTRO_UK,
  PLANNING_LLM_CODE_BUNDLE,
  PLANNING_LLM_CODE_INTRO_UK,
  PLANNING_ONE_RUN_BUNDLE,
  PLANNING_ONE_RUN_INTRO_UK,
  PLANNING_PRODUCTION_BUNDLE,
  PLANNING_PRODUCTION_INTRO_UK,
  PLANNING_WHY_BUNDLE,
  PLANNING_WHY_INTRO_UK,
} from '../../data/study/planning-study-bundles';
import { PLANNING_REMEMBER_BULLETS } from '../../data/study/planning-remember';
import { StudyRememberTakeaways } from './StudyRememberTakeaways';
import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';

const PLANNING_TEACHING_CLASS =
  'study-planning-teaching-cards study-memory-state-teaching-cards study-memory-state-panel-qa-pick';

export function StudyPlanningWhy() {
  return (
    <StudyTeachingCardsSection
      bundle={PLANNING_WHY_BUNDLE}
      className={PLANNING_TEACHING_CLASS}
      compactSectionIntroUk={PLANNING_WHY_INTRO_UK}
    />
  );
}

export function StudyPlanningOneRun() {
  return (
    <StudyTeachingCardsSection
      bundle={PLANNING_ONE_RUN_BUNDLE}
      className={PLANNING_TEACHING_CLASS}
      compactSectionIntroUk={PLANNING_ONE_RUN_INTRO_UK}
    />
  );
}

export function StudyPlanningComponents() {
  return (
    <StudyTeachingCardsSection
      bundle={PLANNING_COMPONENTS_BUNDLE}
      className={PLANNING_TEACHING_CLASS}
      compactSectionIntroUk={PLANNING_COMPONENTS_INTRO_UK}
    />
  );
}

export function StudyPlanningLlmCode() {
  return (
    <StudyTeachingCardsSection
      bundle={PLANNING_LLM_CODE_BUNDLE}
      className={PLANNING_TEACHING_CLASS}
      compactSectionIntroUk={PLANNING_LLM_CODE_INTRO_UK}
    />
  );
}

export function StudyPlanningFailures() {
  return (
    <StudyTeachingCardsSection
      bundle={PLANNING_FAILURES_BUNDLE}
      className={`${PLANNING_TEACHING_CLASS} study-planning-failures-cards`}
      compactSectionIntroUk={PLANNING_FAILURES_INTRO_UK}
    />
  );
}

export function StudyPlanningProduction() {
  return (
    <StudyTeachingCardsSection
      bundle={PLANNING_PRODUCTION_BUNDLE}
      className={`${PLANNING_TEACHING_CLASS} study-planning-production-cards`}
      compactSectionIntroUk={PLANNING_PRODUCTION_INTRO_UK}
    />
  );
}

export function StudyPlanningRememberInterview() {
  return (
    <aside
      className="lesson-callout lesson-key-idea study-remember-rich study-planning-remember study-memory-state-remember"
    >
      <span className="lesson-callout-label">Запам’ятати</span>
      <StudyRememberTakeaways bullets={PLANNING_REMEMBER_BULLETS} />
    </aside>
  );
}
