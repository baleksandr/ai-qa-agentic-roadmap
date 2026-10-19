import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';
import { MEMORY_STATE_REMEMBER_THESES } from '../../data/study/memory-state-remember';
import { StudyLabeledExplanation } from './StudyLabeledExplanation';
import {
  MEMORY_STATE_FAILURE_BUNDLE,
  MEMORY_STATE_QA_BUNDLE,
  MEMORY_STATE_PRODUCTION_BUNDLE,
  MEMORY_STATE_LLM_CODE_BUNDLE,
  MEMORY_STATE_MECHANISM_BUNDLE,
  MEMORY_STATE_RUN_BUNDLE,
  MEMORY_STATE_SEQUENCE_BUNDLE,
  MEMORY_STATE_WHY_BUNDLE,
} from '../../data/study/memory-state-study-bundles';

const MEMORY_STATE_TEACHING_CLASS = 'study-memory-state-teaching-cards';

export function StudyMemoryStateWhy() {
  return (
    <StudyTeachingCardsSection bundle={MEMORY_STATE_WHY_BUNDLE} className={MEMORY_STATE_TEACHING_CLASS} />
  );
}

export function StudyMemoryStateRun() {
  return (
    <StudyTeachingCardsSection bundle={MEMORY_STATE_RUN_BUNDLE} className={MEMORY_STATE_TEACHING_CLASS} />
  );
}

export function StudyMemoryStateMechanism() {
  return (
    <StudyTeachingCardsSection
      bundle={MEMORY_STATE_MECHANISM_BUNDLE}
      className={MEMORY_STATE_TEACHING_CLASS}
    />
  );
}

export function StudyMemoryStateSequence() {
  return (
    <StudyTeachingCardsSection
      bundle={MEMORY_STATE_SEQUENCE_BUNDLE}
      className={`${MEMORY_STATE_TEACHING_CLASS} study-memory-state-sequence`}
    />
  );
}

export function StudyMemoryStateLlmCode() {
  return (
    <StudyTeachingCardsSection
      bundle={MEMORY_STATE_LLM_CODE_BUNDLE}
      className={`${MEMORY_STATE_TEACHING_CLASS} study-memory-state-llm-code`}
    />
  );
}

export function StudyMemoryStateFailures() {
  return (
    <StudyTeachingCardsSection
      bundle={MEMORY_STATE_FAILURE_BUNDLE}
      className={`${MEMORY_STATE_TEACHING_CLASS} study-memory-state-failure-risks study-memory-state-panel-qa-pick study-reasoning-failure-risks`}
    />
  );
}

export function StudyMemoryStateQaTesting() {
  return (
    <StudyTeachingCardsSection
      bundle={MEMORY_STATE_QA_BUNDLE}
      className={`${MEMORY_STATE_TEACHING_CLASS} study-memory-state-qa-checks study-memory-state-panel-qa-pick study-reasoning-qa-checks study-reasoning-failure-risks`}
    />
  );
}

export function StudyMemoryStateProduction() {
  return (
    <StudyTeachingCardsSection
      bundle={MEMORY_STATE_PRODUCTION_BUNDLE}
      className={`${MEMORY_STATE_TEACHING_CLASS} study-memory-state-production study-reasoning-failure-risks`}
    />
  );
}

export function StudyMemoryStateRememberInterview() {
  return (
    <aside className="lesson-callout lesson-key-idea study-remember-rich study-memory-state-remember">
      <span className="lesson-callout-label">Запам’ятати</span>
      <div className="study-memory-state-remember-theses">
        {MEMORY_STATE_REMEMBER_THESES.map((thesis) => (
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
