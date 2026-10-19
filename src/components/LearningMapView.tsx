import { Fragment } from 'react';
import { TOPIC_BY_ID } from '../data/topics.registry';
import type { LearningMapNode } from '../data/learning-map.registry';
import {
  filterLearningMapStages,
  type LearningMapViewFilter,
} from '../data/learning-map.registry';
import type { TopicMeta } from '../types/topic';
import { packConceptStageRows } from '../lib/learningMapStageRows';
import { MapStageHeroCard } from './MapStageHeroCard';
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
      <span className="map-flow-link-chevron">{vertical ? '↓' : '→'}</span>
    </div>
  );
}

function stageEdgeToNext(
  stage: { edges: { from: string; to: string }[] },
  node: LearningMapNode,
  next: LearningMapNode | undefined,
): boolean {
  if (!next) return false;
  const edge = stage.edges.find((e) => e.from === node.topicId);
  return Boolean(edge && edge.to === next.topicId);
}

function renderStageRow(
  row: LearningMapNode[],
  stage: { edges: { from: string; to: string }[] },
  selectedTopicId: string | null,
  highlightTopicId: string | null,
  onSelectTopic: (topic: TopicMeta) => void,
) {
  return row.map((node, index) => {
    const topic = TOPIC_BY_ID[node.topicId];
    if (!topic) return null;
    const next = row[index + 1];
    const showLink = stageEdgeToNext(stage, node, next);
    return (
      <Fragment key={node.topicId}>
        <div className="map-node-chain-item" role="listitem">
          <MapTopicNode
            topicId={node.topicId}
            labSublabel={labSublabel(node.topicId)}
            selected={selectedTopicId === node.topicId}
            highlighted={highlightTopicId === node.topicId}
            onSelect={onSelectTopic}
          />
        </div>
        {showLink && <StageFlowLink />}
      </Fragment>
    );
  });
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
        const conceptRows = isLabGrid ? [stage.nodes] : packConceptStageRows(stage.nodes);
        const multiRow = !isLabGrid && conceptRows.length > 1;

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
              data-node-count={String(nodeCount)}
              aria-labelledby={`stage-title-${stage.id}`}
            >
              <div className="map-stage-inner">
                <MapStageHeroCard
                  title={stage.title}
                  subtitle={stage.subtitle}
                  titleId={`stage-title-${stage.id}`}
                />

                <div
                  className={`map-stage-track${multiRow ? ' map-stage-track--split' : ''}`}
                  role="list"
                >
                  {multiRow
                    ? conceptRows.map((row, rowIndex) => (
                        <Fragment key={`row-${rowIndex}`}>
                          <div
                            className="map-stage-track-row-wrap"
                            data-row-count={row.length}
                            role="presentation"
                          >
                            <div className="map-stage-track-row" role="presentation">
                              {renderStageRow(
                                row,
                                stage,
                                selectedTopicId,
                                highlightTopicId,
                                onSelectTopic,
                              )}
                            </div>
                            {rowIndex < conceptRows.length - 1 && (
                              <div className="map-stage-row-bridge" aria-hidden="true">↓</div>
                            )}
                          </div>
                        </Fragment>
                      ))
                    : renderStageRow(
                        stage.nodes,
                        stage,
                        selectedTopicId,
                        highlightTopicId,
                        onSelectTopic,
                      )}
                </div>
              </div>
            </section>
          </div>
        );
      })}
    </div>
  );
}
