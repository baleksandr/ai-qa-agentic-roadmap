import type { ArchitectureSchema } from '../../types/architecture-simulation';
import { CONCEPT_LAYERS_SCHEMA } from './schema-concept-layers';
import { AGENT_SCHEMA } from './schema-agent';
import { HARNESS_SCHEMA } from './schema-harness';
import { TOOL_CALLING_SCHEMA } from './schema-tool-calling';
import { RAG_SCHEMA } from './schema-rag';
import { CAG_SCHEMA } from './schema-cag';
import { MCP_SCHEMA } from './schema-mcp';
import { COMBINED_SCHEMA } from './schema-combined';

export type ArchitectureTabId =
  | 'concept-layers'
  | 'agent'
  | 'tool-calling'
  | 'harness'
  | 'rag'
  | 'cag'
  | 'mcp'
  | 'combined'
  | 'compare';

export const ARCHITECTURE_TABS: { id: ArchitectureTabId; label: string }[] = [
  { id: 'concept-layers', label: 'LLM · RAG · Agent · System' },
  { id: 'agent', label: 'Агент: загальний цикл' },
  { id: 'tool-calling', label: 'Tool Calling' },
  { id: 'harness', label: 'Agent Harness' },
  { id: 'rag', label: 'RAG' },
  { id: 'cag', label: 'Підготовлений контекст (V10)' },
  { id: 'mcp', label: 'MCP' },
  { id: 'combined', label: 'У спільному агенті' },
  { id: 'compare', label: 'Порівняти' },
];

export const SCHEMA_BY_TAB: Record<Exclude<ArchitectureTabId, 'compare'>, ArchitectureSchema> = {
  'concept-layers': CONCEPT_LAYERS_SCHEMA,
  agent: AGENT_SCHEMA,
  'tool-calling': TOOL_CALLING_SCHEMA,
  harness: HARNESS_SCHEMA,
  rag: RAG_SCHEMA,
  cag: CAG_SCHEMA,
  mcp: MCP_SCHEMA,
  combined: COMBINED_SCHEMA,
};
