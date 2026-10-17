import type { LearningStatus } from '../types/topic';
import { LEARNING_LABELS } from '../types/topic';

const STATUS_SYMBOL: Record<LearningStatus, string> = {
  not_studied: '○',
  in_progress: '◐',
  studied: '●',
};

type Props = {
  status: LearningStatus;
};

/** Навчальний стан на карті — символ + текст (зрозуміло без кольору). */
export function MapLearningStatus({ status }: Props) {
  return (
    <span className={`map-node-learning map-node-learning--${status}`}>
      <span className="map-node-learning-symbol" aria-hidden="true">{STATUS_SYMBOL[status]}</span>
      <span className="map-node-learning-text">{LEARNING_LABELS[status]}</span>
    </span>
  );
}
