import {
  POLICY_VERDICT_STATUS_ROWS,
  type PolicyVerdictStatusRow,
} from '../../data/study/policy-verdict-status-rows';
import { LessonRichParagraphs, parseLessonBold } from './lessonRichText';

const VERDICT_CLASS: Record<PolicyVerdictStatusRow['id'], string> = {
  deny: 'verdict-deny',
  allow: 'verdict-allow',
  needs_approval: 'verdict-approval',
};

type PolicyVerdictStatusRowsProps = {
  rows?: PolicyVerdictStatusRow[];
  className?: string;
};

/** Компактні кольорові рядки з поясненням вердиктів policy (deny / allow / needs_approval). */
export function StudyPolicyVerdictStatusRows({
  rows = POLICY_VERDICT_STATUS_ROWS,
  className = '',
}: PolicyVerdictStatusRowsProps) {
  return (
    <div
      className={`study-policy-example study-policy-verdict-status-rows ${className}`.trim()}
      aria-label="Рішення policy engine"
    >
      <ul className="study-policy-rules">
        {rows.map((row) => (
          <li key={row.id} className={`study-policy-rule ${VERDICT_CLASS[row.id]}`}>
            <div className="study-policy-rule-head">
              <code className="study-policy-verdict" lang="en">{row.termCode}</code>
              <span className="study-policy-action">{row.headlineUk}</span>
            </div>
            <p className="study-policy-explain study-learner-explanation">{parseLessonBold(row.summaryUk)}</p>
            <LessonRichParagraphs
              className="study-policy-explain study-learner-explanation"
              text={row.detailBulletsUk.map((line) => `- ${line}`).join('\n')}
            />
            <p className="study-policy-qa study-learner-explanation">
              <span className="study-component-qa-label">Приклад:</span> {parseLessonBold(row.exampleUk)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
