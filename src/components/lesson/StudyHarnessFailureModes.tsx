import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';
import { HARNESS_FAILURE_BUNDLE } from '../../data/study/harness-study-bundles';

/** §6 «Де може зламатися?» — чотири ризики з панелями (не кроки run). */
export function StudyHarnessFailureModes() {
  return (
    <div className="study-harness-failures-block">
      <StudyTeachingCardsSection bundle={HARNESS_FAILURE_BUNDLE} />
    </div>
  );
}
