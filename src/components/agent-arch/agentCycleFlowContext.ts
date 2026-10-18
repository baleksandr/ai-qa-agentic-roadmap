import { createContext, useContext } from 'react';

export const AgentCycleSelectNodeContext = createContext<(nodeId: string) => void>(() => {});

export function useAgentCycleSelectNode() {
  return useContext(AgentCycleSelectNodeContext);
}
