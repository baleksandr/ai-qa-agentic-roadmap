import { AGENT_SCHEMA } from '../../data/architecture/schema-agent';
import { ArchitectureDiagram } from './ArchitectureDiagram';

/** @deprecated Use ArchitectureAtlas — kept for direct import of agent-only sim */
export function AgentRunSimulation() {
  return <ArchitectureDiagram schema={AGENT_SCHEMA} />;
}
