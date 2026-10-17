import { lookupGuardrailsComponent } from '../../data/study/guardrails-components';

type Props = {
  items: string[];
  topicId?: string;
};

export function StudyComponentGlossary({ items, topicId }: Props) {
  const enriched = topicId === 'concept-17';

  return (
    <div className="study-component-glossary">
      <p className="study-component-glossary-lead muted small">
        Компоненти Guardrails — окремі шари перевірки в коді. Модель не замінює їх «розумінням».
      </p>
      <ul className="study-component-list">
        {items.map((label) => {
          const help = enriched ? lookupGuardrailsComponent(label) : null;
          return (
            <li key={label} className="study-component-card">
              <h4 className="study-component-title">{help?.title ?? label}</h4>
              {help ? (
                <>
                  <p className="study-component-summary">{help.summaryUk}</p>
                  <p className="study-component-qa">
                    <span className="study-component-qa-label">Для QA Agent:</span> {help.qaUk}
                  </p>
                </>
              ) : (
                <p className="muted small">Коротке пояснення для цього компонента ще не додано.</p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
