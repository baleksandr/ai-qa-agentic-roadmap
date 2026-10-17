import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { getArchitectureNodePanel } from '../../data/architecture/architecture-node-panels';
import { getMapLabel } from '../../data/learning-map.registry';
import type {
  ArchitectureSchema,
  SimEdge,
  SimEdgePort,
  SimNode,
  SimStep,
  SimStepPanel,
} from '../../types/architecture-simulation';

function getNode(schema: ArchitectureSchema, id: string) {
  return schema.nodes.find((n) => n.id === id);
}

function getEdge(schema: ArchitectureSchema, id: string) {
  return schema.edges.find((e) => e.id === id);
}

function nodeCenter(n: SimNode) {
  return { x: n.x + n.w / 2, y: n.y + n.h / 2 };
}

function portPoint(n: SimNode, port: SimEdgePort): { x: number; y: number } {
  switch (port) {
    case 'left':
      return { x: n.x, y: n.y + n.h / 2 };
    case 'right':
      return { x: n.x + n.w, y: n.y + n.h / 2 };
    case 'top':
      return { x: n.x + n.w / 2, y: n.y };
    case 'bottom':
      return { x: n.x + n.w / 2, y: n.y + n.h };
    default:
      return nodeCenter(n);
  }
}

function autoPorts(from: SimNode, to: SimNode): { fromPort: SimEdgePort; toPort: SimEdgePort } {
  const a = nodeCenter(from);
  const b = nodeCenter(to);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0 ? { fromPort: 'right', toPort: 'left' } : { fromPort: 'left', toPort: 'right' };
  }
  return dy >= 0 ? { fromPort: 'bottom', toPort: 'top' } : { fromPort: 'top', toPort: 'bottom' };
}

function edgePolyline(schema: ArchitectureSchema, edge: SimEdge): { x: number; y: number }[] {
  const from = getNode(schema, edge.from);
  const to = getNode(schema, edge.to);
  if (!from || !to) return [];
  const { fromPort, toPort } = edge.fromPort && edge.toPort
    ? { fromPort: edge.fromPort, toPort: edge.toPort }
    : autoPorts(from, to);
  const a = portPoint(from, fromPort);
  const b = portPoint(to, toPort);
  if (edge.loop) {
    const cx = edge.cx ?? (a.x + b.x) / 2;
    const cy = edge.cy ?? Math.min(a.y, b.y) - 80;
    return [a, { x: cx, y: cy }, b];
  }
  if (edge.cx !== undefined && edge.cy !== undefined) {
    return [a, { x: edge.cx, y: edge.cy }, b];
  }
  const pts: { x: number; y: number }[] = [a];
  if (edge.waypoints?.length) pts.push(...edge.waypoints);
  pts.push(b);
  return pts;
}

function edgePathD(schema: ArchitectureSchema, edge: SimEdge): string {
  const pts = edgePolyline(schema, edge);
  if (pts.length < 2) return '';
  if (pts.length === 3 && edge.cx !== undefined && !edge.waypoints?.length) {
    const [a, c, b] = pts;
    return `M ${a.x} ${a.y} Q ${c.x} ${c.y} ${b.x} ${b.y}`;
  }
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) d += ` L ${pts[i].x} ${pts[i].y}`;
  return d;
}

function pointAlongPolyline(pts: { x: number; y: number }[], t: number): { x: number; y: number } {
  if (pts.length === 0) return { x: 0, y: 0 };
  if (pts.length === 1) return pts[0];
  const lengths: number[] = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const seg = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    lengths.push(seg);
    total += seg;
  }
  const target = total * t;
  let acc = 0;
  for (let i = 0; i < lengths.length; i++) {
    if (acc + lengths[i] >= target) {
      const local = (target - acc) / lengths[i];
      return {
        x: pts[i].x + (pts[i + 1].x - pts[i].x) * local,
        y: pts[i].y + (pts[i + 1].y - pts[i].y) * local,
      };
    }
    acc += lengths[i];
  }
  return pts[pts.length - 1];
}

function markerPoint(schema: ArchitectureSchema, edgeId: string, t = 0.85): { x: number; y: number } | null {
  const edge = getEdge(schema, edgeId);
  if (!edge) return null;
  const pts = edgePolyline(schema, edge);
  if (pts.length < 2) return null;
  return pointAlongPolyline(pts, t);
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

function useNarrowLayout() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const onChange = () => setNarrow(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return narrow;
}

function nodeVisible(node: SimNode, showOptional: boolean) {
  return !node.optional || showOptional;
}

function edgeVisible(edge: SimEdge, schema: ArchitectureSchema, showOptional: boolean) {
  if (edge.optional && !showOptional) return false;
  const from = getNode(schema, edge.from);
  const to = getNode(schema, edge.to);
  if (!from || !to) return false;
  return nodeVisible(from, showOptional) && nodeVisible(to, showOptional);
}

type Props = {
  schema: ArchitectureSchema;
};

export function ArchitectureDiagram({ schema }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showOptional, setShowOptional] = useState(false);
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const narrow = useNarrowLayout();
  const playRef = useRef<number | null>(null);

  const steps = schema.steps;
  const step: SimStep = steps[stepIndex];
  const activeNodeSet = useMemo(() => new Set(step.activeNodes), [step]);
  const activeEdgeSet = useMemo(() => new Set(step.activeEdges), [step]);

  const hasOptional =
    schema.nodes.some((n) => n.optional) ||
    schema.edges.some((e) => e.optional) ||
    (schema.aux?.some((a) => a.optional) ?? false);

  const auxVisible = useMemo(
    () => (schema.aux ?? []).filter((a) => !a.optional || showOptional),
    [schema.aux, showOptional],
  );

  const visibleNodes = useMemo(
    () => schema.nodes.filter((n) => nodeVisible(n, showOptional)),
    [schema.nodes, showOptional],
  );

  const visibleEdges = useMemo(
    () => schema.edges.filter((e) => edgeVisible(e, schema, showOptional)),
    [schema.edges, schema, showOptional],
  );

  const go = useCallback(
    (index: number) => {
      setStepIndex(Math.max(0, Math.min(steps.length - 1, index)));
      setFocusedNodeId(null);
    },
    [steps.length],
  );

  const reset = useCallback(() => {
    setPlaying(false);
    setStepIndex(0);
    setFocusedNodeId(null);
  }, []);

  useEffect(() => {
    const needsOptional = step.activeNodes.some((id) => getNode(schema, id)?.optional);
    if (needsOptional) setShowOptional(true);
  }, [stepIndex, schema, step.activeNodes]);

  useEffect(() => {
    if (!playing || reducedMotion) return;
    playRef.current = window.setInterval(() => {
      setFocusedNodeId(null);
      setStepIndex((i) => {
        if (i >= steps.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 4200);
    return () => {
      if (playRef.current) window.clearInterval(playRef.current);
    };
  }, [playing, reducedMotion, steps.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case 'ArrowRight':
        case 'l':
          e.preventDefault();
          go(stepIndex + 1);
          break;
        case 'ArrowLeft':
        case 'h':
          e.preventDefault();
          go(stepIndex - 1);
          break;
        case ' ':
          e.preventDefault();
          setPlaying((p) => !p);
          break;
        case 'Home':
          e.preventDefault();
          reset();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, reset, stepIndex]);

  const panel: SimStepPanel = focusedNodeId
    ? nodePanel(schema, focusedNodeId, step)
    : step.panel;

  const marker = step.markerEdgeId ? markerPoint(schema, step.markerEdgeId) : null;
  const { viewW, viewH } = schema;

  return (
    <div className="arch-sim">
      <div className="arch-sim-compact-head">
        <div className="arch-sim-compact-title">
          <h2 className="arch-sim-schema-title">{schema.title}</h2>
          <p className="arch-sim-goal muted small">{schema.subtitle}</p>
          {schema.termNote && (
            <p className="arch-sim-term-note small" role="note">{schema.termNote}</p>
          )}
        </div>
        <div className="arch-sim-controls" role="toolbar" aria-label="Керування симуляцією">
          <span className="arch-sim-progress">
            Крок <strong>{stepIndex + 1}</strong> із {steps.length}
          </span>
          <div className="arch-sim-control-btns">
            <button type="button" className="arch-sim-btn arch-sim-btn-icon" onClick={() => setPlaying((p) => !p)} aria-pressed={playing} title={playing ? 'Пауза' : 'Відтворити'}>
              {playing ? '⏸' : '▶'}
            </button>
            <button type="button" className="arch-sim-btn" onClick={() => go(stepIndex - 1)} disabled={stepIndex === 0} aria-label="Попередній крок">
              ←
            </button>
            <button
              type="button"
              className="arch-sim-btn arch-sim-btn-primary"
              onClick={() => go(stepIndex + 1)}
              disabled={stepIndex >= steps.length - 1}
              aria-label="Наступний крок"
            >
              →
            </button>
            <button type="button" className="arch-sim-btn" onClick={reset} title="Скинути">
              ⟲
            </button>
          </div>
          <details className="arch-sim-kbd-details">
            <summary className="muted small">Клавіатура</summary>
            <p className="muted small">
              ← → кроки, пробіл — пауза/відтворення, Home — скинути
              {reducedMotion ? ' · анімація вимкнена' : ''}
            </p>
          </details>
        </div>
      </div>
      <p className="arch-sim-disclaimer compact" role="note">{schema.disclaimer}</p>
      {(schema.bookSourceUk || schema.teachingExampleUk) && (
        <div className="arch-sim-source-block" role="note">
          {schema.bookSourceUk && (
            <p className="arch-sim-book-source small">
              <span className="arch-sim-source-label">Джерело (книга):</span> {schema.bookSourceUk}
            </p>
          )}
          {schema.teachingExampleUk && (
            <p className="arch-sim-teaching-example small">
              <span className="arch-sim-source-label">Навчальний приклад (курс):</span> {schema.teachingExampleUk}
            </p>
          )}
        </div>
      )}

      <div className="arch-sim-body">
        <div className="arch-sim-canvas-col">
        <div
          className="arch-sim-canvas-wrap"
          style={{ aspectRatio: `${viewW} / ${viewH}` }}
        >
          {narrow ? (
            <MobileFlow
              schema={schema}
              step={step}
              activeNodeSet={activeNodeSet}
              onSelectNode={setFocusedNodeId}
              showOptional={showOptional}
            />
          ) : (
            <svg
              className="arch-sim-svg"
              viewBox={`0 0 ${viewW} ${viewH}`}
              role="img"
              aria-label={schema.svgLabel}
            >
              <defs>
                <marker id={`arch-arrowhead-${schema.id}`} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="currentColor" />
                </marker>
              </defs>
              {visibleEdges.map((edge) => {
                const isActive = activeEdgeSet.has(edge.id);
                const isDim = !isActive && stepIndex > 0;
                const d = edgePathD(schema, edge);
                return (
                  <g key={edge.id} className={`arch-sim-edge ${isActive ? 'active' : 'idle'} ${isDim ? 'dim' : ''}`}>
                    <path
                      d={d}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={isActive ? 3 : 2}
                      markerEnd={`url(#arch-arrowhead-${schema.id})`}
                      className={isActive && !reducedMotion ? 'arch-sim-edge-flow' : ''}
                    />
                    {edge.label && isActive && (
                      <text
                        className={`arch-sim-edge-label ${isActive ? 'active' : ''}`}
                      >
                        <textPath href={`#path-${schema.id}-${edge.id}`} startOffset="50%">
                          {edge.label}
                        </textPath>
                      </text>
                    )}
                    <path id={`path-${schema.id}-${edge.id}`} d={d} fill="none" stroke="none" />
                  </g>
                );
              })}
              {marker && !reducedMotion && (
                <circle className="arch-sim-marker" cx={marker.x} cy={marker.y} r={7} />
              )}
            </svg>
          )}

          {!narrow &&
            visibleNodes.map((node) => (
              <NodeButton
                key={node.id}
                node={node}
                isActive={activeNodeSet.has(node.id)}
                isFocused={focusedNodeId === node.id}
                isOptional={!!node.optional}
                onSelect={() => setFocusedNodeId(node.id)}
                style={{
                  left: `${(node.x / viewW) * 100}%`,
                  top: `${(node.y / viewH) * 100}%`,
                  width: `${(node.w / viewW) * 100}%`,
                  minHeight: `${(node.h / viewH) * 100}%`,
                }}
              />
            ))}

          {!narrow && auxVisible.length > 0 && (
            <div className="arch-sim-aux-layer" aria-hidden={!auxVisible.length}>
              {auxVisible.map((aux) => (
                <span
                  key={aux.id}
                  className={`arch-sim-aux-chip ${aux.optional ? 'optional' : ''}`}
                  title={aux.summary}
                >
                  {aux.label}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="arch-sim-canvas-foot">
          <ul className="arch-sim-legend" aria-label="Типи вузлів">
            <li><span className="arch-sim-legend-swatch role-data" /> Data</li>
            <li><span className="arch-sim-legend-swatch role-code" /> TypeScript</li>
            <li><span className="arch-sim-legend-swatch role-llm" /> LLM</li>
            <li><span className="arch-sim-legend-swatch role-human" /> Human / CI</li>
            <li><span className="arch-sim-legend-swatch role-outcome" /> Outcome</li>
          </ul>
          {hasOptional && schema.optionalToggleLabel && (
            <label className="arch-sim-toggle arch-sim-toggle-inline">
              <input
                type="checkbox"
                checked={showOptional}
                onChange={(e) => setShowOptional(e.target.checked)}
              />
              {schema.optionalToggleLabel}
            </label>
          )}
        </div>
        {showOptional && schema.optionalToggleHint && (
          <p className="arch-sim-cache-hint small" role="status">{schema.optionalToggleHint}</p>
        )}
        </div>

        <aside className="arch-sim-panel" aria-live="polite">
          <div className="arch-sim-panel-mode">
            {focusedNodeId ? (
              <>
                <span className="arch-sim-mode-badge is-node">Обраний вузол</span>
                <button type="button" className="arch-sim-mode-back" onClick={() => setFocusedNodeId(null)}>
                  ← Пояснення кроку {stepIndex + 1}
                </button>
              </>
            ) : (
              <span className="arch-sim-mode-badge is-step">
                Крок симуляції {stepIndex + 1} / {steps.length}
              </span>
            )}
          </div>
          <h3 className="arch-sim-panel-title">
            {focusedNodeId ? getNode(schema, focusedNodeId)?.label : step.title}
          </h3>
          <p className="arch-sim-panel-lead">{panel.what}</p>
          <dl className="arch-sim-dl">
            <dt>Яку проблему вирішує?</dt>
            <dd>{panel.problem ?? panel.why}</dd>
            <dt>Хто виконує?</dt>
            <dd>{panel.who}</dd>
            <dt>Що на вході?</dt>
            <dd><pre className="arch-sim-code">{panel.input}</pre></dd>
            <dt>Що на виході?</dt>
            <dd><pre className="arch-sim-code">{panel.output}</pre></dd>
            {panel.recipient && (
              <>
                <dt>Кому передається</dt>
                <dd>{panel.recipient}</dd>
              </>
            )}
            {panel.systemChange && (
              <>
                <dt>Що змінилось у системі</dt>
                <dd>{panel.systemChange}</dd>
              </>
            )}
            {panel.problem && (
              <>
                <dt>Зв’язок у потоці</dt>
                <dd>{panel.why}</dd>
              </>
            )}
            {!panel.problem && (
              <>
                <dt>Навіщо цей крок?</dt>
                <dd>{panel.why}</dd>
              </>
            )}
            {panel.unknown && (
              <>
                <dt>Що ще невідомо</dt>
                <dd>{panel.unknown}</dd>
              </>
            )}
            {panel.qaAgent && (
              <>
                <dt>Для QA-агента</dt>
                <dd>{panel.qaAgent}</dd>
              </>
            )}
            <dt>Що може піти не так?</dt>
            <dd>{panel.risks}</dd>
          </dl>

          <TopicLinks schema={schema} nodeId={focusedNodeId} step={step} />

          {schema.exitConditions && schema.exitConditions.length > 0 && (
            <>
              <h4 className="arch-sim-subhead">Умови завершення run</h4>
              <ul className="arch-sim-list">
                {schema.exitConditions.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </>
          )}

          {!narrow && auxVisible.length > 0 && (
            <>
              <h4 className="arch-sim-subhead">Допоміжні ролі</h4>
              <ul className="arch-sim-aux-list">
                {auxVisible.map((aux) => (
                  <li key={aux.id}>
                    <strong>{aux.label}</strong> — {aux.summary}{' '}
                    <Link to={`/topic/${aux.topicId}/study`}>Study</Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

function NodeButton({
  node,
  isActive,
  isFocused,
  isOptional,
  onSelect,
  style,
}: {
  node: SimNode;
  isActive: boolean;
  isFocused: boolean;
  isOptional: boolean;
  onSelect: () => void;
  style: CSSProperties;
}) {
  return (
    <button
      type="button"
      className={`arch-sim-node role-${node.role} ${isActive ? 'active' : ''} ${isFocused ? 'focused' : ''} ${isOptional ? 'optional-node' : ''}`}
      style={style}
      onClick={onSelect}
      aria-current={isActive ? 'step' : undefined}
    >
      <span className="arch-sim-node-label">{node.shortLabel}</span>
      <span className="arch-sim-node-role muted small">{roleLabel(node.role)}</span>
    </button>
  );
}

function roleLabel(role: SimNode['role']) {
  switch (role) {
    case 'human':
      return 'людина / CI';
    case 'llm':
      return 'модель';
    case 'code':
      return 'TypeScript';
    case 'tool':
      return 'інструмент';
    case 'data':
      return 'файли / API';
    case 'outcome':
      return 'вихід run';
    default:
      return '';
  }
}

function nodePanel(schema: ArchitectureSchema, nodeId: string, step: SimStep): SimStepPanel {
  const node = getNode(schema, nodeId);
  if (!node) return step.panel;
  const dedicated = getArchitectureNodePanel(schema.id, nodeId);
  if (dedicated) return dedicated;
  return {
    what: `Вузол «${node.label}» на цій схемі. Пройдіть кроки симуляції або оберіть активний крок, щоб побачити роль у потоці.`,
    who: 'Див. роль на кнопці вузла (людина / код / LLM / дані).',
    input: 'Залежить від попереднього кроку в цій схемі.',
    output: 'Передається наступному вузлу за стрілками.',
    why: 'Частина навчального потоку цієї вкладки.',
    unknown: 'Деталі кроку — у поясненні активного кроку симуляції.',
    risks: 'Перевірте напрям стрілок на схемі.',
  };
}

function TopicLinks({ schema, nodeId, step }: { schema: ArchitectureSchema; nodeId: string | null; step: SimStep }) {
  const ids = new Set<string>();
  if (nodeId) {
    const n = getNode(schema, nodeId);
    if (n) ids.add(n.topicId);
  }
  step.activeNodes.forEach((id) => {
    const n = getNode(schema, id);
    if (n) ids.add(n.topicId);
  });
  const list = [...ids];
  if (list.length === 0) return null;
  return (
    <p className="arch-sim-lessons">
      Вивчити докладніше:{' '}
      {list.map((topicId, i) => (
        <span key={topicId}>
          {i > 0 ? ' · ' : ''}
          <Link to={`/topic/${topicId}/study`}>{getMapLabel(topicId)}</Link>
        </span>
      ))}
    </p>
  );
}

function MobileFlow({
  schema,
  step,
  activeNodeSet,
  onSelectNode,
  showOptional,
}: {
  schema: ArchitectureSchema;
  step: SimStep;
  activeNodeSet: Set<string>;
  onSelectNode: (id: string) => void;
  showOptional: boolean;
}) {
  const ordered = [...schema.nodes]
    .filter((n) => nodeVisible(n, showOptional))
    .sort((a, b) => a.mobileOrder - b.mobileOrder);
  return (
    <ol className="arch-sim-mobile-flow">
      {ordered.map((node) => (
        <li key={node.id} className={activeNodeSet.has(node.id) ? 'active' : ''}>
          <button
            type="button"
            className={`arch-sim-node role-${node.role} mobile`}
            onClick={() => onSelectNode(node.id)}
          >
            {node.label}
          </button>
          {activeNodeSet.has(node.id) && step.activeEdges.length > 0 && (
            <span className="arch-sim-mobile-arrow" aria-hidden="true">↓</span>
          )}
        </li>
      ))}
    </ol>
  );
}
