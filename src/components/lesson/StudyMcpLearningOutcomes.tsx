import { parseLessonBold } from './lessonRichText';
import {
  MCP_LEARNING_OUTCOME_CARDS,
  MCP_LEARNING_OUTCOMES_LEAD_UK,
} from '../../data/study/mcp-learning-outcomes';

/** «Що я зрозумію» для concept-06 MCP. */
export function StudyMcpLearningOutcomes() {
  return (
    <div className="study-mcp-outcomes-block study-mcp-outcomes-quad">
      <p className="study-mcp-outcomes-lead study-learner-explanation">
        {MCP_LEARNING_OUTCOMES_LEAD_UK}
      </p>
      <ul className="study-mcp-outcomes-quad-grid" aria-label="Навчальні цілі уроку">
        {MCP_LEARNING_OUTCOME_CARDS.map((card, index) => (
          <li key={card.titleUk} className="study-mcp-outcome-card">
            <span className="study-mcp-outcome-badge" aria-hidden="true">{index + 1}</span>
            <h3 className="study-mcp-outcome-card-title">{card.titleUk}</h3>
            <p className="study-mcp-outcome-card-body study-learner-explanation">
              {parseLessonBold(card.bodyUk)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
