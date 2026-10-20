import { parseLessonBold } from './lessonRichText';
import {
  ORCHESTRATION_LEARNING_OUTCOME_CARDS,
  ORCHESTRATION_LEARNING_OUTCOMES_LEAD_UK,
} from '../../data/study/orchestration-learning-outcomes';

/** «Що я зрозумію» для concept-02 Orchestration. */
export function StudyOrchestrationLearningOutcomes() {
  return (
    <div className="study-orchestration-outcomes-block study-skills-outcomes-block">
      <p className="study-skills-outcomes-lead study-learner-explanation">
        {ORCHESTRATION_LEARNING_OUTCOMES_LEAD_UK}
      </p>
      <ul
        className="study-skills-outcomes-triple-grid study-skills-outcomes-quad-grid"
        aria-label="Навчальні цілі уроку"
      >
        {ORCHESTRATION_LEARNING_OUTCOME_CARDS.map((card, index) => (
          <li key={card.titleUk} className="study-skills-outcome-card">
            <span className="study-skills-outcome-badge" aria-hidden="true">{index + 1}</span>
            <h3 className="study-skills-outcome-card-title">{card.titleUk}</h3>
            <p className="study-skills-outcome-card-body study-learner-explanation">
              {parseLessonBold(card.bodyUk)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
