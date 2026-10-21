import { parseLessonBold } from './lessonRichText';
import {
  OBSERVABILITY_LEARNING_OUTCOME_CARDS,
  OBSERVABILITY_LEARNING_OUTCOMES_LEAD_UK,
} from '../../data/study/observability-learning-outcomes';

/** «Що я зрозумію» для concept-18 Observability (за зразком Skills). */
export function StudyObservabilityLearningOutcomes() {
  return (
    <div className="study-observability-outcomes-block study-skills-outcomes-block study-skills-outcomes-triple">
      <p className="study-skills-outcomes-lead study-learner-explanation">
        {OBSERVABILITY_LEARNING_OUTCOMES_LEAD_UK}
      </p>
      <ul className="study-skills-outcomes-triple-grid" aria-label="Навчальні цілі уроку">
        {OBSERVABILITY_LEARNING_OUTCOME_CARDS.map((card, index) => (
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
