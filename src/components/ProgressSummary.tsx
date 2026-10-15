import { useProgress } from '../hooks/useProgress';

export function ProgressSummary() {
  const { summary } = useProgress();

  return (
    <section className="progress-summary" aria-label="Прогрес навчання">
      <h2>Ваш прогрес вивчення</h2>
      <div className="progress-cards">
        <ProgressCard
          title="Fundamentals"
          total={summary.fundamentals.total}
          studied={summary.fundamentals.studied}
          inProgress={summary.fundamentals.inProgress}
        />
        <ProgressCard
          title="20 Concepts"
          total={summary.concepts.total}
          studied={summary.concepts.studied}
          inProgress={summary.concepts.inProgress}
        />
        <ProgressCard
          title="Lab 0–9"
          total={summary.labs.total}
          studied={summary.labs.studied}
          inProgress={summary.labs.inProgress}
        />
      </div>
      <p className="muted small">
        Стан вивчення («Не вивчено» / «У процесі» / «Вивчено») незалежний від статусу перенесення з
        DOCX.
      </p>
    </section>
  );
}

function ProgressCard({
  title,
  total,
  studied,
  inProgress,
}: {
  title: string;
  total: number;
  studied: number;
  inProgress: number;
}) {
  const pct = total ? Math.round((studied / total) * 100) : 0;
  return (
    <article className="progress-card">
      <h3>{title}</h3>
      <div className="progress-bar" aria-hidden="true">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="small">
        Вивчено: <strong>{studied}</strong> · У процесі: <strong>{inProgress}</strong> · Усього:{' '}
        {total}
      </p>
    </article>
  );
}
