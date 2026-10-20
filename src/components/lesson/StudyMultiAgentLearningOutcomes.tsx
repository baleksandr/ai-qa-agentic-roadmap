import { parseLessonBold } from './lessonRichText';
import {
  MULTI_AGENT_LEARNING_OUTCOME_STAGES,
  MULTI_AGENT_LEARNING_OUTCOMES_FOOTNOTE_UK,
  MULTI_AGENT_LEARNING_OUTCOMES_LEAD_UK,
} from '../../data/study/multi-agent-learning-outcomes';

export function StudyMultiAgentLearningOutcomes() {
  return (
    <div className="study-multi-agent-outcomes-block study-agentic-workflows-outcomes-block">
      <div className="study-rag-story-intro lesson-callout lesson-key-idea study-agentic-workflows-outcomes-intro">
        <span className="lesson-callout-label">Після уроку</span>
        <div className="study-rag-story-intro-text">
          <p className="study-learner-explanation study-agentic-workflows-outcomes-lead">
            {MULTI_AGENT_LEARNING_OUTCOMES_LEAD_UK}
          </p>
        </div>
      </div>
      <ul className="study-multi-agent-outcomes-hud-list" aria-label="Етапи Investigation, передачі та Coding">
        {MULTI_AGENT_LEARNING_OUTCOME_STAGES.map((stage) => (
          <li key={stage.titleUk} className="study-neon-hud-outcome-step-card">
            <h3 className="study-neon-hud-outcome-step-title">{stage.titleUk}</h3>
            <p className="study-neon-hud-outcome-step-body study-learner-explanation">
              {parseLessonBold(stage.bodyUk)}
            </p>
          </li>
        ))}
      </ul>
      <p className="study-multi-agent-outcomes-footnote study-neon-hud-outcome-footnote study-learner-explanation">
        {parseLessonBold(MULTI_AGENT_LEARNING_OUTCOMES_FOOTNOTE_UK)}
      </p>
    </div>
  );
}
