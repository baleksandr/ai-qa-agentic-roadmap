import { getAgentTransitionPanelView } from '../data/architecture/agent-cycle-edge-panels';
import { getSimNode } from './archSimGeometry';
import type { ArchitectureSchema } from '../types/architecture-simulation';
import type { AgentOptionalFlags } from './agentCycleOptionalNodes';
import { isAgentOverviewEdge, isAgentSchematicOnlyEdge } from './agentCycleEdgeVisibility';

export type AgentNodeConnectionCard = {
  edgeId: string;
  titleUk: string;
  fromUk: string;
  toUk: string;
  payloadUk: string;
  summaryUk?: string;
  schematicOnly: boolean;
};

const HARNESS_CARDS: { edgeId: string; titleUk: string }[] = [
  { edgeId: 'e-harness-llm', titleUk: 'Надсилає запит моделі' },
];

const RAG_HARNESS_CARDS: { edgeId: string; titleUk: string }[] = [
  { edgeId: 'e-harness-rag-query', titleUk: 'Пошук документів' },
  { edgeId: 'e-rag-rag-enrich', titleUk: 'Фрагменти до запиту' },
  { edgeId: 'e-rag-enrich-llm', titleUk: 'Запит моделі з документами' },
];

function cardFromEdge(
  edgeId: string,
  titleUk: string,
  schema: ArchitectureSchema,
): AgentNodeConnectionCard | undefined {
  const view = getAgentTransitionPanelView(edgeId, schema);
  if (!view) return undefined;
  return {
    edgeId,
    titleUk,
    fromUk: view.fromUk,
    toUk: view.toUk,
    payloadUk: view.payloadUk,
    summaryUk: view.purposeUk,
    schematicOnly: isAgentSchematicOnlyEdge(edgeId),
  };
}

export function getAgentNodeConnectionCards(
  nodeId: string,
  schema: ArchitectureSchema,
  flags: AgentOptionalFlags,
): AgentNodeConnectionCard[] {
  if (nodeId === 'harness') {
    const cards: AgentNodeConnectionCard[] = [];
    for (const spec of HARNESS_CARDS) {
      const edge = schema.edges.find((e) => e.id === spec.edgeId);
      if (!edge) continue;
      if (spec.edgeId === 'e-harness-llm' && flags.showRag) continue;
      const built = cardFromEdge(spec.edgeId, spec.titleUk, schema);
      if (built) cards.push(built);
    }
    if (flags.showRag) {
      for (const spec of RAG_HARNESS_CARDS) {
        const edge = schema.edges.find((e) => e.id === spec.edgeId);
        if (!edge) continue;
        const built = cardFromEdge(spec.edgeId, spec.titleUk, schema);
        if (built) cards.push(built);
      }
    }
    return cards;
  }

  if (nodeId === 'validation') {
    const deny = cardFromEdge('e-validation-deny', 'Заборона (deny)', schema);
    return deny ? [deny] : [];
  }

  if (nodeId === 'llm') {
    const direct = cardFromEdge('e-llm-direct-prepare', 'Відповідь без інструмента', schema);
    return direct ? [direct] : [];
  }

  const cards: AgentNodeConnectionCard[] = [];
  for (const edge of schema.edges) {
    if (edge.from !== nodeId && edge.to !== nodeId) continue;
    if (isAgentOverviewEdge(edge.id, flags)) continue;
    const fromNode = getSimNode(schema, edge.from);
    const toNode = getSimNode(schema, edge.to);
    const routeFallback = `${fromNode?.label ?? edge.from} → ${toNode?.label ?? edge.to}`;
    const titleUk =
      edge.label?.trim() && !edge.label.includes('→')
        ? edge.label.trim()
        : routeFallback.split('→')[0]?.trim() || routeFallback;
    const built = cardFromEdge(edge.id, titleUk, schema);
    if (built) cards.push(built);
  }
  return cards;
}

export function getAgentNodeConnectionEdgeIds(
  nodeId: string,
  schema: ArchitectureSchema,
  flags: AgentOptionalFlags,
): string[] {
  return getAgentNodeConnectionCards(nodeId, schema, flags).map((c) => c.edgeId);
}
