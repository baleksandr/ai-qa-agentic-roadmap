import { parseLessonBold } from './lessonRichText';
import { StudyCyberHudCard, StudyCyberHudHeroGrid } from './StudyCyberHudCard';
import {
  GUARDRAILS_LEARNING_OUTCOME_STAGES,
  GUARDRAILS_LEARNING_OUTCOMES_LEAD_UK,
  GUARDRAILS_SUMMARY_CARDS,
} from '../../data/study/guardrails-learning-outcomes';

/** «Що я зрозумію» для concept-17 — Neon HUD картки як V/P/E у шапці. */
export function StudyGuardrailsLearningOutcomes() {
  return (
    <div className="study-guardrails-outcomes-block study-multi-agent-outcomes-block study-agentic-workflows-outcomes-block">
      <div className="study-rag-story-intro lesson-callout lesson-key-idea study-agentic-workflows-outcomes-intro">
        <span className="lesson-callout-label">Після уроку</span>
        <div className="study-rag-story-intro-text">
          <p className="study-learner-explanation study-agentic-workflows-outcomes-lead">
            {GUARDRAILS_LEARNING_OUTCOMES_LEAD_UK}
          </p>
        </div>
      </div>
      <StudyCyberHudHeroGrid
        ariaLabel="Пропозиція, schema, policy, approval та QA"
        className="study-guardrails-outcomes-hud-grid"
      >
        {GUARDRAILS_LEARNING_OUTCOME_STAGES.map((stage, index) => (
          <StudyCyberHudCard key={stage.titleUk} badge={String(index + 1)} title={stage.titleUk}>
            {parseLessonBold(stage.bodyUk)}
          </StudyCyberHudCard>
        ))}
      </StudyCyberHudHeroGrid>
      <ul className="study-skills-outcomes-triple-grid study-guardrails-summary-cards" aria-label="Підсумок уроку">
        {GUARDRAILS_SUMMARY_CARDS.map((card, index) => (
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
