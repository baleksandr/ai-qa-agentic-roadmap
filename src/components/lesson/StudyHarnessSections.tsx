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

const HARNESS_CARDS_HINT_UK =
  'Натисніть картку, щоб прочитати пояснення поруч. На телефоні воно з’явиться під картками.';

const HARNESS_CARDS_HINT_MARKUP = (
  <p className="study-harness-section-cards-hint study-interaction-hint" role="note">
    <span className="study-interaction-hint-label">Підказка</span>
    <span className="study-interaction-hint-text">{HARNESS_CARDS_HINT_UK}</span>
  </p>
);

export function StudyHarnessOneRun() {
  return <StudyTeachingCardsSection bundle={HARNESS_ONE_RUN_BUNDLE} />;
}

export function StudyHarnessComponents() {
  return (
    <>
      {HARNESS_CARDS_HINT_MARKUP}
      <StudyTeachingCardsSection bundle={HARNESS_COMPONENTS_BUNDLE} />
    </>
  );
}

export function StudyHarnessCycle() {
  return (
    <>
      {HARNESS_CARDS_HINT_MARKUP}
      <StudyTeachingCardsSection bundle={HARNESS_CYCLE_BUNDLE} />
    </>
  );
}

export function StudyHarnessLlmCode() {
  return (
    <>
      {HARNESS_CARDS_HINT_MARKUP}
      <StudyTeachingCardsSection bundle={HARNESS_LLM_CODE_BUNDLE} />
    </>
  );
}

export function StudyHarnessQaTestingSection() {
  return <StudyHarnessQaTesting />;
}

export function StudyHarnessProduction() {
  return (
    <div className="study-harness-production">
      {HARNESS_CARDS_HINT_MARKUP}
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
