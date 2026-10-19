import { FINE_TUNING_REMEMBER_BULLETS } from '../../data/study/fine-tuning-remember';
import {
  FINE_TUNING_COMPONENTS_BUNDLE,
  FINE_TUNING_COMPONENTS_INTRO_UK,
  FINE_TUNING_FAILURES_BUNDLE,
  FINE_TUNING_FAILURES_INTRO_UK,
  FINE_TUNING_LLM_CODE_BUNDLE,
  FINE_TUNING_LLM_CODE_INTRO_UK,
  FINE_TUNING_LOGIN_SPEC_BUNDLE,
  FINE_TUNING_LOGIN_SPEC_INTRO_UK,
  FINE_TUNING_PRODUCTION_BUNDLE,
  FINE_TUNING_PRODUCTION_INTRO_UK,
  FINE_TUNING_WHY_BUNDLE,
  FINE_TUNING_WHY_INTRO_UK,
} from '../../data/study/fine-tuning-study-bundles';
import { StudyRememberTakeaways } from './StudyRememberTakeaways';
import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';

const FINE_TUNING_TEACHING_CLASS =
  'study-fine-tuning-teaching-cards study-memory-state-teaching-cards study-memory-state-panel-qa-pick';

export function StudyFineTuningWhy() {
  return (
    <StudyTeachingCardsSection
      bundle={FINE_TUNING_WHY_BUNDLE}
      className={`${FINE_TUNING_TEACHING_CLASS} study-fine-tuning-why-cards`}
      compactSectionIntroUk={FINE_TUNING_WHY_INTRO_UK}
    />
  );
}

export function StudyFineTuningComponents() {
  return (
    <StudyTeachingCardsSection
      bundle={FINE_TUNING_COMPONENTS_BUNDLE}
      className={`${FINE_TUNING_TEACHING_CLASS} study-fine-tuning-components-cards`}
      compactSectionIntroUk={FINE_TUNING_COMPONENTS_INTRO_UK}
    />
  );
}

export function StudyFineTuningLoginSpecExample() {
  return (
    <StudyTeachingCardsSection
      bundle={FINE_TUNING_LOGIN_SPEC_BUNDLE}
      className={`${FINE_TUNING_TEACHING_CLASS} study-fine-tuning-login-spec-cards`}
      compactSectionIntroUk={FINE_TUNING_LOGIN_SPEC_INTRO_UK}
    />
  );
}

export function StudyFineTuningLlmCode() {
  return (
    <StudyTeachingCardsSection
      bundle={FINE_TUNING_LLM_CODE_BUNDLE}
      className={`${FINE_TUNING_TEACHING_CLASS} study-fine-tuning-llm-code-cards`}
      compactSectionIntroUk={FINE_TUNING_LLM_CODE_INTRO_UK}
    />
  );
}

export function StudyFineTuningFailures() {
  return (
    <StudyTeachingCardsSection
      bundle={FINE_TUNING_FAILURES_BUNDLE}
      className={`${FINE_TUNING_TEACHING_CLASS} study-fine-tuning-failures-cards`}
      compactSectionIntroUk={FINE_TUNING_FAILURES_INTRO_UK}
    />
  );
}

export function StudyFineTuningProduction() {
  return (
    <StudyTeachingCardsSection
      bundle={FINE_TUNING_PRODUCTION_BUNDLE}
      className={`${FINE_TUNING_TEACHING_CLASS} study-fine-tuning-production-cards`}
      compactSectionIntroUk={FINE_TUNING_PRODUCTION_INTRO_UK}
    />
  );
}

export function StudyFineTuningRememberInterview() {
  return (
    <aside
      className="lesson-callout lesson-key-idea study-remember-rich study-fine-tuning-remember study-memory-state-remember"
    >
      <span className="lesson-callout-label">Запам’ятати</span>
      <StudyRememberTakeaways bullets={FINE_TUNING_REMEMBER_BULLETS} />
    </aside>
  );
}
