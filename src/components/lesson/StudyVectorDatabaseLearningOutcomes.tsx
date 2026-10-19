import { parseLessonBold } from './lessonRichText';
import {
  VECTOR_DATABASE_LEARNING_OUTCOME_CARDS,
  VECTOR_DATABASE_LEARNING_OUTCOMES_LEAD_UK,
} from '../../data/study/vector-database-learning-outcomes';

/** «Що я зрозумію» для concept-15 Vector Database. */
export function StudyVectorDatabaseLearningOutcomes() {
  return (
    <div className="study-vector-db-outcomes-block study-vector-db-outcomes-quad">
      <p className="study-vector-db-outcomes-lead study-learner-explanation">
        {VECTOR_DATABASE_LEARNING_OUTCOMES_LEAD_UK}
      </p>
      <ul className="study-vector-db-outcomes-quad-grid" aria-label="Навчальні цілі уроку">
        {VECTOR_DATABASE_LEARNING_OUTCOME_CARDS.map((card, index) => (
          <li key={card.titleUk} className="study-vector-db-outcome-card">
            <span className="study-vector-db-outcome-badge" aria-hidden="true">{index + 1}</span>
            <h3 className="study-vector-db-outcome-card-title">{card.titleUk}</h3>
            <p className="study-vector-db-outcome-card-body study-learner-explanation">
              {parseLessonBold(card.bodyUk)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
