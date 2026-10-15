import { TOPIC_BY_ID } from '../data/topics.registry';
import { getMapHint, getMapLabel } from '../data/learning-map.registry';
import type { TopicMeta } from '../types/topic';
import { LEARNING_LABELS } from '../types/topic';
import { useProgress } from '../hooks/useProgress';

interface Props {
  topicId: string;
  labSublabel?: string;
  selected?: boolean;
  highlighted?: boolean;
  onSelect: (topic: TopicMeta) => void;
}

export function MapTopicNode({ topicId, labSublabel, selected, highlighted, onSelect }: Props) {
  const topic = TOPIC_BY_ID[topicId];
  const { getProgress } = useProgress();
  if (!topic) return null;

  const learning = getProgress(topicId);
  const label = getMapLabel(topicId);
  const hint = getMapHint(topicId);
  const needsContentWarning =
    topic.migrationStatus === 'partial' || topic.migrationStatus === 'not_migrated';

  return (
    <button
      type="button"
      id={`map-node-${topicId}`}
      className={`map-node progress-${learning} ${selected ? 'selected' : ''} ${highlighted ? 'highlight' : ''}`}
      onClick={() => onSelect(topic)}
      aria-pressed={selected}
      aria-describedby={hint ? `map-hint-${topicId}` : undefined}
      title={hint}
    >
      <span className="map-node-label">{label}</span>
      {labSublabel && <span className="map-node-sublabel">{labSublabel}</span>}
      <span className={`map-node-status badge progress-${learning}`}>{LEARNING_LABELS[learning]}</span>
      {needsContentWarning && (
        <span className="map-node-warn" title="Урок ще не повністю перенесений з джерела">
          !
        </span>
      )}
      {hint && (
        <span id={`map-hint-${topicId}`} className="sr-only">
          {hint}
        </span>
      )}
    </button>
  );
}
