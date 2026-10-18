import { StudyAfterInteractiveSummary } from './StudyAfterInteractiveSummary';
import { REASONING_LEARNING_OUTCOMES } from '../../data/study/reasoning-learning-outcomes';

export function StudyReasoningLearningOutcomes() {
  return (
    <div className="study-reasoning-outcomes-block study-reasoning-outcomes-trio study-pe-outcomes-cards">
      <StudyAfterInteractiveSummary summary={REASONING_LEARNING_OUTCOMES} />
    </div>
  );
}
