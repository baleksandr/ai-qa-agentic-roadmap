import type { LearningStatus } from '../types/topic';
import { LEARNING_LABELS } from '../types/topic';

type Props = {
  status: LearningStatus;
};

/** Читабельний бейдж стану вивчення на картці маршруту. */
export function MapLearningStatus({ status }: Props) {
  return (
    <span className={`map-learning-badge map-learning-badge--${status}`}>
      <span className="map-learning-badge__text">{LEARNING_LABELS[status]}</span>
    </span>
  );
}
