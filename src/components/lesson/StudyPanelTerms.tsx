import { StudyLabeledExplanation } from './StudyLabeledExplanation';

type Term = { label: string; text: string };

type Props = {
  terms: Term[];
  /** Коли зовнішній заголовок секції вже є на сторінці */
  hideHeading?: boolean;
};

/** Підсвітка термінології в кінці бокової панелі пояснення */
export function StudyPanelTerms({ terms, hideHeading = false }: Props) {
  if (!terms.length) return null;
  return (
    <div className="study-panel-terms" aria-label="Терміни">
      {hideHeading ? null : <p className="study-panel-terms-heading">Терміни</p>}
      <ul className="study-panel-terms-list">
        {terms.map((t) => (
          <li key={t.label}>
            <StudyLabeledExplanation
              termUk={t.label}
              explanationUk={t.text}
              className="study-learner-labeled-line study-panel-term-line"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
