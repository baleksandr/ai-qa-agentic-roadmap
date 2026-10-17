import { TOPIC_BY_ID } from '../data/topics.registry';
import {
  filterLearningMapStages,
  type LearningMapViewFilter,
} from '../data/learning-map.registry';
import type { TopicMeta } from '../types/topic';
import { MapTopicNode } from './MapTopicNode';

interface Props {
  viewFilter: LearningMapViewFilter;
  selectedTopicId: string | null;
  highlightTopicId: string | null;
  onSelectTopic: (topic: TopicMeta) => void;
}

function labSublabel(topicId: string): string | undefined {
  if (!topicId.startsWith('lab-')) return undefined;
  const n = topicId.replace('lab-', '');
  return `Крок ${n}`;
}

function StageFlowLink({ vertical }: { vertical?: boolean }) {
  return (
    <div className={`map-flow-link${vertical ? ' is-vertical' : ''}`} aria-hidden="true">
      <span className="map-flow-link-line" />
      <span className="map-flow-link-chevron">{vertical ? '↓' : '→'}</span>
    </div>
  );
}

export function LearningMapView({
  viewFilter,
  selectedTopicId,
  highlightTopicId,
  onSelectTopic,
}: Props) {
  const stages = filterLearningMapStages(viewFilter);

  return (
    <div className="learning-map" role="navigation" aria-label="Навчальна карта">
      {stages.map((stage, stageIndex) => {
        const nodeCount = stage.nodes.length;
        const isSingle = nodeCount === 1;
        const isLabGrid = stage.id === 'practice';

        return (
          <div key={stage.id} className="map-stage-block">
            {stageIndex > 0 && (
              <div className="map-route-connector" aria-hidden="true">
                <span className="map-route-connector-line" />
                <span className="map-route-connector-label">Далі по маршруту</span>
                <span className="map-route-connector-arrow">↓</span>
              </div>
            )}

            <section
              className={`map-stage${isSingle ? ' is-single' : ''}${isLabGrid ? ' is-lab-grid' : ''}`}
              data-stage-id={stage.id}
              data-node-count={nodeCount}
              aria-labelledby={`stage-title-${stage.id}`}
            >
              <div className="map-stage-inner">
                <header className="map-stage-header">
                  <h2 id={`stage-title-${stage.id}`} className="map-stage-title">{stage.title}</h2>
                  {stage.subtitle && <p className="map-stage-sub muted">{stage.subtitle}</p>}
                </header>

                <div className="map-stage-track" role="list">
                  {stage.nodes.map((node, index) => {
                    const topic = TOPIC_BY_ID[node.topicId];
                    if (!topic) return null;
                    const edge = stage.edges.find((e) => e.from === node.topicId);
                    const nextId = stage.nodes[index + 1]?.topicId;
                    const showLink = Boolean(edge && nextId === edge.to);

                    return (
                      <div key={node.topicId} className="map-node-chain-item" role="listitem">
                        <MapTopicNode
                          topicId={node.topicId}
                          labSublabel={labSublabel(node.topicId)}
                          selected={selectedTopicId === node.topicId}
                          highlighted={highlightTopicId === node.topicId}
                          onSelect={onSelectTopic}
                        />
                        {showLink && <StageFlowLink />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        );
      })}
    </div>
  );
}
