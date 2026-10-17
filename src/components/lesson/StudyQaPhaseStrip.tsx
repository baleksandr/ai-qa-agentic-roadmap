import type { QaCheckDetail } from '../../data/study/rag-qa-check-details';

const STEPS: Array<{ key: QaCheckDetail['phaseKey']; label: string }> = [
  { key: 'offline', label: 'Індекс' },
  { key: 'retrieve', label: 'Пошук' },
  { key: 'context', label: 'Контекст' },
  { key: 'security', label: 'Безпека' },
  { key: 'observe', label: 'Trace' },
];

type Props = {
  active: QaCheckDetail['phaseKey'];
  phaseLabel: string;
};

/** Міні-схема фаз RAG для панелі QA */
export function StudyQaPhaseStrip({ active, phaseLabel }: Props) {
  return (
    <div className="study-qa-phase-strip" role="img" aria-label={`Фаза: ${phaseLabel}`}>
      <span className="study-qa-phase-strip-label">{phaseLabel}</span>
      <ol className="study-qa-phase-strip-steps">
        {STEPS.map((s) => (
          <li
            key={s.key}
            className={`study-qa-phase-strip-step${s.key === active ? ' is-active' : ''}`}
          >
            {s.label}
          </li>
        ))}
      </ol>
    </div>
  );
}
