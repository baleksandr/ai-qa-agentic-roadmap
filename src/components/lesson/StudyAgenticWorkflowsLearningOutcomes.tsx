import { parseLessonBold } from './lessonRichText';
import {
  AGENTIC_WORKFLOWS_LEARNING_OUTCOME_CARDS,
  AGENTIC_WORKFLOWS_LEARNING_OUTCOMES_LEAD_UK,
} from '../../data/study/agentic-workflows-learning-outcomes';

/** «Що я зрозумію» для concept-16 Agentic Workflows. */
export function StudyAgenticWorkflowsLearningOutcomes() {
  return (
    <div className="study-agentic-workflows-outcomes-block study-skills-outcomes-block">
      <div className="study-rag-story-intro lesson-callout lesson-key-idea study-agentic-workflows-outcomes-intro">
        <span className="lesson-callout-label">Після уроку</span>
        <div className="study-rag-story-intro-text">
          <p className="study-learner-explanation study-agentic-workflows-outcomes-lead">
            {AGENTIC_WORKFLOWS_LEARNING_OUTCOMES_LEAD_UK}
          </p>
        </div>
      </div>
      <ul
        className="study-skills-outcomes-triple-grid study-skills-outcomes-quad-grid"
        aria-label="Навчальні цілі уроку"
      >
        {AGENTIC_WORKFLOWS_LEARNING_OUTCOME_CARDS.map((card, index) => (
          <li key={card.titleUk} className="study-skills-outcome-card">
            <span className="study-skills-outcome-badge" aria-hidden="true">{index + 1}</span>
            <h3 className="study-skills-outcome-card-title">{card.titleUk}</h3>
            <p className="study-skills-outcome-card-body study-learner-explanation">
              {parseLessonBold(card.bodyUk)}
            </p>
            {card.noteUk?.trim() ? (
              <p className="study-skills-outcome-card-note muted small study-learner-explanation">
                {parseLessonBold(card.noteUk)}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
