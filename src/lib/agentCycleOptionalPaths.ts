import type { ArchitectureSchema, SimEdge } from '../types/architecture-simulation';
import { computeAgentCycleLayout } from './agentCycleDiagramLayout';
import {
  MCP_ID,
  RAG_ENRICH_ID,
  RAG_SEARCH_ID,
  type AgentOptionalFlags,
} from './agentCycleOptionalNodes';

export type { AgentOptionalFlags } from './agentCycleOptionalNodes';

export {
  MCP_ID,
  MCP_NODE,
  RAG_ENRICH_ID,
  RAG_ENRICH_NODE,
  RAG_SEARCH_ID,
  RAG_SEARCH_NODE,
} from './agentCycleOptionalNodes';

const RAG_EDGE_IDS = new Set([
  'e-harness-rag-query',
  'e-rag-rag-enrich',
  'e-rag-enrich-llm',
]);

const MCP_EDGE_IDS = new Set(['e-validation-mcp', 'e-mcp-tools']);

const RAG_EDGES: SimEdge[] = [
  {
    id: 'e-harness-rag-query',
    from: 'harness',
    to: RAG_SEARCH_ID,
    label: 'пошук',
    fromPort: 'left',
    toPort: 'right',
  },
  {
    id: 'e-rag-rag-enrich',
    from: RAG_SEARCH_ID,
    to: RAG_ENRICH_ID,
    label: 'фрагменти',
    fromPort: 'right',
    toPort: 'left',
  },
  {
    id: 'e-rag-enrich-llm',
    from: RAG_ENRICH_ID,
    to: 'llm',
    label: 'з фрагментами',
    fromPort: 'bottom',
    toPort: 'top',
  },
];

const MCP_EDGES: SimEdge[] = [
  {
    id: 'e-validation-mcp',
    from: 'validation',
    to: MCP_ID,
    label: 'до MCP',
    fromPort: 'bottom',
    toPort: 'top',
  },
  {
    id: 'e-mcp-tools',
    from: MCP_ID,
    to: 'tools',
    label: 'виклик MCP',
    fromPort: 'bottom',
    toPort: 'top',
  },
];

export function applyAgentCycleOptional(
  schema: ArchitectureSchema,
  flags: AgentOptionalFlags,
): ArchitectureSchema & { spineLabels: { edgeId: string; x: number; y: number; text: string }[] } {
  let edges = schema.edges.filter((e) => !RAG_EDGE_IDS.has(e.id) && !MCP_EDGE_IDS.has(e.id));

  if (flags.showRag) {
    edges = edges.filter((e) => e.id !== 'e-harness-llm');
    edges.push(...RAG_EDGES);
  }

  if (flags.showMcp) {
    edges = edges.filter((e) => e.id !== 'e-validation-tools');
    edges.push(...MCP_EDGES);
  }

  const workSchema: ArchitectureSchema = { ...schema, edges };
  const layout = computeAgentCycleLayout(workSchema, flags);

  return {
    ...schema,
    viewW: layout.viewW,
    viewH: layout.viewH,
    nodes: layout.nodes,
    edges: layout.edges,
    spineLabels: layout.spineLabels,
  };
}

export function isRagOptionalEdge(edgeId: string): boolean {
  return RAG_EDGE_IDS.has(edgeId);
}

export function isMcpOptionalEdge(edgeId: string): boolean {
  return MCP_EDGE_IDS.has(edgeId);
}

export function isOptionalPathEdge(edgeId: string): boolean {
  return isRagOptionalEdge(edgeId) || isMcpOptionalEdge(edgeId);
}

export function isRagOptionalNode(nodeId: string): boolean {
  return nodeId === RAG_SEARCH_ID || nodeId === RAG_ENRICH_ID;
}

export function isMcpOptionalNode(nodeId: string): boolean {
  return nodeId === MCP_ID;
}

export const AGENT_OPTIONAL_NODE_IDS = new Set([RAG_SEARCH_ID, RAG_ENRICH_ID, MCP_ID]);
