import type {
  StudyModelResponseCheckRow,
  StudyModelResponseExample,
} from '../../data/study/study-learner-panel-sections';
import { parseLessonBold } from './lessonRichText';
import { StudyLabeledExplanation } from './StudyLabeledExplanation';

type Props = {
  block: StudyModelResponseExample;
};

function CheckStatusRow({ row }: { row: StudyModelResponseCheckRow }) {
  return (
    <li className={`study-model-response-check study-model-response-check--${row.status}`}>
      <span className="study-model-response-check-label">{row.labelUk}</span>
      <span className="study-model-response-check-sep" aria-hidden="true">—</span>
      <span className="study-model-response-check-value">{row.statusTextUk}</span>
    </li>
  );
}

/** Приклад відповіді моделі: зрозуміла картка полів, статуси перевірок, JSON у розгортанні (§14). */
export function StudyModelResponseExampleBlock({ block }: Props) {
  const fieldGridClass =
    block.fields.length === 3
      ? 'study-model-response-field-grid study-model-response-field-grid--triple'
      : 'study-model-response-field-grid';

  return (
    <section
      className="study-model-response-example"
      aria-label={block.blockLabelUk}
    >
      <h5 className="study-model-response-example-title">{block.blockLabelUk}</h5>

      {block.introUk?.trim() ? (
        <p className="study-model-response-example-intro study-learner-explanation">
          {block.introUk}
        </p>
      ) : null}

      <article className="study-model-response-main-card">
        {block.teachingExampleHeader ? (
          <header className="study-model-response-main-card-header">
            <span className="study-model-response-example-badge">
              {block.teachingExampleHeader.badgeUk}
            </span>
            <p className="study-model-response-example-caption study-learner-explanation muted small">
              {block.teachingExampleHeader.captionUk}
            </p>
          </header>
        ) : null}
        <h6 className="study-model-response-main-card-title">{block.mainCardTitleUk}</h6>
        <ul className={fieldGridClass}>
          {block.fields.map((field) => (
            <li key={field.technicalUk} className="study-model-response-field-tile">
              <p className="study-model-response-field-label">{field.labelUk}</p>
              <p className="study-model-response-field-value">{field.valueUk}</p>
              {field.explanationUk?.trim() ? (
                <p className="study-model-response-field-explanation study-learner-explanation">
                  {field.explanationUk}
                </p>
              ) : null}
              <p className="study-model-response-field-tech">{field.technicalUk}</p>
            </li>
          ))}
        </ul>
      </article>

      {block.fieldsSummaryUk?.trim() && !block.teachingExampleHeader ? (
        <p className="study-model-response-fields-summary study-learner-explanation muted small">
          {block.fieldsSummaryUk}
        </p>
      ) : null}

      {block.checks?.length ? (
        <div className="study-model-response-example-part">
          {block.checksSectionTitleUk?.trim() ? (
            <p className="study-model-response-example-part-label">
              {block.checksSectionTitleUk}
            </p>
          ) : null}
          <ul className="study-model-response-check-list">
            {block.checks.map((row) => (
              <CheckStatusRow key={row.labelUk} row={row} />
            ))}
          </ul>
          {block.conclusionUk?.trim() ? (
            <p className="study-model-response-conclusion study-learner-explanation">
              {parseLessonBold(block.conclusionUk)}
            </p>
          ) : null}
        </div>
      ) : null}

      <details className="study-rag-tech-details study-model-response-tech-details">
        <summary>Показати JSON</summary>
        <div className="study-model-response-tech-inner">
          <p className="study-model-response-example-part-label">{block.schemaSectionTitleUk}</p>
          <ul className="study-learner-panel-check-list study-model-response-schema-list">
            {block.schemaRules.map((rule) => (
              <li key={rule.fieldKeyUk} className="study-learner-panel-check-row">
                <StudyLabeledExplanation
                  termUk={rule.fieldKeyUk}
                  explanationUk={rule.ruleUk}
                  separatorUk=" — "
                  className="study-learner-labeled-line study-learner-check-line"
                />
              </li>
            ))}
          </ul>
          <div className="study-prompt-block study-model-response-json-card">
            <pre className="study-prompt-block-body is-mono study-model-response-json-pre">
              {block.jsonExample}
            </pre>
          </div>
        </div>
      </details>
    </section>
  );
}
