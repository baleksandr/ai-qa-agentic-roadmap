type Filter = { key: string; value: string };

type Props = {
  queryLine: string;
  filters: Filter[];
  titleUk?: string;
};

export function StudyRagQueryFiltersCard({
  queryLine,
  filters,
  titleUk = 'Retrieval query і metadata-фільтри',
}: Props) {
  return (
    <article className="study-rag-query-card study-concept-card study-concept-card-hero" aria-label={titleUk}>
      <header className="study-concept-card-head">
        <span className="study-concept-card-step">Q</span>
        <div className="study-concept-card-titles">
          <span className="study-concept-card-kind">Harness · умовний приклад</span>
          <h4 className="study-concept-card-title">{titleUk}</h4>
        </div>
      </header>
      <div className="study-concept-card-body">
        <p className="muted small study-rag-query-card-lead">
          Текст запиту — симптоми й технічні терміни. Вікно 90 днів — у фільтрах, не в рядку query.
        </p>
        <div className="study-rag-query-card-query">
          <span className="study-prompt-block-badge">Query text</span>
          <pre className="study-rag-query-card-pre">{queryLine}</pre>
        </div>
        <div className="study-rag-query-card-filters">
          <span className="study-prompt-block-badge">Filters</span>
          <ul className="study-rag-filter-chips">
            {filters.map((f) => (
              <li key={f.key}>
                <code>{f.key}</code>
                <span className="study-rag-filter-eq">=</span>
                <span>{f.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
