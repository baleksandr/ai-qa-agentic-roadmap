import { StudyAfterInteractiveSummary } from './StudyAfterInteractiveSummary';
import { PROMPT_ENGINEERING_LEARNING_OUTCOMES } from '../../data/study/prompt-engineering-learning-outcomes';

/** «Що я зрозумію» для concept-14 — чотири статичні картки без markdown-абзацу. */
export function StudyPromptEngineeringLearningOutcomes() {
  return (
    <div className="study-pe-outcomes-block study-pe-outcomes-cards">
      <StudyAfterInteractiveSummary summary={PROMPT_ENGINEERING_LEARNING_OUTCOMES} />
    </div>
  );
}
