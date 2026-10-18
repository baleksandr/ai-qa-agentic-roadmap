import type { ArchitectureSchema } from '../types/architecture-simulation';
import type { AgentOptionalFlags } from './agentCycleOptionalNodes';

/** Бічні зв’язки стану run (після старту, перед шляхом до моделі / RAG). */
const STATE_ROUTE_AFTER_START: string[] = ['e-harness-state-write', 'e-state-harness-read'];

/** Базовий видимий маршрут CI → Result (без RAG/MCP замін). */
const MAIN_ROUTE_SPINE: string[] = [
  'e-human-harness',
  ...STATE_ROUTE_AFTER_START,
  'e-harness-llm',
  'e-llm-harness-call',
  'e-validation-tools',
  'e-tools-tool-ingest',
  'e-tool-ingest-llm-refine',
  'e-llm-refine-prepare',
  'e-prepare-result',
];

const RAG_SPINE_REPLACE: string[] = [
  'e-harness-rag-query',
  'e-rag-rag-enrich',
  'e-rag-enrich-llm',
];

const MCP_SPINE_REPLACE: string[] = ['e-validation-mcp', 'e-mcp-tools'];

/**
 * Послідовність переходів для навігації «Перехід ← → ⟲» (лише видимий основний маршрут).
 * Очікувана довжина: 10 / 12 (RAG) / 11 (MCP) / 13 (обидва).
 */
export function getAgentMainRouteTransitionEdgeIds(
  schema: ArchitectureSchema,
  flags: AgentOptionalFlags,
): string[] {
  const present = new Set(schema.edges.map((e) => e.id));
  const ids: string[] = [];

  for (const edgeId of MAIN_ROUTE_SPINE) {
    if (edgeId === 'e-harness-llm' && flags.showRag) {
      for (const id of RAG_SPINE_REPLACE) {
        if (present.has(id)) ids.push(id);
      }
      continue;
    }
    if (edgeId === 'e-validation-tools' && flags.showMcp) {
      for (const id of MCP_SPINE_REPLACE) {
        if (present.has(id)) ids.push(id);
      }
      continue;
    }
    if (present.has(edgeId)) ids.push(edgeId);
  }

  return ids;
}

export function isAgentMainRouteSideStateEdge(edgeId: string): boolean {
  return edgeId === 'e-harness-state-write' || edgeId === 'e-state-harness-read';
}

export function clampTransitionIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return Math.max(0, Math.min(length - 1, index));
}
