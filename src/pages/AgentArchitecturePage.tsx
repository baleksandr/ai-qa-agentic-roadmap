import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SiteNav } from '../components/SiteNav';
import { TopicSearch } from '../components/TopicSearch';
import {
  ARCHITECTURE_ANNOTATIONS,
  ARCHITECTURE_CYCLE,
  ARCHITECTURE_OPTIONAL,
  type ArchitectureNode,
} from '../data/agent-architecture';
import { TOPIC_BY_ID } from '../data/topics.registry';

function NodeCard({
  node,
  selectedId,
  onSelect,
}: {
  node: ArchitectureNode;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const topic = TOPIC_BY_ID[node.topicId];
  const isSelected = selectedId === node.id;
  return (
    <button
      type="button"
      className={`arch-node ${node.kind} ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(node.id)}
      aria-expanded={isSelected}
    >
      <span className="arch-node-title">{node.title}</span>
      {topic && <span className="arch-node-topic muted small">{topic.shortTitle ?? topic.title}</span>}
    </button>
  );
}

export function AgentArchitecturePage() {
  const [selectedId, setSelectedId] = useState<string | null>(ARCHITECTURE_CYCLE[0]?.id ?? null);
  const selected =
    ARCHITECTURE_CYCLE.find((n) => n.id === selectedId) ??
    ARCHITECTURE_OPTIONAL.find((n) => n.id === selectedId);
  const topic = selected ? TOPIC_BY_ID[selected.topicId] : undefined;
  const annotationsFor = (nodeId: string) =>
    ARCHITECTURE_ANNOTATIONS.filter((a) => a.attachToNodeId === nodeId);

  return (
    <div className="page agent-arch-page">
      <header className="site-header">
        <div>
          <h1>Архітектура агента</h1>
          <p className="lead">
            Що відбувається під час одного запуску QA Regression Investigation Agent і де на цьому шляху
            лежать вивчені концепції.
          </p>
          <SiteNav />
        </div>
        <TopicSearch />
      </header>

      <div className="arch-layout">
        <section className="arch-flow" aria-label="Цикл розслідування">
          {ARCHITECTURE_CYCLE.map((node, index) => (
            <div key={node.id} className="arch-step-wrap">
              <NodeCard node={node} selectedId={selectedId} onSelect={setSelectedId} />
              {annotationsFor(node.id).map((ann) => (
                <button
                  key={ann.id}
                  type="button"
                  className="arch-annotation"
                  onClick={() => setSelectedId(node.id)}
                  title={ann.summary}
                >
                  <span className="arch-annotation-label">{ann.label}</span>
                  <Link
                    className="arch-annotation-link"
                    to={`/topic/${ann.topicId}/study`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Study →
                  </Link>
                </button>
              ))}
              {index < ARCHITECTURE_CYCLE.length - 1 && (
                <div className="arch-arrow" aria-hidden="true">↓</div>
              )}
            </div>
          ))}
        </section>

        <aside className="arch-detail">
          {selected ? (
            <>
              <h2>{selected.title}</h2>
              <p>{selected.summary}</p>
              {topic && (
                <p>
                  <Link to={`/topic/${topic.id}/study`}>Study Mode: {topic.title}</Link>
                  {' · '}
                  <Link to={`/topic/${topic.id}`}>Review</Link>
                </p>
              )}
            </>
          ) : (
            <p className="muted">Оберіть крок на схемі.</p>
          )}

          <h3 className="arch-optional-heading">Можливі компоненти (не кожен run)</h3>
          <ul className="arch-optional-list">
            {ARCHITECTURE_OPTIONAL.map((opt) => (
              <li key={opt.id}>
                <button
                  type="button"
                  className="arch-optional-btn"
                  onClick={() => setSelectedId(opt.id)}
                >
                  {opt.title}
                </button>
                {' — '}
                <Link to={`/topic/${opt.topicId}/study`}>Study</Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <p className="small muted arch-footer">
        <Link to="/">← Назад до навчального маршруту</Link>
      </p>
    </div>
  );
}
