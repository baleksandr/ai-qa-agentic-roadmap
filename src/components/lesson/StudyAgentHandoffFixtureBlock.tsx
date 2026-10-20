import type { StudyAgentHandoffFixtureBlock as HandoffFixtureData } from '../../data/study/study-learner-panel-sections';
import { StudyLabeledExplanation } from './StudyLabeledExplanation';

type Props = {
  block: HandoffFixtureData;
};

/** Умовний результат Agent A для handoff (concept-16 §4). */
export function StudyAgentHandoffFixtureBlock({ block }: Props) {
  return (
    <section
      className="study-agent-handoff-fixture study-learner-panel-block--framed"
      aria-label={block.titleUk}
    >
      <h5 className="study-agent-handoff-fixture-title">{block.titleUk}</h5>
      {block.introUk?.trim() ? (
        <p className="study-agent-handoff-fixture-intro study-learner-explanation">{block.introUk}</p>
      ) : null}
      <div className="study-prompt-block study-agent-handoff-fixture-json-card">
        <pre className="study-prompt-block-body is-mono study-model-response-json-pre study-agent-handoff-fixture-json-pre">
          {block.jsonExample}
        </pre>
      </div>
      <details className="study-rag-tech-details study-agent-handoff-fixture-fields-details">
        <summary>{block.fieldsDropdownSummaryUk}</summary>
        <div className="study-agent-handoff-fixture-fields">
          {block.fields.map((field) => (
            <div key={field.termUk} className="study-agent-handoff-fixture-field">
              <StudyLabeledExplanation
                termUk={field.termUk}
                explanationUk={field.explanationUk}
                separatorUk=" — "
                className="study-learner-labeled-line study-learner-explanation"
              />
            </div>
          ))}
        </div>
      </details>
      <div className="study-agent-handoff-fixture-agent-b study-learner-panel-block study-learner-panel-block--framed">
        <p className="study-learner-panel-label study-agent-handoff-fixture-agent-b-label">
          {block.agentBLabelUk}
        </p>
        <p className="study-learner-explanation study-agent-handoff-fixture-agent-b-body">
          {block.agentBBodyUk}
        </p>
      </div>
      {block.footnoteUk?.trim() ? (
        <p className="study-agent-handoff-fixture-footnote muted small study-learner-explanation">
          {block.footnoteUk}
        </p>
      ) : null}
    </section>
  );
}
