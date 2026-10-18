import '@xyflow/react/dist/style.css';
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type ReactFlowInstance,
} from '@xyflow/react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getArchitectureNodePanel } from '../../data/architecture/architecture-node-panels';
import { getMapLabel } from '../../data/learning-map.registry';
import { computeAgentOverviewFit } from '../../lib/agentCycleDiagramLayout';
import { getAgentTransitionPanelView } from '../../data/architecture/agent-cycle-edge-panels';
import { getAgentNodePanelView } from '../../data/architecture/agent-cycle-node-panel-views';
import type { AgentExplainerTopic } from '../../data/architecture/agent-cycle-optional-explainer-content';
import { applyAgentCycleOptional } from '../../lib/agentCycleOptionalPaths';
import {
  getAgentExplainerTopicForNode,
  MCP_ID,
  RAG_SEARCH_ID,
} from '../../lib/agentCycleOptionalNodes';
import { isAgentSchematicOnlyEdge } from '../../lib/agentCycleEdgeVisibility';
import { buildAgentCycleFlow } from '../../lib/agentCycleReactFlow';
import { getAgentNodeConnectionCards } from '../../lib/agentCycleNodeConnections';
import { getAgentMainRouteTransitionEdgeIds } from '../../lib/agentCycleTransitions';
import { getSimNode } from '../../lib/archSimGeometry';
import type { ArchitectureSchema, SimStep, SimStepPanel } from '../../types/architecture-simulation';
import { AgentCycleFlowEdge } from './AgentCycleFlowEdge';
import { AgentCycleFlowNode } from './AgentCycleFlowNode';
import { AgentCycleSelectNodeContext } from './agentCycleFlowContext';
import { AgentOptionalRagMcpExplainer } from './AgentOptionalRagMcpExplainer';
import { ArchitectureSimStepPanel } from './ArchitectureSimStepPanel';

const MIN_ZOOM = 0.35;
const MAX_ZOOM = 1.55;
const ZOOM_STEP = 0.12;

const nodeTypes = { agentCycle: AgentCycleFlowNode };
const edgeTypes = { agentCycle: AgentCycleFlowEdge };

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

type Props = {
  schema: ArchitectureSchema;
};

export function ArchitectureVerticalSimDiagram({ schema }: Props) {
  return (
    <ReactFlowProvider>
      <ArchitectureVerticalSimDiagramInner schema={schema} />
    </ReactFlowProvider>
  );
}

function ArchitectureVerticalSimDiagramInner({ schema }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showRag, setShowRag] = useState(false);
  const [showMcp, setShowMcp] = useState(false);
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const [nodeEdgeId, setNodeEdgeId] = useState<string | null>(null);
  const [transitionEdgeId, setTransitionEdgeId] = useState<string | null>(null);
  const [ragMcpIntroOpen, setRagMcpIntroOpen] = useState(false);
  const [selectedExplanationId, setSelectedExplanationId] = useState<AgentExplainerTopic | null>(
    null,
  );
  const reducedMotion = usePrefersReducedMotion();
  const narrow = useNarrowLayout();
  const playRef = useRef<number | null>(null);
  const flowRef = useRef<ReactFlowInstance | null>(null);
  const flowHostRef = useRef<HTMLDivElement | null>(null);
  const readableViewportRef = useRef<{ x: number; y: number; zoom: number } | null>(null);
  const initialOverviewFitDoneRef = useRef(false);

  const { zoomIn, zoomOut, setCenter, getViewport } = useReactFlow();

  const steps = schema.steps;
  const step: SimStep = steps[stepIndex];
  const activeNodeSet = useMemo(() => new Set(step.activeNodes), [step]);
  const activeEdgeSet = useMemo(() => new Set(step.activeEdges), [step]);

  const seenNodes = useMemo(() => {
    const s = new Set<string>();
    for (let i = 0; i <= stepIndex; i++) {
      steps[i].activeNodes.forEach((id) => s.add(id));
    }
    return s;
  }, [stepIndex, steps]);

  const seenEdges = useMemo(() => {
    const s = new Set<string>();
    for (let i = 0; i <= stepIndex; i++) {
      steps[i].activeEdges.forEach((id) => s.add(id));
    }
    return s;
  }, [stepIndex, steps]);

  const auxVisible = useMemo(
    () => (schema.aux ?? []).filter((a) => !a.optional),
    [schema.aux],
  );

  const optionalFlags = useMemo(() => ({ showRag, showMcp }), [showRag, showMcp]);

  const renderSchemaForNav = useMemo(
    () => applyAgentCycleOptional(schema, { showRag, showMcp }),
    [schema, showRag, showMcp],
  );

  const mainRouteTransitionIds = useMemo(
    () => getAgentMainRouteTransitionEdgeIds(renderSchemaForNav, optionalFlags),
    [renderSchemaForNav, optionalFlags],
  );

  const nodeConnectionCards = useMemo(() => {
    if (!focusedNodeId) return [];
    return getAgentNodeConnectionCards(focusedNodeId, renderSchemaForNav, optionalFlags);
  }, [focusedNodeId, renderSchemaForNav, optionalFlags]);

  const mainRouteNavIndex = useMemo(() => {
    if (!transitionEdgeId) return -1;
    return mainRouteTransitionIds.indexOf(transitionEdgeId);
  }, [transitionEdgeId, mainRouteTransitionIds]);

  const highlightEdgeId = nodeEdgeId ?? transitionEdgeId;

  const { nodes, edges, renderSchema } = useMemo(
    () =>
      buildAgentCycleFlow({
        schema,
        showRag,
        showMcp,
        activeNodeIds: activeNodeSet,
        seenNodeIds: seenNodes,
        activeEdgeIds: activeEdgeSet,
        seenEdgeIds: seenEdges,
        focusedNodeId,
        highlightEdgeId,
        markerEdgeId: step.markerEdgeId,
        reducedMotion,
      }),
    [
      schema,
      showRag,
      showMcp,
      activeNodeSet,
      seenNodes,
      activeEdgeSet,
      seenEdges,
      focusedNodeId,
      highlightEdgeId,
      step.markerEdgeId,
      reducedMotion,
    ],
  );

  const closeRagMcpIntro = useCallback(() => {
    setRagMcpIntroOpen(false);
  }, []);

  const openRagMcpIntro = useCallback((presetTopic?: AgentExplainerTopic | null) => {
    setRagMcpIntroOpen(true);
    if (presetTopic) setSelectedExplanationId(presetTopic);
  }, []);

  const onSelectNode = useCallback(
    (nodeId: string) => {
      closeRagMcpIntro();
      setFocusedNodeId(nodeId);
      setNodeEdgeId(null);
      setTransitionEdgeId(null);
    },
    [closeRagMcpIntro],
  );

  const goTransition = useCallback(
    (delta: number) => {
      const ids = mainRouteTransitionIds;
      if (!ids.length) return;
      let idx = mainRouteNavIndex;
      if (idx < 0) {
        if (delta <= 0) return;
        idx = 0;
      } else {
        idx = idx + delta;
        if (idx < 0 || idx >= ids.length) return;
      }
      setNodeEdgeId(null);
      setTransitionEdgeId(ids[idx]);
      closeRagMcpIntro();
    },
    [mainRouteTransitionIds, mainRouteNavIndex, closeRagMcpIntro],
  );

  const resetTransitionNav = useCallback(() => {
    const ids = mainRouteTransitionIds;
    if (!ids.length) return;
    setNodeEdgeId(null);
    setTransitionEdgeId(ids[0]);
    closeRagMcpIntro();
  }, [mainRouteTransitionIds, closeRagMcpIntro]);

  const go = useCallback(
    (index: number) => {
      closeRagMcpIntro();
      setStepIndex(Math.max(0, Math.min(steps.length - 1, index)));
    },
    [steps.length, closeRagMcpIntro],
  );

  const reset = useCallback(() => {
    setPlaying(false);
    setStepIndex(0);
    setFocusedNodeId(null);
    setNodeEdgeId(null);
    setTransitionEdgeId(null);
    closeRagMcpIntro();
  }, [closeRagMcpIntro]);

  const applyOverviewFit = useCallback(
    (duration = reducedMotion ? 0 : 260) => {
      const host = flowHostRef.current;
      const instance = flowRef.current;
      if (!host || !instance) return false;
      const viewW = host.clientWidth;
      const viewH = host.clientHeight;
      if (viewW < 48 || viewH < 48) return false;
      const { cx, cy, zoom } = computeAgentOverviewFit(
        renderSchema,
        viewW,
        viewH,
        40,
        MIN_ZOOM,
        MAX_ZOOM,
      );
      instance.setCenter(cx, cy, { zoom, duration });
      window.setTimeout(() => {
        readableViewportRef.current = getViewport();
      }, duration + 40);
      return true;
    },
    [getViewport, reducedMotion, renderSchema, setCenter],
  );

  const fitAll = useCallback(() => {
    applyOverviewFit(reducedMotion ? 0 : 260);
  }, [applyOverviewFit, reducedMotion]);

  const resetView = useCallback(() => {
    if (readableViewportRef.current) {
      const v = readableViewportRef.current;
      flowRef.current?.setViewport(v, { duration: reducedMotion ? 0 : 260 });
      return;
    }
    applyOverviewFit(reducedMotion ? 0 : 260);
  }, [applyOverviewFit, reducedMotion]);

  const zoomBy = useCallback(
    (delta: number) => {
      if (delta > 0) zoomIn({ duration: 120 });
      else zoomOut({ duration: 120 });
    },
    [zoomIn, zoomOut],
  );

  const onInit = useCallback((instance: ReactFlowInstance) => {
    flowRef.current = instance;
  }, []);

  useEffect(() => {
    const host = flowHostRef.current;
    if (!host) return;

    const tryInitialFit = () => {
      if (initialOverviewFitDoneRef.current) return;
      if (!flowRef.current) return;
      if (applyOverviewFit(0)) {
        initialOverviewFitDoneRef.current = true;
      }
    };

    const ro = new ResizeObserver(() => {
      tryInitialFit();
    });
    ro.observe(host);

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) tryInitialFit();
      },
      { threshold: 0.08 },
    );
    io.observe(host);
    tryInitialFit();

    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, [applyOverviewFit]);

  const prevOptionalRef = useRef(optionalFlags);
  useEffect(() => {
    if (
      prevOptionalRef.current.showRag === optionalFlags.showRag &&
      prevOptionalRef.current.showMcp === optionalFlags.showMcp
    ) {
      return;
    }
    prevOptionalRef.current = optionalFlags;
    const ids = getAgentMainRouteTransitionEdgeIds(renderSchemaForNav, optionalFlags);
    setNodeEdgeId(null);
    setTransitionEdgeId((prev) => (prev && ids.includes(prev) ? prev : null));
    if (!flowRef.current) return;
    const t = window.setTimeout(() => fitAll(), 60);
    return () => window.clearTimeout(t);
  }, [optionalFlags, fitAll, renderSchemaForNav]);

  useEffect(() => {
    if (nodeEdgeId && focusedNodeId) {
      const allowed = getAgentNodeConnectionCards(focusedNodeId, renderSchemaForNav, optionalFlags);
      if (!allowed.some((c) => c.edgeId === nodeEdgeId)) {
        setNodeEdgeId(null);
      }
    }
    if (!transitionEdgeId) return;
    if (!mainRouteTransitionIds.includes(transitionEdgeId)) {
      setTransitionEdgeId(null);
      return;
    }
  }, [
    focusedNodeId,
    nodeEdgeId,
    transitionEdgeId,
    mainRouteTransitionIds,
    renderSchemaForNav,
    optionalFlags,
  ]);

  useEffect(() => {
    if (!playing || reducedMotion) return;
    playRef.current = window.setInterval(() => {
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

  const focusedSimNode = focusedNodeId ? getSimNode(renderSchema, focusedNodeId) : undefined;
  const focusedNodeLabel = focusedSimNode?.label ?? focusedNodeId ?? '';

  const nodePanelView = focusedNodeId
    ? getAgentNodePanelView(focusedNodeId, focusedNodeLabel)
    : null;

  const transitionView =
    transitionEdgeId && !nodeEdgeId
      ? getAgentTransitionPanelView(transitionEdgeId, renderSchema)
      : undefined;

  const selectedConnectionCard = nodeEdgeId
    ? nodeConnectionCards.find((c) => c.edgeId === nodeEdgeId)
    : undefined;

  const nodeConnectionDetail = useMemo(() => {
    if (!focusedNodeId || !nodeEdgeId) return undefined;
    const view = getAgentTransitionPanelView(nodeEdgeId, renderSchema);
    if (!view) return undefined;
    const card = selectedConnectionCard;
    return {
      leadUk: view.leadUk,
      fromUk: view.fromUk,
      payloadUk: view.payloadUk,
      toUk: view.toUk,
      purposeUk: view.purposeUk,
      schematicOnly: isAgentSchematicOnlyEdge(nodeEdgeId),
      actionUk: card?.titleUk ?? view.titleUk,
    };
  }, [focusedNodeId, nodeEdgeId, renderSchema, selectedConnectionCard]);

  const panel: SimStepPanel = focusedNodeId && !nodePanelView
    ? nodePanel(schema, renderSchema, focusedNodeId, step)
    : step.panel;

  const panelBilingualTitle =
    focusedSimNode?.cardTitleEn && !nodeConnectionDetail
      ? {
          en: focusedSimNode.cardTitleEn,
          uk: focusedSimNode.cardTitleUk ?? focusedSimNode.label,
        }
      : undefined;

  const panelTitle =
    nodeConnectionDetail && selectedConnectionCard
      ? selectedConnectionCard.titleUk
      : transitionView?.titleUk
        ?? (nodePanelView?.titleUk ?? (focusedNodeId ? focusedNodeLabel : step.title));

  const topicLinks = useMemo(() => {
    const ids = new Set<string>();
    if (focusedNodeId) {
      const n = getSimNode(renderSchema, focusedNodeId);
      if (n) ids.add(n.topicId);
    }
    step.activeNodes.forEach((id) => {
      const n = getSimNode(renderSchema, id);
      if (n) ids.add(n.topicId);
    });
    return [...ids].map((topicId) => ({ topicId, label: getMapLabel(topicId) }));
  }, [focusedNodeId, renderSchema, step.activeNodes]);

  const onEdgeClick = useCallback(
    (_e: React.MouseEvent, edge: Edge) => {
      closeRagMcpIntro();
      const mainIdx = mainRouteTransitionIds.indexOf(edge.id);
      if (mainIdx >= 0) {
        setNodeEdgeId(null);
        setTransitionEdgeId(edge.id);
        return;
      }
      if (focusedNodeId) {
        const allowed = getAgentNodeConnectionCards(focusedNodeId, renderSchemaForNav, optionalFlags);
        if (allowed.some((c) => c.edgeId === edge.id)) {
          setNodeEdgeId(edge.id);
        }
      }
    },
    [mainRouteTransitionIds, focusedNodeId, renderSchemaForNav, optionalFlags, closeRagMcpIntro],
  );

  const onPaneClick = useCallback(() => {
    closeRagMcpIntro();
    setFocusedNodeId(null);
    setNodeEdgeId(null);
    setTransitionEdgeId(null);
  }, [closeRagMcpIntro]);

  const onSelectNodeConnection = useCallback((edgeId: string) => {
    setNodeEdgeId(edgeId);
  }, []);

  const transitionNavAtStart = mainRouteNavIndex <= 0;
  const transitionNavAtEnd =
    mainRouteTransitionIds.length === 0 ||
    (mainRouteNavIndex >= 0 && mainRouteNavIndex >= mainRouteTransitionIds.length - 1);
  const transitionNavLabel =
    mainRouteTransitionIds.length === 0
      ? ''
      : mainRouteNavIndex >= 0
        ? `Перехід ${mainRouteNavIndex + 1} із ${mainRouteTransitionIds.length}`
        : `Перехід — із ${mainRouteTransitionIds.length}`;

  return (
    <div className="arch-sim arch-sim--vertical">
      <div className="arch-sim-compact-head">
        <div className="arch-sim-compact-title">
          <h2 className="arch-sim-schema-title">{schema.title}</h2>
          <p className="arch-sim-goal muted small">{schema.subtitle}</p>
        </div>
        <div className="arch-sim-controls" role="toolbar" aria-label="Керування симуляцією">
          <span className="arch-sim-progress">
            Крок <strong>{stepIndex + 1}</strong> із {steps.length}: {step.title}
          </span>
          <div className="arch-sim-control-btns">
            <button
              type="button"
              className="arch-sim-btn arch-sim-btn-icon"
              onClick={() => setPlaying((p) => !p)}
              aria-pressed={playing}
              aria-label={playing ? 'Пауза' : 'Відтворити кроки'}
            >
              {playing ? '⏸' : '▶'}
            </button>
            <button
              type="button"
              className="arch-sim-btn"
              onClick={() => go(stepIndex - 1)}
              disabled={stepIndex === 0}
              aria-label="Попередній крок"
            >
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
            <button type="button" className="arch-sim-btn" onClick={reset} aria-label="Скинути симуляцію">
              ⟲
            </button>
          </div>
        </div>
      </div>
      <p className="arch-sim-disclaimer compact" role="note">{schema.disclaimer}</p>

      {schema.diagramRouteExampleUk ? (
        <p className="arch-sim-route-example" role="note">{schema.diagramRouteExampleUk}</p>
      ) : null}

      <div className="arch-vsim-chart-chrome" aria-label="Керування схемою та легенда">
        <div className="arch-vsim-chrome-row arch-vsim-chrome-row--tools" role="toolbar" aria-label="Масштаб схеми">
          <div className="arch-vsim-zoom-btn-group">
            <button
              type="button"
              className="arch-vsim-cyber-btn arch-vsim-cyber-btn--icon"
              onClick={() => zoomBy(ZOOM_STEP)}
              aria-label="Наблизити схему"
            >
              +
            </button>
            <button
              type="button"
              className="arch-vsim-cyber-btn arch-vsim-cyber-btn--icon"
              onClick={() => zoomBy(-ZOOM_STEP)}
              aria-label="Віддалити схему"
            >
              −
            </button>
            <button type="button" className="arch-vsim-cyber-btn" onClick={fitAll}>
              Вмістити
            </button>
            <button type="button" className="arch-vsim-cyber-btn" onClick={resetView}>
              Скинути вигляд
            </button>
          </div>
          <p className="arch-vsim-gesture-hint" role="note">
            <span className="arch-vsim-gesture-hint-icon" aria-hidden="true">◎</span>
            <span>Колесо — масштаб · Перетягування — рух схеми</span>
          </p>
          <div className="arch-vsim-transition-nav" role="toolbar" aria-label="Навігація основним маршрутом">
            <span className="arch-vsim-transition-nav-label">
              {transitionNavLabel || 'Перехід'}
            </span>
            <button
              type="button"
              className="arch-vsim-cyber-btn arch-vsim-cyber-btn--icon"
              onClick={() => goTransition(-1)}
              disabled={mainRouteTransitionIds.length === 0 || transitionNavAtStart}
              aria-label="Попередній перехід основного маршруту"
            >
              ←
            </button>
            <button
              type="button"
              className="arch-vsim-cyber-btn arch-vsim-cyber-btn--icon"
              onClick={() => goTransition(1)}
              disabled={
                mainRouteTransitionIds.length === 0 ||
                (mainRouteNavIndex >= 0 && transitionNavAtEnd)
              }
              aria-label="Наступний перехід основного маршруту"
            >
              →
            </button>
            <button
              type="button"
              className="arch-vsim-cyber-btn arch-vsim-cyber-btn--icon"
              onClick={resetTransitionNav}
              disabled={mainRouteTransitionIds.length === 0}
              aria-label="Перейти до першого переходу: CI → Код застосунку"
            >
              ⟲
            </button>
          </div>
        </div>
        <div className="arch-vsim-chrome-row arch-vsim-chrome-row--legend">
          <div className="arch-vsim-legend-panel">
            <div className="arch-vsim-legend-strip" aria-label="Типи вузлів">
              <span className="arch-vsim-legend-chip">
                <span className="arch-sim-legend-swatch role-human" /> Людина / CI
              </span>
              <span className="arch-vsim-legend-dot" aria-hidden="true">·</span>
              <span className="arch-vsim-legend-chip">
                <span className="arch-sim-legend-swatch role-code" /> Код
              </span>
              <span className="arch-vsim-legend-dot" aria-hidden="true">·</span>
              <span className="arch-vsim-legend-chip">
                <span className="arch-sim-legend-swatch role-llm" /> Модель
              </span>
              <span className="arch-vsim-legend-dot" aria-hidden="true">·</span>
              <span className="arch-vsim-legend-chip">
                <span className="arch-sim-legend-swatch role-tool" /> Інструмент
              </span>
              <span className="arch-vsim-legend-dot" aria-hidden="true">·</span>
              <span className="arch-vsim-legend-chip">
                <span className="arch-sim-legend-swatch role-data" /> Дані
              </span>
              <span className="arch-vsim-legend-dot" aria-hidden="true">·</span>
              <span className="arch-vsim-legend-chip">
                <span className="arch-sim-legend-swatch role-outcome" /> Результат
              </span>
              <span className="arch-vsim-legend-dot" aria-hidden="true">·</span>
              <label className="arch-vsim-switch" title="Додати блок пошуку документів на схему">
                <input
                  type="checkbox"
                  className="arch-vsim-switch-input"
                  checked={showRag}
                  onChange={(e) => setShowRag(e.target.checked)}
                />
                <span className="arch-vsim-switch-track" aria-hidden="true">
                  <span className="arch-vsim-switch-thumb" />
                </span>
                <span className="arch-vsim-switch-label">Показати RAG</span>
              </label>
              <span className="arch-vsim-legend-dot" aria-hidden="true">·</span>
              <label className="arch-vsim-switch" title="Показати MCP на шляху до інструмента">
                <input
                  type="checkbox"
                  className="arch-vsim-switch-input"
                  checked={showMcp}
                  onChange={(e) => setShowMcp(e.target.checked)}
                />
                <span className="arch-vsim-switch-track" aria-hidden="true">
                  <span className="arch-vsim-switch-thumb" />
                </span>
                <span className="arch-vsim-switch-label">Показати MCP</span>
              </label>
              <span className="arch-vsim-legend-dot" aria-hidden="true">·</span>
              <button
                type="button"
                className={`arch-vsim-cyber-btn arch-vsim-rag-mcp-intro-btn ${ragMcpIntroOpen ? 'is-active' : ''}`}
                aria-pressed={ragMcpIntroOpen}
                onClick={() => {
                  setFocusedNodeId(null);
                  setNodeEdgeId(null);
                  setTransitionEdgeId(null);
                  openRagMcpIntro();
                }}
              >
                Що таке RAG і MCP?
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="arch-sim-body arch-sim-body--vertical">
        <div className="arch-sim-canvas-col">
          <div
            ref={flowHostRef}
            className="arch-vsim-viewport arch-vsim-flow-host"
            role="region"
            aria-label={schema.svgLabel}
          >
            <AgentCycleSelectNodeContext.Provider value={onSelectNode}>
              <ReactFlow
                nodes={nodes as Node[]}
                edges={edges as Edge[]}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onInit={onInit}
                onEdgeClick={onEdgeClick}
                onPaneClick={onPaneClick}
                nodesDraggable={false}
                nodesConnectable={false}
                nodesFocusable
                edgesFocusable={false}
                autoPanOnNodeFocus={false}
                autoPanOnConnect={false}
                selectNodesOnDrag={false}
                panOnDrag
                panOnScroll={false}
                zoomOnScroll
                zoomOnPinch
                preventScrolling
                minZoom={MIN_ZOOM}
                maxZoom={MAX_ZOOM}
                proOptions={{ hideAttribution: true }}
                className="arch-vsim-react-flow"
              />
            </AgentCycleSelectNodeContext.Provider>
          </div>
        </div>

        <div className="arch-sim-panel-col">
          {ragMcpIntroOpen ? (
            <AgentOptionalRagMcpExplainer
              flags={optionalFlags}
              selectedExplanationId={selectedExplanationId}
              onSelectExplanation={setSelectedExplanationId}
            />
          ) : (
            <ArchitectureSimStepPanel
              title={panelTitle}
              stepIndex={stepIndex}
              stepCount={steps.length}
              panel={panel}
              focusedNode={!!focusedNodeId}
              nodeView={nodePanelView ?? undefined}
              panelBilingualTitle={panelBilingualTitle}
              transitionView={transitionView}
              onBackToStep={() => {
                setFocusedNodeId(null);
                setNodeEdgeId(null);
                setTransitionEdgeId(null);
              }}
              nodeConnectionCards={nodeConnectionCards}
              selectedNodeEdgeId={nodeEdgeId}
              onSelectNodeConnection={onSelectNodeConnection}
              nodeConnectionDetail={nodeConnectionDetail}
              topicLinks={topicLinks}
              exitConditions={
                focusedNodeId || transitionEdgeId || nodeEdgeId ? undefined : schema.exitConditions
              }
              auxItems={
                narrow
                  ? auxVisible.map((a) => ({
                      label: a.label,
                      summary: a.summary,
                      topicId: a.topicId,
                    }))
                  : undefined
              }
              onOpenRagMcpIntro={
                focusedNodeId === RAG_SEARCH_ID || focusedNodeId === MCP_ID
                  ? () => openRagMcpIntro(getAgentExplainerTopicForNode(focusedNodeId))
                  : undefined
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

function nodePanel(
  schema: ArchitectureSchema,
  renderSchema: ArchitectureSchema,
  nodeId: string,
  step: SimStep,
): SimStepPanel {
  const dedicated = getArchitectureNodePanel(schema.id, nodeId);
  if (dedicated) return dedicated;
  const node = getSimNode(renderSchema, nodeId);
  if (!node) return step.panel;
  return {
    what: `Вузол «${node.label}» на цій схемі. Пройдіть кроки симуляції, щоб побачити роль у потоці.`,
    who: node.cardActorUk ? `Виконує: ${node.cardActorUk}.` : 'Див. підпис на картці вузла.',
    input: 'Залежить від попереднього кроку в цій схемі.',
    output: node.cardOutcomeUk ?? 'Передається наступному вузлу за стрілками.',
    why: 'Частина навчального потоку цієї вкладки.',
    unknown: 'Деталі кроку — у поясненні активного кроку симуляції.',
    risks: 'Перевірте напрям стрілок на схемі.',
  };
}
