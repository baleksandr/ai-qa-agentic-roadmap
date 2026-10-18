import { TOPIC_BY_ID } from '../data/topics.registry';
import { getMapHint, getMapLabel } from '../data/learning-map.registry';
import { isStudyReadyForLearning } from '../data/study/study-ready-for-learning';
import type { TopicMeta } from '../types/topic';
import { LEARNING_LABELS } from '../types/topic';
import { useProgress } from '../hooks/useProgress';
import { MapLearningStatus } from './MapLearningStatus';

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
  const studyReady = isStudyReadyForLearning(topicId);

  return (
    <button
      type="button"
      id={`map-node-${topicId}`}
      className={`map-node progress-${learning} ${studyReady ? 'is-study-ready' : ''} ${selected ? 'is-selected' : ''} ${highlighted ? 'is-highlighted' : ''}`}
      onClick={() => onSelect(topic)}
      aria-pressed={selected}
      aria-describedby={hint ? `map-hint-${topicId}` : undefined}
      title={hint}
      aria-label={`${label}. ${LEARNING_LABELS[learning]}`}
    >
      <MapLearningStatus status={learning} />
      <span className="map-node-label">{label}</span>
      {labSublabel && <span className="map-node-sublabel">{labSublabel}</span>}
      {studyReady && (
        <span className="map-node-ready-line">Повний урок готовий для навчання</span>
      )}
      {hint && (
        <span id={`map-hint-${topicId}`} className="sr-only">
          {hint}
        </span>
      )}
    </button>
  );
}
