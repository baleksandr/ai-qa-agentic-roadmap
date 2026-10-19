import { FUNDAMENTALS_LEARNING_OUTCOMES } from '../../data/study/fundamentals-learning-outcomes';
import { StudyCyberHudOutcomeGrid } from './StudyCyberHudOutcomeGrid';

export function StudyFundamentalsLearningOutcomes() {
  return (
    <StudyCyberHudOutcomeGrid
      cards={FUNDAMENTALS_LEARNING_OUTCOMES.cards}
      ariaLabel="Що я зрозумію після цього уроку"
    />
  );
}
