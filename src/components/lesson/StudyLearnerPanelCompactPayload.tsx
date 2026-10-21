import { LessonRichParagraphs } from './lessonRichText';
import { StudyTermAccent } from './StudyTermAccent';

type Row = { keyUk: string; valueUk: string };

type Props = {
  rows: Row[];
  footnoteUk?: string;
};

/** Один блок із рядками «поле → значення» (навчальний payload, не окремі картки на кожен рядок). */
export function StudyLearnerPanelCompactPayload({ rows, footnoteUk }: Props) {
  if (!rows.length) return null;
  return (
    <div className="study-compact-payload">
      <dl className="study-compact-payload__rows">
        {rows.map((row) => (
          <div key={row.keyUk} className="study-compact-payload__row">
            <dt className="study-compact-payload__key">
              <StudyTermAccent>{row.keyUk}</StudyTermAccent>
            </dt>
            <dd className="study-compact-payload__value">{row.valueUk}</dd>
          </div>
        ))}
      </dl>
      {footnoteUk?.trim() ? (
        <LessonRichParagraphs
          text={footnoteUk}
          className="study-compact-payload__footnote study-learner-explanation muted small"
        />
      ) : null}
    </div>
  );
}
