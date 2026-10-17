import { useMemo } from 'react';
import { getAllMapTopicIds } from '../data/learning-map.registry';
import { isMapProgressTopic } from '../lib/mapProgressExcluded';
import { useProgress } from '../hooks/useProgress';

/** Прогрес без довідника (довідник не обов’язковий у маршруті) */
export function CompactProgress() {
  const { map } = useProgress();
  const ids = useMemo(
    () => getAllMapTopicIds().filter((id) => isMapProgressTopic(id)),
    [],
  );

  const studied = ids.filter((id) => map[id] === 'studied').length;
  const inProgress = ids.filter((id) => map[id] === 'in_progress').length;
  const total = ids.length;
  const pct = total ? Math.round((studied / total) * 100) : 0;

  return (
    <div className="compact-progress" aria-label="Загальний прогрес вивчення">
      <div className="compact-progress-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="compact-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="compact-progress-text">
        <strong>{studied}</strong> з {total} навчальних тем вивчено
        <span className="muted"> · без довідника</span>
        {inProgress > 0 && (
          <span className="muted"> · {inProgress} у процесі</span>
        )}
      </p>
    </div>
  );
}
