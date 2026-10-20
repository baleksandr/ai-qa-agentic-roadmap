import {
  ORCHESTRATION_COMPONENTS_BUNDLE,
  ORCHESTRATION_COMPONENTS_INTRO_UK,
  ORCHESTRATION_FAILURES_BUNDLE,
  ORCHESTRATION_FAILURES_INTRO_UK,
  ORCHESTRATION_INVESTIGATION_BUNDLE,
  ORCHESTRATION_INVESTIGATION_INTRO_UK,
  ORCHESTRATION_LLM_CODE_BUNDLE,
  ORCHESTRATION_LLM_CODE_INTRO_UK,
  ORCHESTRATION_PRODUCTION_BUNDLE,
  ORCHESTRATION_PRODUCTION_INTRO_UK,
  ORCHESTRATION_QA_TESTING_BUNDLE,
  ORCHESTRATION_QA_TESTING_INTRO_UK,
  ORCHESTRATION_SEQUENCE_BUNDLE,
  ORCHESTRATION_SEQUENCE_INTRO_UK,
  ORCHESTRATION_WHY_BUNDLE,
  ORCHESTRATION_WHY_INTRO_UK,
} from '../../data/study/orchestration-study-bundles';
import { ORCHESTRATION_REMEMBER_BULLETS } from '../../data/study/orchestration-remember';
import { StudyRememberTakeaways } from './StudyRememberTakeaways';
import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';
import { StudyTermAccent } from './StudyTermAccent';

const ORCH_TEACHING_CLASS =
  'study-orchestration-teaching-cards study-memory-state-teaching-cards study-memory-state-panel-qa-pick';

export function StudyOrchestrationWhy() {
  return (
    <StudyTeachingCardsSection
      bundle={ORCHESTRATION_WHY_BUNDLE}
      className={ORCH_TEACHING_CLASS}
      compactSectionIntroUk={ORCHESTRATION_WHY_INTRO_UK}
    />
  );
}

export function StudyOrchestrationInvestigation() {
  return (
    <StudyTeachingCardsSection
      bundle={ORCHESTRATION_INVESTIGATION_BUNDLE}
      className={ORCH_TEACHING_CLASS}
      compactSectionIntroUk={ORCHESTRATION_INVESTIGATION_INTRO_UK}
    />
  );
}

export function StudyOrchestrationComponents() {
  return (
    <StudyTeachingCardsSection
      bundle={ORCHESTRATION_COMPONENTS_BUNDLE}
      className={ORCH_TEACHING_CLASS}
      compactSectionIntroUk={ORCHESTRATION_COMPONENTS_INTRO_UK}
    />
  );
}

export function StudyOrchestrationSequence() {
  return (
    <StudyTeachingCardsSection
      bundle={ORCHESTRATION_SEQUENCE_BUNDLE}
      className={ORCH_TEACHING_CLASS}
      compactSectionIntroUk={ORCHESTRATION_SEQUENCE_INTRO_UK}
    />
  );
}

export function StudyOrchestrationLlmCode() {
  return (
    <StudyTeachingCardsSection
      bundle={ORCHESTRATION_LLM_CODE_BUNDLE}
      className={ORCH_TEACHING_CLASS}
      compactSectionIntroUk={ORCHESTRATION_LLM_CODE_INTRO_UK}
    />
  );
}

export function StudyOrchestrationFailures() {
  return (
    <StudyTeachingCardsSection
      bundle={ORCHESTRATION_FAILURES_BUNDLE}
      className={ORCH_TEACHING_CLASS}
      compactSectionIntroUk={ORCHESTRATION_FAILURES_INTRO_UK}
    />
  );
}

export function StudyOrchestrationQaTesting() {
  return (
    <div className="study-orchestration-qa-testing">
      <div className="study-teaching-compact-section-intro study-orchestration-qa-tickets-definition">
        <p className="study-teaching-compact-section-intro-text study-learner-explanation study-learner-panel-block study-learner-panel-block--framed">
          <StudyTermAccent>ABC-123 і ABC-124</StudyTermAccent>
          {' — вигадані номери двох різних тікетів для навчального тесту. За кожним тікетом працює окремий workflow. Номер тікета не замінює ідентифікатор CI запуску: кожне падіння тесту також має бути пов’язане зі своїм запуском.'}
        </p>
      </div>
      <StudyTeachingCardsSection
        bundle={ORCHESTRATION_QA_TESTING_BUNDLE}
        className={ORCH_TEACHING_CLASS}
        compactSectionIntroUk={ORCHESTRATION_QA_TESTING_INTRO_UK}
      />
    </div>
  );
}

export function StudyOrchestrationProduction() {
  return (
    <StudyTeachingCardsSection
      bundle={ORCHESTRATION_PRODUCTION_BUNDLE}
      className={ORCH_TEACHING_CLASS}
      compactSectionIntroUk={ORCHESTRATION_PRODUCTION_INTRO_UK}
    />
  );
}

export function StudyOrchestrationRememberInterview() {
  return (
    <aside
      className="lesson-callout lesson-key-idea study-remember-rich study-orchestration-remember study-memory-state-remember"
    >
      <span className="lesson-callout-label">Запам’ятати</span>
      <StudyRememberTakeaways bullets={ORCHESTRATION_REMEMBER_BULLETS} />
    </aside>
  );
}
