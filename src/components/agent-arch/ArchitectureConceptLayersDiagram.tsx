import { useMemo, useState } from 'react';
import { getArchitectureConceptPanel } from '../../data/architecture/architecture-node-panels';
import { getMapLabel } from '../../data/learning-map.registry';
import type { ArchitectureSchema } from '../../types/architecture-simulation';
import { ArchitectureConceptLayerPanel } from './ArchitectureConceptLayerPanel';

const CARD_ORDER = ['llm', 'rag', 'agent', 'agentic-system'] as const;

type Props = {
  schema: ArchitectureSchema;
};

export function ArchitectureConceptLayersDiagram({ schema }: Props) {
  const config = schema.conceptLayers;
  if (!config) return null;

  const nodesById = useMemo(() => {
    const map = new Map(config.nodes.map((n) => [n.id, n]));
    return map;
  }, [config.nodes]);

  const orderedNodes = CARD_ORDER.map((id) => nodesById.get(id)).filter(Boolean);

  const [activeNodeId, setActiveNodeId] = useState<string>(orderedNodes[0]?.id ?? 'llm');

  const activeNode = nodesById.get(activeNodeId) ?? orderedNodes[0];
  const panel = activeNode
    ? getArchitectureConceptPanel(schema.id, activeNode.id)
    : undefined;

  if (!activeNode || !panel) return null;

  return (
    <div className="arch-sim arch-sim--concept-layers">
      <header className="arch-concept-head">
        <div className="arch-concept-head-text">
          <h2 className="arch-sim-schema-title">{schema.title}</h2>
          <p className="arch-concept-head-note">{config.headerNoteUk}</p>
        </div>
      </header>

      <div className="arch-concept-layout">
        <section
          className="arch-concept-map"
          aria-label="Карта понять"
        >
          <div className="arch-concept-grid" role="group">
            {orderedNodes.map((node) => {
              if (!node) return null;
              const selected = activeNodeId === node.id;
              return (
                <div key={node.id} className="arch-concept-grid-cell">
                  <button
                    type="button"
                    id={`arch-concept-node-${node.id}`}
                    className={`arch-concept-card ${selected ? 'is-selected' : ''}`}
                    onClick={() => setActiveNodeId(node.id)}
                    aria-pressed={selected}
                  >
                    <span className="arch-concept-card-title">{node.label}</span>
                    <span className="arch-concept-card-line">{node.cardLineUk}</span>
                  </button>
                  {node.relationHintUk ? (
                    <p className="arch-concept-card-hint">{node.relationHintUk}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>

        <ArchitectureConceptLayerPanel
          title={activeNode.label}
          panel={panel}
          topicId={activeNode.topicId}
          topicLabel={getMapLabel(activeNode.topicId)}
        />
      </div>
    </div>
  );
}
