import type { ArchitectureSchema } from '../../types/architecture-simulation';

export const MCP_SCHEMA: ArchitectureSchema = {
  id: 'mcp',
  tabLabel: 'MCP',
  title: 'MCP — Model Context Protocol',
  subtitle: 'Стандарт підключення інструментів і джерел даних',
  disclaimer: 'MCP — не модель, не knowledge store, не agent loop. Це протокол між client і server.',
  svgLabel: 'MCP: agent client, server, tool',
  viewW: 1000,
  viewH: 440,
  nodes: [
    { id: 'app', label: 'Agent application', shortLabel: 'App', role: 'code', topicId: 'concept-10', x: 40, y: 200, w: 170, h: 72, mobileOrder: 1 },
    { id: 'client', label: 'MCP client', shortLabel: 'Client', role: 'code', topicId: 'concept-10', x: 260, y: 200, w: 140, h: 72, mobileOrder: 2 },
    { id: 'server', label: 'MCP server', shortLabel: 'Server', role: 'code', topicId: 'concept-10', x: 480, y: 200, w: 150, h: 72, mobileOrder: 3 },
    { id: 'tool', label: 'Allowed Tool', shortLabel: 'Tool', role: 'tool', topicId: 'concept-10', x: 700, y: 160, w: 170, h: 72, mobileOrder: 4 },
    { id: 'data', label: 'Jira / CI / Logs', shortLabel: 'Data', role: 'data', topicId: 'lab-6', x: 700, y: 300, w: 170, h: 64, mobileOrder: 5 },
    { id: 'ctx', label: 'Agent Context', shortLabel: 'Context', role: 'data', topicId: 'concept-04', x: 260, y: 380, w: 160, h: 64, mobileOrder: 6 },
    { id: 'llm', label: 'LLM in App', shortLabel: 'LLM', role: 'llm', topicId: 'concept-14', x: 40, y: 380, w: 120, h: 64, mobileOrder: 7 },
  ],
  edges: [
    { id: 'e-app-client', from: 'app', to: 'client', label: 'tool call' },
    { id: 'e-client-server', from: 'client', to: 'server', label: 'MCP protocol' },
    { id: 'e-server-tool', from: 'server', to: 'tool', label: 'execute' },
    { id: 'e-tool-data', from: 'tool', to: 'data', label: 'read' },
    { id: 'e-data-tool', from: 'data', to: 'tool', label: 'payload', cx: 820, cy: 260 },
    { id: 'e-tool-server', from: 'tool', to: 'server', label: 'result', cx: 600, cy: 120 },
    { id: 'e-server-client', from: 'server', to: 'client', label: 'response' },
    { id: 'e-client-ctx', from: 'client', to: 'ctx', label: 'merge' },
    { id: 'e-ctx-llm', from: 'ctx', to: 'llm', label: 'messages' },
    { id: 'e-llm-app', from: 'llm', to: 'app', label: 'next action' },
  ],
  steps: [
    {
      id: 'm1', title: 'Рішення викликати tool', activeNodes: ['app', 'llm'], activeEdges: ['e-llm-app'], markerEdgeId: 'e-llm-app',
      panel: {
        what: 'LLM пропонує tool call, harness/application вирішує чи дозволити.', who: 'LLM пропонує, app/harness дозволяє.',
        input: 'Tool schema в context', output: 'Tool call request', why: 'MCP не приймає рішення за вас.', risks: 'Auto-approve небезпечних tool.',
        qaAgent: 'Модель просить Jira issue details — app перевіряє policy.',
      },
    },
    {
      id: 'm2', title: 'MCP client → server', activeNodes: ['app', 'client', 'server'], activeEdges: ['e-app-client', 'e-client-server'], markerEdgeId: 'e-client-server',
      panel: {
        what: 'Client відправляє стандартизований MCP запит на server (stdio/HTTP).', who: 'MCP client library (код).',
        input: 'Tool name + args', output: 'MCP message', why: 'Єдиний спосіб підключення різних інтеграцій.', risks: 'Невірна версія protocol.',
        qaAgent: 'Regression agent використовує MCP server для Jira замість ad-hoc REST у кожному tool.',
      },
    },
    {
      id: 'm3', title: 'Server виконує дозволений tool', activeNodes: ['server', 'tool', 'data'], activeEdges: ['e-server-tool', 'e-tool-data', 'e-data-tool', 'e-tool-server'], markerEdgeId: 'e-server-tool',
      panel: {
        what: 'Server мапить MCP tool на реальний API (Jira REST), з credentials server-side.', who: 'MCP server + зовнішній API.',
        input: 'issue key', output: 'JSON issue fields', why: 'Ізоляція секретів від prompt.', risks: 'Over-privileged Jira token на server.',
        qaAgent: 'Читання коментарів і linked bugs для failed test.',
      },
    },
    {
      id: 'm4', title: 'Результат у context', activeNodes: ['server', 'client', 'ctx', 'llm'], activeEdges: ['e-server-client', 'e-client-ctx', 'e-ctx-llm'], markerEdgeId: 'e-client-ctx',
      panel: {
        what: 'Відповідь MCP повертається в agent context як tool result message.', who: 'Harness merge (код).',
        input: 'MCP response', output: 'messages[] оновлено', why: 'LLM бачить свіжі дані для наступного кроку.', risks: 'Великий payload — truncate policy.',
        qaAgent: 'Issue status + assignee в context перед висновком.',
      },
    },
  ],
};
