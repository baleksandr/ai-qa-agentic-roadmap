import { POLICY_FLOW_SCHEMA_EXPLANATION_UK } from '../../data/study/policy-flow-run-scenario-intro';
import { LessonRichParagraphs } from './lessonRichText';
import { StudyPolicyApprovalFlowDiagram } from './StudyPolicyApprovalFlowDiagram';
import { StudyPolicyVerdictStatusRows } from './StudyPolicyVerdictStatusRows';

/** §8 Production — навчальна схема одного run (policy, approval, executor). */
export function StudyHarnessRunFlowSection() {
  return (
    <section className="study-harness-run-flow" aria-labelledby="harness-run-flow-heading">
      <div
        className="study-teaching-intro-run-card study-rag-story-intro lesson-callout lesson-key-idea study-harness-run-flow-intro"
      >
        <h3 id="harness-run-flow-heading" className="study-obs-heading study-obs-heading-in-callout">
          Схема одного run
        </h3>
        <div className="study-rag-story-intro-text">
          <LessonRichParagraphs
            text={POLICY_FLOW_SCHEMA_EXPLANATION_UK}
            className="study-rag-story-intro-text-p study-learner-explanation"
          />
        </div>
      </div>
      <StudyPolicyVerdictStatusRows className="study-harness-run-flow-verdicts" />
      <StudyPolicyApprovalFlowDiagram />
    </section>
  );
}
