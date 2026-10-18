import { StudyAfterInteractiveSummary } from './StudyAfterInteractiveSummary';
import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';
import { HARNESS_QA_BUNDLE } from '../../data/study/harness-study-bundles';
import { HARNESS_QA_FOCUS_SUMMARY } from '../../data/study/harness-qa-levels';

const HARNESS_QA_INTRO_UK = 'Після падіння login_spec QA перевіряє дві речі.';

/** §7 «Як QA це тестує?» — дві фокусні картки та шість практичних карток. */
export function StudyHarnessQaTesting() {
  return (
    <div className="study-harness-qa study-harness-qa-section study-rag-pipeline-glossary">
      <div className="study-rag-story-intro lesson-callout lesson-key-idea study-harness-qa-focus-intro">
        <span className="lesson-callout-label">Що саме перевіряє QA</span>
        <p className="study-rag-story-intro-text-p study-learner-explanation">{HARNESS_QA_INTRO_UK}</p>
        <div className="study-harness-qa-focus-cards study-harness-outcomes-cards">
          <StudyAfterInteractiveSummary summary={HARNESS_QA_FOCUS_SUMMARY} />
        </div>
      </div>

      <StudyTeachingCardsSection bundle={HARNESS_QA_BUNDLE} />
    </div>
  );
}
