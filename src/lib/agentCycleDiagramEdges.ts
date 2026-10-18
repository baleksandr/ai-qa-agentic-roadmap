import { isMcpOptionalEdge, isRagOptionalEdge } from './agentCycleOptionalPaths';

/** Основна вісь login_spec (завжди читабельна). */
const SPINE_BASE = new Set([
  'e-human-harness',
  'e-harness-llm',
  'e-rag-enrich-llm',
  'e-rag-rag-enrich',
  'e-harness-rag-query',
  'e-llm-harness-call',
  'e-validation-tools',
  'e-validation-mcp',
  'e-mcp-tools',
]);

export function isAgentSpineEdge(edgeId: string, flags: { showRag: boolean; showMcp: boolean }): boolean {
  if (SPINE_BASE.has(edgeId)) return true;
  if (flags.showRag && isRagOptionalEdge(edgeId)) return true;
  if (flags.showMcp && isMcpOptionalEdge(edgeId)) return true;
  return false;
}

export function isAgentSecondaryEdge(
  edgeId: string,
  flags: { showRag: boolean; showMcp: boolean },
): boolean {
  return !isAgentSpineEdge(edgeId, flags);
}
