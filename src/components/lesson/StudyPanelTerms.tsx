type Term = { label: string; text: string };

type Props = {
  terms: Term[];
};

/** Підсвітка термінології в кінці бокової панелі пояснення */
export function StudyPanelTerms({ terms }: Props) {
  if (!terms.length) return null;
  return (
    <div className="study-panel-terms" aria-label="Терміни">
      <p className="study-panel-terms-heading">Терміни</p>
      <ul className="study-panel-terms-list">
        {terms.map((t) => (
          <li key={t.label}>
            <span className="study-panel-term-label">{t.label}</span>
            <p className="study-panel-term-desc">{t.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
