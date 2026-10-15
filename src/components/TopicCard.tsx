import type { TopicMeta } from '../types/topic';
import { LEARNING_LABELS, MIGRATION_LABELS } from '../types/topic';
import { useProgress } from '../hooks/useProgress';

interface Props {
  topic: TopicMeta;
  showDocNumber?: boolean;
  selected?: boolean;
  onSelect: (topic: TopicMeta) => void;
}

export function TopicCard({ topic, showDocNumber = true, selected, onSelect }: Props) {
  const { getProgress } = useProgress();
  const learning = getProgress(topic.id);

  const label =
    topic.kind === 'concept' && topic.sourceNumber != null && showDocNumber
      ? `${String(topic.sourceNumber).padStart(2, '0')}`
      : topic.shortTitle;

  return (
    <button
      type="button"
      className={`topic-card migration-${topic.migrationStatus} ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(topic)}
      aria-pressed={selected}
    >
      <span className="topic-card-num">{label}</span>
      <span className="topic-card-title">{topic.shortTitle}</span>
      <span className="topic-card-meta">
        <span className={`badge progress-${learning}`}>{LEARNING_LABELS[learning]}</span>
        <span className={`badge migration-${topic.migrationStatus}`}>
          {MIGRATION_LABELS[topic.migrationStatus]}
        </span>
      </span>
    </button>
  );
}
