import type { AgentExplainerTopic } from '../data/architecture/agent-cycle-optional-explainer-content';
import type { SimNode } from '../types/architecture-simulation';

export type AgentOptionalFlags = { showRag: boolean; showMcp: boolean };

export const RAG_SEARCH_ID = 'rag-search';
export const RAG_ENRICH_ID = 'rag-enrich';
export const MCP_ID = 'mcp-bridge';

export const RAG_SEARCH_NODE: SimNode = {
  id: RAG_SEARCH_ID,
  label: 'Пошук документів',
  cardTitleEn: 'Document search · RAG',
  cardTitleUk: 'Пошук документів',
  shortLabel: 'RAG',
  role: 'code',
  topicId: 'concept-03',
  x: 0,
  y: 0,
  w: 208,
  h: 116,
  mobileOrder: 50,
  diagramLane: 'side',
  cardActorUk: '',
  cardOutcomeUk: 'Знаходить фрагменти, які можуть допомогти з відповіддю.',
};

export const RAG_ENRICH_NODE: SimNode = {
  id: RAG_ENRICH_ID,
  label: 'Додавання знайденого до запиту',
  cardTitleEn: 'Context assembly',
  cardTitleUk: 'Додавання знайденого до запиту',
  shortLabel: 'Запит + документи',
  role: 'code',
  topicId: 'concept-03',
  x: 0,
  y: 0,
  w: 300,
  h: 88,
  mobileOrder: 51,
  diagramLane: 'main',
  cardActorUk: '',
  cardOutcomeUk: 'Код додає знайдені фрагменти до запиту моделі.',
};

/** Вузол на схемі → тема в розділі «RAG і MCP для новачка». */
export function getAgentExplainerTopicForNode(nodeId: string): AgentExplainerTopic | null {
  if (nodeId === RAG_SEARCH_ID || nodeId === RAG_ENRICH_ID) return 'rag';
  if (nodeId === MCP_ID) return 'mcp';
  return null;
}

export const MCP_NODE: SimNode = {
  id: MCP_ID,
  label: 'MCP-підключення',
  cardTitleEn: 'MCP connection',
  cardTitleUk: 'MCP-підключення',
  shortLabel: 'MCP',
  role: 'tool',
  topicId: 'concept-06',
  x: 0,
  y: 0,
  w: 300,
  h: 104,
  mobileOrder: 52,
  diagramLane: 'main',
  cardActorUk: '',
  cardOutcomeUk: 'З’єднує застосунок із дозволеним інструментом.',
};
