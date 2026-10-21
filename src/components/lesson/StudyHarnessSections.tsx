import { StudyAfterInteractiveSummary } from './StudyAfterInteractiveSummary';
import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';
import { StudyHarnessFailureModes } from './StudyHarnessFailureModes';
import { StudyHarnessQaTesting } from './StudyHarnessQaTesting';
import {
  HARNESS_COMPONENTS_BUNDLE,
  HARNESS_CYCLE_BUNDLE,
  HARNESS_LLM_CODE_BUNDLE,
  HARNESS_ONE_RUN_BUNDLE,
  HARNESS_PRODUCTION_BUNDLE,
  HARNESS_REMEMBER_SUMMARY,
} from '../../data/study/harness-study-bundles';
import { StudyHarnessRunFlowSection } from './StudyHarnessRunFlowSection';

export function StudyHarnessOneRun() {
  return <StudyTeachingCardsSection bundle={HARNESS_ONE_RUN_BUNDLE} />;
}

export function StudyHarnessComponents() {
  return <StudyTeachingCardsSection bundle={HARNESS_COMPONENTS_BUNDLE} />;
}

export function StudyHarnessCycle() {
  return <StudyTeachingCardsSection bundle={HARNESS_CYCLE_BUNDLE} />;
}

export function StudyHarnessLlmCode() {
  return <StudyTeachingCardsSection bundle={HARNESS_LLM_CODE_BUNDLE} />;
}

export function StudyHarnessQaTestingSection() {
  return <StudyHarnessQaTesting />;
}

export function StudyHarnessProduction() {
  return (
    <div className="study-harness-production">
      <StudyHarnessRunFlowSection />
      <StudyTeachingCardsSection bundle={HARNESS_PRODUCTION_BUNDLE} />
    </div>
  );
}

export function StudyHarnessFailureModesSection() {
  return <StudyHarnessFailureModes />;
}

export function StudyHarnessRememberInterview() {
  return (
    <aside className="lesson-callout lesson-key-idea study-remember-rich study-harness-remember-block">
      <span className="lesson-callout-label">Запам’ятати</span>
      <div className="study-harness-remember-cards study-harness-outcomes-cards">
        <StudyAfterInteractiveSummary summary={HARNESS_REMEMBER_SUMMARY} />
      </div>
    </aside>
  );
}
