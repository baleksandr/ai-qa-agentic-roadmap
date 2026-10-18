import { MarkerType, type Edge, type Node } from '@xyflow/react';
import type { SimEdge, SimNode } from '../types/architecture-simulation';
import type { ArchitectureSchema } from '../types/architecture-simulation';
import { edgePathForLayout } from './agentCycleDiagramLayout';
import {
  getEdgeDiagramLabel,
  getHighlightEndpointNodeIds,
  shouldDrawAgentEdgeOnCanvas,
  shouldShowAgentDiagramEdge,
} from './agentCycleEdgeVisibility';
import {
  applyAgentCycleOptional,
  isMcpOptionalEdge,
  isMcpOptionalNode,
  isRagOptionalEdge,
  isRagOptionalNode,
} from './agentCycleOptionalPaths';
import { MCP_ID, RAG_SEARCH_ID } from './agentCycleOptionalNodes';
import { edgeColorForRole } from './archVsimRoleColors';
import { getSimNode } from './archSimGeometry';

export type AgentCycleNodeData = {
  simId: string;
  title: string;
  actor: string;
  outcome?: string;
  role: SimNode['role'];
  dataStore: boolean;
  sideLane: boolean;
  isActive: boolean;
  isVisited: boolean;
  isFuture: boolean;
  isPicked: boolean;
  isStepActive: boolean;
  isTransitionEndpoint: boolean;
  isTransitionDim: boolean;
  optionalAccent?: 'rag' | 'mcp';
  optionBadgeUk?: 'RAG' | 'MCP';
  roleChipUk?: string;
  cardTitleEn?: string;
  cardTitleUk?: string;
};

export type AgentCycleEdgeData = {
  pathD: string;
  simEdgeId: string;
  showMarker: boolean;
  markerX?: number;
  markerY?: number;
  optionalPath?: boolean;
  optionalAccent?: 'rag' | 'mcp';
  isTransitionHighlight?: boolean;
};

function sourceHandle(port?: string): string | undefined {
  if (!port) return undefined;
  return `s-${port}`;
}

function targetHandle(port?: string): string | undefined {
  if (!port) return undefined;
  return `t-${port}`;
}

function roleChipUk(role: SimNode['role']): string {
  switch (role) {
    case 'human':
      return 'CI / людина';
    case 'llm':
      return 'модель';
    case 'code':
      return 'код';
    case 'tool':
      return 'інструмент';
    case 'data':
      return 'дані';
    case 'outcome':
      return 'результат';
    default:
      return '';
  }
}

function roleChipForNode(node: SimNode): string {
  if (node.id === RAG_SEARCH_ID) return 'КОД · ПОШУК';
  if (node.id === MCP_ID) return 'КОД · ПІДКЛЮЧЕННЯ';
  return roleChipUk(node.role);
}

function actorFallback(role: SimNode['role']) {
  switch (role) {
    case 'human':
      return 'CI або людина';
    case 'llm':
      return 'модель';
    case 'code':
      return 'код застосунку';
    case 'tool':
      return 'інструмент';
    case 'data':
      return 'файли / дані';
    case 'outcome':
      return 'код застосунку';
    default:
      return '';
  }
}

export type BuildFlowArgs = {
  schema: ArchitectureSchema;
  showRag: boolean;
  showMcp: boolean;
  activeNodeIds: Set<string>;
  seenNodeIds: Set<string>;
  activeEdgeIds: Set<string>;
  seenEdgeIds: Set<string>;
  focusedNodeId: string | null;
  highlightEdgeId: string | null;
  markerEdgeId?: string;
  reducedMotion: boolean;
};

const TRANSITION_STROKE = '#42ff8a';
const TRANSITION_GLOW = 'drop-shadow(0 0 8px rgba(66, 255, 138, 0.55))';
const RAG_OPTION_STROKE = '#7ed8ff';
const RAG_OPTION_GLOW = 'drop-shadow(0 0 5px rgba(110, 210, 255, 0.75))';
const MCP_OPTION_STROKE = '#d4a8ff';
const MCP_OPTION_GLOW = 'drop-shadow(0 0 5px rgba(200, 150, 255, 0.72))';

const EDGE_LABEL_STYLE = {
  fill: '#d4e8ff',
  fontSize: 10,
  fontWeight: 500,
} as const;

const EDGE_LABEL_BG = {
  fill: 'rgba(8, 12, 24, 0.94)',
  fillOpacity: 0.94,
} as const;

export function buildAgentCycleFlow({
  schema,
  showRag,
  showMcp,
  activeNodeIds,
  seenNodeIds,
  activeEdgeIds,
  seenEdgeIds,
  focusedNodeId,
  highlightEdgeId,
  reducedMotion,
}: BuildFlowArgs): { nodes: Node[]; edges: Edge[]; renderSchema: ArchitectureSchema } {
  const optionalFlags = { showRag, showMcp };
  const renderSchema = applyAgentCycleOptional(schema, { showRag, showMcp });

  const edgeContext = { highlightEdgeId };

  const endpointIds = getHighlightEndpointNodeIds(renderSchema, highlightEdgeId);

  const flowNodes: Node<AgentCycleNodeData>[] = renderSchema.nodes.map((node) => {
    const isActive = activeNodeIds.has(node.id);
    const isVisited = !isActive && seenNodeIds.has(node.id);
    const isFuture = !isActive && !isVisited;
    const isPicked = focusedNodeId === node.id;
    const isStepActive = isActive && !isPicked;
    const isTransitionEndpoint = !isPicked && endpointIds.has(node.id);
    const optionalAccent =
      showRag && isRagOptionalNode(node.id)
        ? 'rag'
        : showMcp && isMcpOptionalNode(node.id)
          ? 'mcp'
          : undefined;
    const isTransitionDim =
      !!highlightEdgeId &&
      !isPicked &&
      !endpointIds.has(node.id) &&
      !optionalAccent;
    return {
      id: node.id,
      type: 'agentCycle',
      position: { x: node.x, y: node.y },
      data: {
        simId: node.id,
        title: node.cardTitleUk ?? node.label,
        cardTitleEn: node.cardTitleEn,
        cardTitleUk: node.cardTitleUk ?? node.label,
        roleChipUk: roleChipForNode(node),
        actor: node.cardActorUk ?? actorFallback(node.role),
        outcome: node.cardOutcomeUk,
        role: node.role,
        dataStore: !!node.diagramDataStore,
        sideLane: node.diagramLane === 'side',
        isActive,
        isVisited,
        isFuture,
        isPicked,
        isStepActive,
        isTransitionEndpoint,
        isTransitionDim,
        optionalAccent,
        optionBadgeUk:
          optionalAccent === 'rag' ? 'RAG' : optionalAccent === 'mcp' ? 'MCP' : undefined,
      },
      style: { width: node.w, height: node.h },
      draggable: false,
      selectable: false,
      connectable: false,
    };
  });

  const edges: Edge<AgentCycleEdgeData>[] = renderSchema.edges
    .filter((simEdge) => shouldShowAgentDiagramEdge(simEdge, optionalFlags, edgeContext))
    .filter((simEdge) => shouldDrawAgentEdgeOnCanvas(simEdge.id, optionalFlags, edgeContext))
    .map((simEdge) => {
      const isActive = activeEdgeIds.has(simEdge.id);
      const isVisited = !isActive && seenEdgeIds.has(simEdge.id);
      const isFuture = !isActive && !isVisited;
      const isTransitionHighlight = highlightEdgeId === simEdge.id;
      const isRagEdge = showRag && isRagOptionalEdge(simEdge.id);
      const isMcpEdge = showMcp && isMcpOptionalEdge(simEdge.id);
      const fromNode = getSimNode(renderSchema, simEdge.from);
      const role = fromNode?.role ?? 'code';
      const emphasis = isTransitionHighlight ? 'focused' : isActive ? 'active' : 'idle';
      const stroke = isTransitionHighlight
        ? TRANSITION_STROKE
        : isRagEdge
          ? RAG_OPTION_STROKE
          : isMcpEdge
            ? MCP_OPTION_STROKE
            : edgeColorForRole(
                role,
                emphasis === 'focused' ? 'focused' : emphasis === 'active' ? 'active' : 'idle',
              );
      const strokeWidth = isTransitionHighlight
        ? 4
        : isRagEdge || isMcpEdge
          ? 4
          : isActive
            ? 3
            : 2;
      const pathD = edgePathForLayout(renderSchema, simEdge);
      // Крок симуляції не малює окрему крапку на ребрі — лише наконечник стрілки.
      const showMarker = false;

      const labelText = getEdgeDiagramLabel(simEdge.id, simEdge.label ?? '');
      const showLabel =
        !!labelText &&
        (simEdge.id === 'e-harness-state-write' ||
          simEdge.id === 'e-state-harness-read' ||
          isTransitionHighlight);

      return {
        id: simEdge.id,
        source: simEdge.from,
        target: simEdge.to,
        sourceHandle: sourceHandle(simEdge.fromPort),
        targetHandle: targetHandle(simEdge.toPort),
        type: 'agentCycle',
        data: {
          pathD,
          simEdgeId: simEdge.id,
          showMarker,
          markerX: undefined,
          markerY: undefined,
          optionalPath: isRagEdge || isMcpEdge,
          optionalAccent: isRagEdge ? 'rag' : isMcpEdge ? 'mcp' : undefined,
          isTransitionHighlight,
        },
        label: showLabel ? labelText : undefined,
        labelStyle: EDGE_LABEL_STYLE,
        labelBgStyle: EDGE_LABEL_BG,
        labelBgPadding: [5, 7],
        labelBgBorderRadius: 4,
        animated: (isActive || isTransitionHighlight) && !reducedMotion && !simEdge.failureBranch,
        style: {
          stroke,
          strokeWidth,
          strokeDasharray: simEdge.failureBranch ? '5 6' : undefined,
          opacity: (() => {
            if (isTransitionHighlight) return 1;
            if (isRagEdge || isMcpEdge) return 1;
            if (highlightEdgeId && !isTransitionHighlight) return 0.82;
            if (isFuture) return 0.58;
            if (isVisited) return 0.78;
            return 1;
          })(),
          filter: isTransitionHighlight
            ? TRANSITION_GLOW
            : isRagEdge
              ? RAG_OPTION_GLOW
              : isMcpEdge
                ? MCP_OPTION_GLOW
                : undefined,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: stroke,
          width: 22,
          height: 22,
        },
        focusable: false,
        selectable: false,
        interactionWidth: 18,
      };
    });

  return { nodes: flowNodes, edges, renderSchema };
}

export function nodeVisible(node: SimNode, _showOptional: boolean) {
  return !node.optional;
}

export function edgeVisible(edge: SimEdge, renderSchema: ArchitectureSchema, _showOptional: boolean) {
  if (edge.optional) return false;
  const from = getSimNode(renderSchema, edge.from);
  const to = getSimNode(renderSchema, edge.to);
  if (!from || !to) return false;
  return true;
}
