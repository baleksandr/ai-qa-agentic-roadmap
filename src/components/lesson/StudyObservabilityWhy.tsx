import {
  OBSERVABILITY_WHY_FLOW_CAPTION_UK,
  OBSERVABILITY_WHY_FLOW_STAGES,
  OBSERVABILITY_WHY_SECTION_INTRO_UK,
} from '../../data/study/observability-why-section';
import { StudyLearnerFlowTrack } from './StudyLearnerFlowTrack';
import { LessonRichParagraphs } from './lessonRichText';

/** §1 «Навіщо observability?» — concept-18: схема з підписом (картки — у outcomes). */
export function StudyObservabilityWhy() {
  return (
    <div className="study-observability-why">
      <LessonRichParagraphs
        text={OBSERVABILITY_WHY_SECTION_INTRO_UK}
        className="study-skills-outcomes-lead study-learner-explanation"
      />
      <div className="study-observability-why-flow">
        <StudyLearnerFlowTrack
          stages={OBSERVABILITY_WHY_FLOW_STAGES}
          ariaLabel="Від запуску до розбору on-call"
          firstRowCount={3}
        />
        <p className="study-observability-why-flow-caption study-learner-explanation muted small">
          {OBSERVABILITY_WHY_FLOW_CAPTION_UK}
        </p>
      </div>
    </div>
  );
}
