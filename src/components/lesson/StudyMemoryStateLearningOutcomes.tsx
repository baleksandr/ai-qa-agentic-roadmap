import { StudyAfterInteractiveSummary } from './StudyAfterInteractiveSummary';
import { MEMORY_STATE_LEARNING_OUTCOMES } from '../../data/study/memory-state-learning-outcomes';

export function StudyMemoryStateLearningOutcomes() {
  return (
    <div className="study-memory-state-outcomes-block study-reasoning-outcomes-trio study-pe-outcomes-cards">
      <StudyAfterInteractiveSummary summary={MEMORY_STATE_LEARNING_OUTCOMES} />
    </div>
  );
}
