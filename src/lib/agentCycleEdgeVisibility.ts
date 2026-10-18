import type { ArchitectureSchema, SimEdge } from '../types/architecture-simulation';
import type { AgentOptionalFlags } from './agentCycleOptionalNodes';

export type AgentDiagramEdgeContext = {
  /** Єдиний додатковий маршрут на полотні (перехід або зв’язок обраної картки). */
  highlightEdgeId: string | null;
};

export const AGENT_STATE_WRITE_ID = 'e-harness-state-write';
export const AGENT_STATE_READ_ID = 'e-state-harness-read';

const SCHEMATIC_ONLY_EDGE_IDS = new Set([
  'e-validation-deny',
  'e-llm-direct-prepare',
  'e-tools-harness',
  'e-tool-fail',
  'e-llm-done',
]);

function isMainSpineDown(edgeId: string, flags: AgentOptionalFlags): boolean {
  if (edgeId === 'e-human-harness') return true;
  if (edgeId === 'e-llm-harness-call') return true;

  if (flags.showMcp) {
    if (edgeId === 'e-validation-mcp' || edgeId === 'e-mcp-tools') return true;
  } else if (edgeId === 'e-validation-tools') {
    return true;
  }

  if (flags.showRag) {
    if (
      edgeId === 'e-harness-rag-query' ||
      edgeId === 'e-rag-rag-enrich' ||
      edgeId === 'e-rag-enrich-llm'
    ) {
      return true;
    }
  } else if (edgeId === 'e-harness-llm') {
    return true;
  }

  if (edgeId === 'e-tools-tool-ingest') return true;
  if (edgeId === 'e-tool-ingest-llm-refine') return true;
  if (edgeId === 'e-llm-refine-prepare') return true;
  if (edgeId === 'e-prepare-result') return true;
  return false;
}

/** Завжди на полотні: повний навчальний маршрут згори вниз + бічні дані. */
export function isAgentOverviewEdge(edgeId: string, flags: AgentOptionalFlags): boolean {
  if (isMainSpineDown(edgeId, flags)) return true;
  if (edgeId === AGENT_STATE_WRITE_ID || edgeId === AGENT_STATE_READ_ID) return true;
  if (edgeId === 'e-artifacts-tools') return true;
  return false;
}

export function isAgentSchematicOnlyEdge(edgeId: string): boolean {
  return SCHEMATIC_ONLY_EDGE_IDS.has(edgeId);
}

export function shouldShowAgentDiagramEdge(
  edge: SimEdge,
  flags: AgentOptionalFlags,
  ctx: AgentDiagramEdgeContext,
): boolean {
  if (isAgentOverviewEdge(edge.id, flags)) return true;
  if (ctx.highlightEdgeId === edge.id) return true;
  return false;
}

export function shouldDrawAgentEdgeOnCanvas(
  edgeId: string,
  flags: AgentOptionalFlags,
  ctx: AgentDiagramEdgeContext,
): boolean {
  if (isAgentOverviewEdge(edgeId, flags)) return true;
  if (ctx.highlightEdgeId === edgeId && isAgentSchematicOnlyEdge(edgeId)) return false;
  return true;
}

export function getHighlightEndpointNodeIds(
  schema: ArchitectureSchema,
  highlightEdgeId: string | null,
): Set<string> {
  const ids = new Set<string>();
  if (!highlightEdgeId) return ids;
  const edge = schema.edges.find((e) => e.id === highlightEdgeId);
  if (!edge) return ids;
  ids.add(edge.from);
  ids.add(edge.to);
  return ids;
}

export function nodeHasHiddenAgentTransitions(
  nodeId: string,
  schema: ArchitectureSchema,
  flags: AgentOptionalFlags,
): boolean {
  for (const edge of schema.edges) {
    if (edge.from !== nodeId && edge.to !== nodeId) continue;
    if (!isAgentOverviewEdge(edge.id, flags)) return true;
  }
  return false;
}

export function getEdgeDiagramLabel(edgeId: string, fallbackLabel: string): string | undefined {
  if (edgeId === AGENT_STATE_WRITE_ID) return 'зберегти прогрес';
  if (edgeId === AGENT_STATE_READ_ID) return 'код читає прогрес перед наступним кроком';
  const map: Record<string, string> = {
    'e-human-harness': 'старт run',
    'e-harness-llm': 'запит до моделі',
    'e-rag-enrich-llm': 'запит з документами',
    'e-llm-harness-call': 'пропозиція інструмента',
    'e-validation-tools': 'дозвіл',
    'e-validation-mcp': 'до MCP',
    'e-mcp-tools': 'виклик інструмента',
    'e-tools-tool-ingest': 'результат інструмента',
    'e-tool-ingest-llm-refine': 'запит з фактами звіту',
    'e-llm-refine-prepare': 'до підготовки результату',
    'e-prepare-result': 'підсумок для людини',
    'e-llm-direct-prepare': 'без інструмента',
    'e-validation-deny': 'заборона',
    'e-tools-artifacts': 'читання файлу',
    'e-artifacts-tools': 'фрагмент звіту',
    'e-harness-rag-query': 'пошуковий запит',
    'e-rag-rag-enrich': 'фрагменти документів',
  };
  return map[edgeId] ?? (fallbackLabel?.trim() ? fallbackLabel : undefined);
}
