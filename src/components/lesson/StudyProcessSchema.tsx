import type { StudyFlowSchema } from '../../lib/studyFlowSchema';

type Props = {
  schema: StudyFlowSchema;
};

export function StudyProcessSchema({ schema }: Props) {
  if (schema.type === 'ascii-fallback') {
    return (
      <figure className="study-flow study-flow-fallback">
        <pre className="lesson-diagram-wrap study-flow-ascii-review" role="img" aria-label="Схема (оригінал для звірки)">
          {schema.raw}
        </pre>
        {schema.needsReview && (
          <figcaption className="muted small">Схему збережено в оригінальному вигляді для редакційної перевірки.</figcaption>
        )}
      </figure>
    );
  }

  if (schema.type === 'linear') {
    return (
      <figure className="study-flow study-flow-linear" aria-label="Лінійна послідовність">
        <ol className="study-flow-linear-list">
          {schema.steps.map((step, i) => (
            <li key={i}>
              <span className="study-flow-node">{step}</span>
              {i < schema.steps.length - 1 && <span className="study-flow-arrow-down" aria-hidden="true">↓</span>}
            </li>
          ))}
        </ol>
      </figure>
    );
  }

  if (schema.type === 'cycle') {
    return (
      <figure className="study-flow study-flow-cycle" aria-label="Цикл">
        <p className="study-flow-cycle-note muted small">Цикл (спрощено):</p>
        <ol className="study-flow-linear-list">
          {schema.steps.map((step, i) => (
            <li key={i}>
              <span className="study-flow-node">{step}</span>
              {i < schema.steps.length - 1 && <span className="study-flow-arrow-down" aria-hidden="true">↓</span>}
            </li>
          ))}
        </ol>
        <span className="study-flow-cycle-back" aria-hidden="true">↺ повтор</span>
      </figure>
    );
  }

  const headLabel = schema.preamble[0] ? translateHead(schema.preamble[0]) : null;

  return (
    <figure className="study-flow study-flow-branch" aria-label="Розгалуження рішення політики">
      {headLabel && (
        <div className="study-flow-stack study-flow-stack-top">
          <div className="study-flow-node study-flow-node-llm">{headLabel}</div>
          <div className="study-flow-arrow-down" aria-hidden="true">↓</div>
        </div>
      )}
      <div className="study-flow-node study-flow-node-decision">{translateDecision(schema.decision)}</div>
      <p className="study-flow-branch-hint muted small">
        Модель пропонує, а програмний код перевіряє та дозволяє або блокує виконання.
      </p>
      <div className="study-flow-fork" role="group" aria-label="Альтернативні результати перевірки">
        <div className="study-flow-fork-connector" aria-hidden="true" />
        <ul className="study-flow-branches study-flow-branches-fork">
          {schema.branches.map((b) => (
            <li key={b.sourceLabel} className="study-flow-branch-item">
              <span className="study-flow-fork-leg" aria-hidden="true">↳</span>
              <span className="study-flow-branch-label">{b.label}</span>
              {b.detail && <span className="study-flow-branch-detail">{b.detail}</span>}
            </li>
          ))}
        </ul>
      </div>
      <p className="study-flow-branch-note muted small">
        Це не послідовні кроки: код обирає одну з гілок після перевірки.
      </p>
    </figure>
  );
}

function translateHead(line: string): string {
  if (/llm proposes action/i.test(line)) return 'LLM пропонує дію';
  return line;
}

function translateDecision(line: string): string {
  if (/policy\/validation boundary/i.test(line)) {
    return 'Код на межі перевірки: аргументи та правила доступу';
  }
  return line;
}
