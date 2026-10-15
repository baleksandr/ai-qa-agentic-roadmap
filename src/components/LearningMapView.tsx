import { TOPIC_BY_ID } from '../data/topics.registry';
import { LEARNING_MAP_STAGES } from '../data/learning-map.registry';
import type { TopicMeta } from '../types/topic';
import { MapTopicNode } from './MapTopicNode';

interface Props {
  selectedTopicId: string | null;
  highlightTopicId: string | null;
  onSelectTopic: (topic: TopicMeta) => void;
}

function labSublabel(topicId: string): string | undefined {
  if (!topicId.startsWith('lab-')) return undefined;
  const n = topicId.replace('lab-', '');
  return `Крок ${n}`;
}

export function LearningMapView({ selectedTopicId, highlightTopicId, onSelectTopic }: Props) {
  return (
    <div className="learning-map" role="navigation" aria-label="Навчальна карта">
      {LEARNING_MAP_STAGES.map((stage, stageIndex) => (
        <section key={stage.id} className="map-stage" aria-labelledby={`stage-title-${stage.id}`}>
          {stageIndex > 0 && <div className="map-stage-connector" aria-hidden="true" />}
          <header className="map-stage-header">
            <h2 id={`stage-title-${stage.id}`} className="map-stage-title">{stage.title}</h2>
            {stage.subtitle && <p className="map-stage-sub muted">{stage.subtitle}</p>}
          </header>
          <div className="map-stage-track">
            {stage.nodes.map((node, index) => {
              const topic = TOPIC_BY_ID[node.topicId];
              if (!topic) return null;
              const edge = stage.edges.find((e) => e.from === node.topicId);
              const nextId = stage.nodes[index + 1]?.topicId;
              const showArrow = edge && nextId === edge.to;
              return (
                <div key={node.topicId} className="map-node-wrap">
                  <MapTopicNode
                    topicId={node.topicId}
                    labSublabel={labSublabel(node.topicId)}
                    selected={selectedTopicId === node.topicId}
                    highlighted={highlightTopicId === node.topicId}
                    onSelect={onSelectTopic}
                  />
                  {showArrow && <div className="map-edge" aria-hidden="true" />}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
