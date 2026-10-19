import { parseLessonBold } from './lessonRichText';
import {
  FINE_TUNING_LEARNING_OUTCOME_CARDS,
  FINE_TUNING_LEARNING_OUTCOMES_LEAD_UK,
} from '../../data/study/fine-tuning-learning-outcomes';

/** «Що я зрозумію» для concept-13 Fine-tuning. */
export function StudyFineTuningLearningOutcomes() {
  return (
    <div className="study-fine-tuning-outcomes-block study-fine-tuning-outcomes-quad">
      <p className="study-fine-tuning-outcomes-lead study-learner-explanation">
        {FINE_TUNING_LEARNING_OUTCOMES_LEAD_UK}
      </p>
      <ul className="study-fine-tuning-outcomes-quad-grid" aria-label="Навчальні цілі уроку">
        {FINE_TUNING_LEARNING_OUTCOME_CARDS.map((card, index) => (
          <li key={card.titleUk} className="study-fine-tuning-outcome-card">
            <span className="study-fine-tuning-outcome-badge" aria-hidden="true">{index + 1}</span>
            <h3 className="study-fine-tuning-outcome-card-title">{card.titleUk}</h3>
            <p className="study-fine-tuning-outcome-card-body study-learner-explanation">
              {parseLessonBold(card.bodyUk)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
