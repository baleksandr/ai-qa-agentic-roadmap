import { LessonRichParagraphs } from './lessonRichText';

type Props = {
  sourceText?: string;
};

export function StudyLlmVsCodeBoundary({ sourceText }: Props) {
  return (
    <div className="study-llm-code-boundary">
      <p className="study-boundary-lead">
        Guardrails тримаються на чіткій межі: <strong>модель міркує й пропонує</strong>,{' '}
        <strong>код і інфраструктура перевіряють і виконують</strong>.
      </p>
      <div className="study-llm-code-grid">
        <article className="study-llm-code-card study-llm-side">
          <h4 className="study-llm-code-heading">LLM (ймовірнісна частина)</h4>
          <ul className="study-llm-code-list">
            <li>Розуміє текст помилки, логів, опису тесту природною мовою.</li>
            <li>Обирає <em>наступну дію</em>: відповідь текстом або tool call.</li>
            <li>Формулює гіпотезу та пояснення для QA — може помилитися.</li>
          </ul>
          <p className="study-llm-code-note muted small">Не читає диск, не викликає Jira і не «дає дозвіл» сама.</p>
        </article>
        <article className="study-llm-code-card study-code-side">
          <h4 className="study-llm-code-heading">Deterministic code (код + інфра)</h4>
          <ul className="study-llm-code-list">
            <li>Реальний I/O: файли, API, мережа, черги, бази даних.</li>
            <li>Permissions, policy engine, schema validation, sandbox шляхів.</li>
            <li>Retries, ліміти кроків, state, observability, enforcement після allow.</li>
          </ul>
          <p className="study-llm-code-note muted small">
            Саме тут — валідація, policy, sandbox, executor і observability: код приймає рішення до реального I/O.
          </p>
        </article>
      </div>
      <aside className="lesson-callout lesson-key-idea study-boundary-callout">
        <span className="lesson-callout-label">Mental model курсу</span>
        <LessonRichParagraphs
          text="**Модель пропонує — harness і policy вирішують — executor діє.** Якщо цю межу не відчуваєш, легко сплутати «модель сказала» з «система дозволила»."
          className="lesson-p"
        />
      </aside>
      {sourceText?.trim() && (
        <p className="study-step-source muted small" lang="uk">
          {sourceText.replace(/\s+/g, ' ').trim()}
        </p>
      )}
    </div>
  );
}
