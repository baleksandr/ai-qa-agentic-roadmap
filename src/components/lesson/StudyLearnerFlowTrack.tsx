type Props = {
  stages: string[];
  ariaLabel?: string;
  /** Після скількох кроків переносити на другий ряд (за замовчуванням — приблизно половина). */
  firstRowCount?: number;
};

function splitRows(stages: string[], firstRowCount?: number): [string[], string[]] {
  if (stages.length <= 5) return [stages, []];
  const split = firstRowCount ?? Math.ceil(stages.length / 2);
  const clamped = Math.min(Math.max(split, 2), stages.length - 1);
  return [stages.slice(0, clamped), stages.slice(clamped)];
}

function FlowPill({
  stage,
  index,
  total,
}: {
  stage: string;
  index: number;
  total: number;
}) {
  const tone = index === 0 ? 'is-first' : index === total - 1 ? 'is-last' : '';
  return (
    <div className={`study-learner-flow-pill ${tone}`}>
      <span className="study-learner-flow-pill-num">{index + 1}</span>
      <span className="study-learner-flow-pill-label">{stage}</span>
    </div>
  );
}

function FlowRow({
  stages,
  startIndex,
  total,
}: {
  stages: string[];
  startIndex: number;
  total: number;
}) {
  return (
    <div className="study-learner-flow-row" role="list">
      {stages.map((stage, i) => {
        const globalIndex = startIndex + i;
        return (
          <div key={`${globalIndex}-${stage}`} className="study-learner-flow-row-segment" role="listitem">
            {i > 0 && (
              <span className="study-learner-flow-arrow" aria-hidden="true">
                →
              </span>
            )}
            <FlowPill stage={stage} index={globalIndex} total={total} />
          </div>
        );
      })}
    </div>
  );
}

function FlowTimeline({ stages, ariaLabel }: { stages: string[]; ariaLabel: string }) {
  return (
    <ol className="study-learner-flow-timeline" aria-label={ariaLabel}>
      {stages.map((stage, i) => (
        <li
          key={`${i}-${stage}`}
          className={`study-learner-flow-timeline-step ${i === 0 ? 'is-first' : ''} ${i === stages.length - 1 ? 'is-last' : ''}`}
        >
          <span className="study-learner-flow-timeline-num">{i + 1}</span>
          <span className="study-learner-flow-timeline-label">{stage}</span>
        </li>
      ))}
    </ol>
  );
}

/** Довгі навчальні ланцюги: два ряди на широкому екрані, таймлайн на вузькому — без горизонтального скролу. */
export function StudyLearnerFlowTrack({ stages, ariaLabel = 'Послідовність кроків', firstRowCount }: Props) {
  if (stages.length < 2) return null;

  const [rowA, rowB] = splitRows(stages, firstRowCount);

  return (
    <div className="study-learner-flow-track" data-stage-count={stages.length}>
      <div className="study-learner-flow-desktop" aria-label={ariaLabel}>
        <FlowRow stages={rowA} startIndex={0} total={stages.length} />
        {rowB.length > 0 && (
          <>
            <div className="study-learner-flow-row-bridge" aria-hidden="true">
              <span className="study-learner-flow-row-bridge-line" />
              <span className="study-learner-flow-row-bridge-chevron">↓</span>
            </div>
            <FlowRow stages={rowB} startIndex={rowA.length} total={stages.length} />
          </>
        )}
      </div>
      <FlowTimeline stages={stages} ariaLabel={ariaLabel} />
    </div>
  );
}
