import type { ArchitectureSchema, SimAux, SimEdge, SimNode, SimStep } from '../../types/architecture-simulation';

const nodes: SimNode[] = [
  { id: 'human', label: 'Human / CI', shortLabel: 'Human / CI', role: 'human', topicId: 'lab-7', x: 40, y: 220, w: 150, h: 72, mobileOrder: 1 },
  { id: 'harness', label: 'Agent Harness', shortLabel: 'Harness', role: 'code', topicId: 'concept-04', x: 280, y: 200, w: 168, h: 80, mobileOrder: 3 },
  { id: 'llm', label: 'LLM', shortLabel: 'LLM', role: 'llm', topicId: 'concept-14', x: 560, y: 200, w: 140, h: 80, mobileOrder: 4 },
  { id: 'validation', label: 'Validation', shortLabel: 'Validation', role: 'code', topicId: 'concept-17', x: 430, y: 360, w: 160, h: 68, mobileOrder: 6 },
  { id: 'tools', label: 'TypeScript Tools', shortLabel: 'TS Tools', role: 'code', topicId: 'concept-10', x: 280, y: 480, w: 168, h: 72, mobileOrder: 7 },
  { id: 'artifacts', label: 'Playwright Failed', shortLabel: 'PW Failed', role: 'data', topicId: 'lab-0', x: 40, y: 460, w: 170, h: 72, mobileOrder: 8 },
  { id: 'state', label: 'State', shortLabel: 'State', role: 'code', topicId: 'concept-01', x: 300, y: 60, w: 128, h: 56, mobileOrder: 2 },
  { id: 'result', label: 'Result', shortLabel: 'Result', role: 'outcome', topicId: 'lab-8', x: 760, y: 420, w: 180, h: 80, mobileOrder: 9 },
];

const edges: SimEdge[] = [
  { id: 'e-human-harness', from: 'human', to: 'harness', label: 'start run' },
  { id: 'e-harness-llm', from: 'harness', to: 'llm', label: 'prompt' },
  { id: 'e-llm-harness-call', from: 'llm', to: 'validation', label: 'tool call', cx: 520, cy: 300 },
  { id: 'e-validation-tools', from: 'validation', to: 'tools', label: 'allow' },
  { id: 'e-tools-artifacts', from: 'tools', to: 'artifacts', label: 'read' },
  { id: 'e-artifacts-tools', from: 'artifacts', to: 'tools', label: 'files', cx: 120, cy: 520 },
  { id: 'e-tools-harness', from: 'tools', to: 'harness', label: 'result', cx: 280, cy: 400 },
  { id: 'e-harness-llm-loop', from: 'harness', to: 'llm', label: 'context', loop: true, cx: 420, cy: 120 },
  { id: 'e-harness-state', from: 'harness', to: 'state', label: 'state' },
  { id: 'e-harness-result', from: 'harness', to: 'result', label: 'final' },
  { id: 'e-llm-done', from: 'llm', to: 'harness', label: 'answer', cx: 480, cy: 140 },
];

const aux: SimAux[] = [
  { id: 'guardrails', label: 'Guardrails', summary: '╨ƒ╨╡╤Ç╨╡╨▓╤û╤Ç╨║╨░ tools, ╤ê╨╗╤Å╤à╤û╨▓ ╤û ╨░╤Ç╨│╤â╨╝╨╡╨╜╤é╤û╨▓ ╨╜╨░╨▓╨║╨╛╨╗╨╛ ╨▓╨╕╨║╨╗╨╕╨║╤â.', topicId: 'concept-17' },
  { id: 'observability', label: 'Observability', summary: 'Traces ╤û ╨╗╨╛╨│╨╕ ╨▓╤ü╤î╨╛╨│╨╛ run ╨┐╨░╤Ç╨░╨╗╨╡╨╗╤î╨╜╨╛ ╤å╨╕╨║╨╗╤â.', topicId: 'concept-18' },
  { id: 'evals', label: 'Evals', summary: '╨₧╤å╤û╨╜╨║╨░ ╤é╤Ç╨░╤ö╨║╤é╨╛╤Ç╤û╤ù ╨┐╤û╤ü╨╗╤Å run, ╨╜╨╡ ╨▓╤ü╨╡╤Ç╨╡╨┤╨╕╨╜╤û live-╤å╨╕╨║╨╗╤â.', topicId: 'concept-05' },
  { id: 'mcp', label: 'MCP (╨╛╨┐╤å╤û╨╣╨╜╨╛)', summary: '╨É╨╗╤î╤é╨╡╤Ç╨╜╨░╤é╨╕╨▓╨╜╨╕╨╣ ╤ü╨┐╨╛╤ü╤û╨▒ ╨┐╤û╨┤╨║╨╗╤Ä╤ç╨╕╤é╨╕ tools.', topicId: 'concept-06', optional: true },
  { id: 'rag', label: 'RAG (╨╛╨┐╤å╤û╨╣╨╜╨╛)', summary: '╨ƒ╨╛╤ê╤â╨║ ╨╖╨╜╨░╨╜╤î, ╨║╨╛╨╗╨╕ ╤ù╤à ╨╜╨╡╨╝╨░╤ö ╨▓ report.', topicId: 'concept-03', optional: true },
];

const steps: SimStep[] = [
  {
    id: 's1', title: 'Playwright test failed', activeNodes: ['human', 'artifacts'], activeEdges: ['e-human-harness'], markerEdgeId: 'e-human-harness',
    panel: {
      what: '╨ó╨╡╤ü╤é login.spec.ts ╨╖╨░╨▓╨╡╤Ç╤ê╨╕╨▓╤ü╤Å ╨┐╨╛╨╝╨╕╨╗╨║╨╛╤Ä. ╨ª╨╡ ╤ü╨╕╨│╨╜╨░╨╗ ╨┐╨╛╤ç╨░╤é╨╕ ╤Ç╨╛╨╖╤ü╨╗╤û╨┤╤â╨▓╨░╨╜╨╜╤Å, ╨░ ╨╜╨╡ ╨┤╨╛╨║╨░╨╖ ╨┐╤Ç╨╕╤ç╨╕╨╜╨╕ ╨╖╨▒╨╛╤Ä.',
      who: 'Playwright ╤â CI ╨░╨▒╨╛ ╨╗╨╛╨║╨░╨╗╤î╨╜╨╛ ╨▓╨╕╨║╨╛╨╜╨░╨▓ ╤é╨╡╤ü╤é. ╨¢╤Ä╨┤╨╕╨╜╨░ ╨░╨▒╨╛ CI ╨╛╨║╤Ç╨╡╨╝╨╛ ╨╖╨░╨┐╤â╤ü╨║╨░╤ö ╨░╨│╨╡╨╜╤é╨░.',
      input: 'test name, error text, paths to report / trace / logs (╨▓╨╝╤û╤ü╤é ╤ä╨░╨╣╨╗╤û╨▓ ╤ë╨╡ ╨╜╨╡ ╤ç╨╕╤é╨░╨╗╨╕).',
      output: '╨ƒ╨╛╨┤╤û╤Å ╨┐╨░╨┤╤û╨╜╨╜╤Å ╤é╨░ ╤ê╨╗╤Å╤à╨╕ ╨┤╨╛ ╨░╤Ç╤é╨╡╤ä╨░╨║╤é╤û╨▓.',
      recipient: 'Agent Harness.',
      why: '╨É╨│╨╡╨╜╤é ╨╝╨░╤ö ╨╖╨╜╨░╤é╨╕, ╤Å╨║╨╡ ╨┐╨░╨┤╤û╨╜╨╜╤Å ╤Ç╨╛╨╖╨▒╨╕╤Ç╨░╤é╨╕ ╤û ╨┤╨╡ ╤ê╤â╨║╨░╤é╨╕ ╨┤╨╛╨║╨░╨╖╨╕.',
      unknown: '╨º╨╕ ╨▒╨░╨│ ╤â ╨╖╨░╤ü╤é╨╛╤ü╤â╨╜╨║╤â, ╤é╨╡╤ü╤é╤û, ╨┤╨░╨╜╨╕╤à ╤ç╨╕ ╤ü╨╡╤Ç╨╡╨┤╨╛╨▓╨╕╤ë╤û.',
      risks: '╨Æ╤û╨┤╤ü╤â╤é╨╜╤û╨╣ ╨░╤Ç╤é╨╡╤ä╨░╨║╤é, ╨╜╨╡╨┐╤Ç╨░╨▓╨╕╨╗╤î╨╜╨╕╨╣ ╤ê╨╗╤Å╤à, ╤ü╨╡╨║╤Ç╨╡╤é╨╕ ╨▓ ╨╗╨╛╨│╨░╤à.',
      qaAgent: '╨ƒ╤û╤ü╨╗╤Å ╤ç╨╡╤Ç╨▓╨╛╨╜╨╛╨│╨╛ regression ╤â CI ΓÇö ╤ü╤é╨░╤Ç╤é run ╨╖ ./playwright-report/.',
    },
  },
  {
    id: 's2', title: 'Harness prepares context', activeNodes: ['human', 'harness', 'state'], activeEdges: ['e-human-harness', 'e-harness-llm', 'e-harness-state'], markerEdgeId: 'e-harness-llm',
    panel: {
      what: 'Harness ╨╖╨▒╨╕╤Ç╨░╤ö runId, system prompt, ╨╛╨┐╨╕╤ü ╨┐╨╛╨╝╨╕╨╗╨║╨╕, tool schemas ╤û ╨╖╨░╨┐╨╕╤ü╤â╤ö state.',
      who: 'Agent Harness (TypeScript), ╨╜╨╡ LLM.',
      input: 'messages[], tools[], metadata ╨┐╨░╨┤╤û╨╜╨╜╤Å, ╨┐╨╛╨┐╨╡╤Ç╨╡╨┤╨╜╤û╨╣ state.',
      output: 'HTTP-╨╖╨░╨┐╨╕╤é ╨┤╨╛ LLM API ╨╖ ╨┐╨╛╨▓╨╜╨╕╨╝ context.',
      recipient: 'LLM provider.',
      why: '╨£╨╛╨┤╨╡╨╗╤î ╨▒╨░╤ç╨╕╤é╤î ╨╗╨╕╤ê╨╡ ╤é╨╡, ╤ë╨╛ ╨┐╨╡╤Ç╨╡╨┤╨░╨╗╨╕ ╨▓ prompt ΓÇö ╨╜╨╡ ┬½╨╝╨░╨│╤û╤ç╨╜╨╛┬╗ ╨╖╨╜╨░╤ö ╨┐╤Ç╨╛ CI.',
      unknown: '╨»╨║╨╕╨╣ tool call ╨╖╨░╨┐╤Ç╨╛╨┐╨╛╨╜╤â╤ö ╨╝╨╛╨┤╨╡╨╗╤î.',
      risks: '╨ù╨░╨╜╨░╨┤╤é╨╛ ╨▓╨╡╨╗╨╕╨║╨╕╨╣ context, ╨▓╨╕╤é╤û╨║ ╤ü╨╡╨║╤Ç╨╡╤é╤û╨▓ ╤â messages.',
      qaAgent: '╨ö╨╛╨╖╨▓╨╛╨╗╨╡╨╜╤û tools: readReport, readLogs, readTrace ╤â sandbox.',
    },
  },
  {
    id: 's3', title: 'LLM requests a tool', activeNodes: ['harness', 'llm', 'validation'], activeEdges: ['e-harness-llm', 'e-llm-harness-call'], markerEdgeId: 'e-llm-harness-call',
    panel: {
      what: 'LLM ╨┐╨╛╨▓╨╡╤Ç╤é╨░╤ö structured tool call (╤û╨╝ΓÇÖ╤Å + JSON args), ╨╜╨░╨┐╤Ç╨╕╨║╨╗╨░╨┤ readPlaywrightReport.',
      who: 'LLM ╨┐╤Ç╨╛╨┐╨╛╨╜╤â╤ö. ╨ö╨╕╤ü╨║ ╤û API ╤ë╨╡ ╨╜╨╡ ╤ç╤û╨┐╨░╨╗╨╕.',
      input: 'Context + tool definitions ╨╖ harness.',
      output: 'Proposed tool call (╤ë╨╡ ╨▒╨╡╨╖ allow/deny).',
      recipient: 'Validation / policy ╤â harness.',
      why: '╨í╨┐╨╛╤ç╨░╤é╨║╤â ╨╖╤û╨▒╤Ç╨░╤é╨╕ ╤ä╨░╨║╤é╨╕ ╨╖ report, ╨┐╨╛╤é╤û╨╝ ╨▓╨╕╤ü╨╜╨╛╨▓╨╛╨║.',
      unknown: '╨º╨╕ ╨┐╤Ç╨╛╨╣╨┤╨╡ path validation ╤û policy.',
      risks: '╨Æ╨╕╨│╨░╨┤╨░╨╜╨╕╨╣ path, ╨╜╨╡╤û╤ü╨╜╤â╤Ä╤ç╨╕╨╣ tool name.',
      qaAgent: '╨₧╤ç╤û╨║╤â╨▓╨░╨╜╨╕╨╣ ╨┐╨╡╤Ç╤ê╨╕╨╣ ╨║╤Ç╨╛╨║ ΓÇö read report, ╨╜╨╡ draft bug ╤â Jira.',
    },
  },
  {
    id: 's4', title: '╨ƒ╨╡╤Ç╨╡╨▓╤û╤Ç╨║╨░ ╨▓╨╕╨║╨╗╨╕╨║╤â', activeNodes: ['validation', 'llm', 'harness'], activeEdges: ['e-llm-harness-call', 'e-validation-tools'], markerEdgeId: 'e-validation-tools',
    panel: {
      what: 'Whitelist tool, sandbox path, schema args.', who: 'TypeScript harness + guardrails.',
      input: 'Tool call ╨▓╤û╨┤ LLM', output: 'allow | deny', why: '╨æ╨╡╨╖╨┐╨╡╨║╨░ ╨┐╨╡╤Ç╨╡╨┤ ╨▓╨╕╨║╨╛╨╜╨░╨╜╨╜╤Å╨╝.', risks: 'Path traversal.',
      qaAgent: '╨ƒ╨╡╤Ç╨╡╨▓╤û╤Ç╨║╨░, ╤ë╨╛ ╤ç╨╕╤é╨░╤ö╨╝╨╛ ╨╗╨╕╤ê╨╡ ╨┤╨╛╨╖╨▓╨╛╨╗╨╡╨╜╤â ╨┤╨╕╤Ç╨╡╨║╤é╨╛╤Ç╤û╤Ä ╨╖╨▓╤û╤é╤â.',
    },
  },
  {
    id: 's5', title: 'TS ╤ç╨╕╤é╨░╤ö report', activeNodes: ['tools', 'artifacts', 'harness'], activeEdges: ['e-validation-tools', 'e-tools-artifacts', 'e-artifacts-tools', 'e-tools-harness'], markerEdgeId: 'e-tools-harness',
    panel: {
      what: 'Handler readReport ╨┐╨╛╨▓╨╡╤Ç╤é╨░╤ö snippet ╤â harness.', who: 'TypeScript tool.',
      input: 'path ╨┤╨╛ report', output: 'tool result message', why: '╨ö╨╛╨║╨░╨╖ ╤â context ╨┤╨╗╤Å LLM.', risks: '╨Æ╨╡╨╗╨╕╨║╨╕╨╣ HTML ╤â context.',
      qaAgent: '╨ñ╨░╨║╤é╨╕╤ç╨╜╨╡ ╤ç╨╕╤é╨░╨╜╨╜╤Å playwright-report ╤Ç╨╛╨▒╨╕╤é╤î ╨║╨╛╨┤, ╨╜╨╡ ╨╝╨╛╨┤╨╡╨╗╤î.',
    },
  },
  {
    id: 's6', title: 'LLM: ╨┐╨╛╤é╤Ç╤û╨▒╨╜╤û logs/trace', activeNodes: ['harness', 'llm', 'state'], activeEdges: ['e-harness-llm-loop', 'e-llm-harness-call'], markerEdgeId: 'e-harness-llm-loop',
    panel: {
      what: '╨£╨╛╨┤╨╡╨╗╤î ╨╖╨░╨┐╨╕╤é╤â╤ö ╤ë╨╡ tool ╨┐╤û╤ü╨╗╤Å report.', who: 'LLM + harness ╤å╨╕╨║╨╗.',
      input: 'Context + ╨┐╨╛╨┐╨╡╤Ç╨╡╨┤╨╜╤û╨╣ result', output: '╨¥╨╛╨▓╨╕╨╣ tool call', why: '╨ƒ╨╡╤é╨╗╤Å agentic run.', risks: '╨æ╨╡╨╖ max steps ΓÇö ╨╜╨╡╤ü╨║╤û╨╜╤ç╨╡╨╜╨╜╨╕╨╣ ╤å╨╕╨║╨╗.',
      qaAgent: '╨ó╨╕╨┐╨╛╨▓╨╕╨╣ ╨┤╤Ç╤â╨│╨╕╨╣ ╨║╤Ç╨╛╨║ ΓÇö trace ╨░╨▒╨╛ CI logs ╨┤╨╗╤Å login failure.',
    },
  },
  {
    id: 's7', title: '╨º╨╕╤é╨░╨╜╨╜╤Å logs/trace', activeNodes: ['tools', 'artifacts', 'harness', 'llm'], activeEdges: ['e-validation-tools', 'e-tools-artifacts', 'e-tools-harness', 'e-harness-llm-loop'], markerEdgeId: 'e-tools-harness',
    panel: {
      what: '╨ƒ╨╛╨▓╤é╨╛╤Ç tool chain ΓåÆ ╤Ç╨╡╨╖╤â╨╗╤î╤é╨░╤é ╤â harness ΓåÆ ╨╖╨╜╨╛╨▓╤â LLM.', who: 'TS tools + harness.',
      input: 'readTrace / readLogs', output: '╨ñ╤Ç╨░╨│╨╝╨╡╨╜╤é╨╕ ╨▓ context', why: '╨ù╨▓ΓÇÖ╤Å╨╖╨░╤é╨╕ symptom ╨╖ ╨║╤Ç╨╛╨║╨╛╨╝ ╤é╨╡╤ü╤é╤â.', risks: 'Trace ╨╖╨░╨╜╨░╨┤╤é╨╛ ╨▓╨╡╨╗╨╕╨║╨╕╨╣.',
      qaAgent: '╨É╨│╨╡╨╜╤é ╨╖╨▒╨╕╤Ç╨░╤ö ╨┤╨╛╨║╨░╨╖╨╕ ╨┐╨╡╤Ç╨╡╨┤ draft bug report.',
    },
  },
  {
    id: 's8', title: '╨Æ╨╕╤ü╨╜╨╛╨▓╨╛╨║ ╤û stop', activeNodes: ['llm', 'harness', 'result', 'state'], activeEdges: ['e-llm-done', 'e-harness-result', 'e-harness-state'], markerEdgeId: 'e-harness-result',
    panel: {
      what: 'Structured ╨▓╨╕╤ü╨╜╨╛╨▓╨╛╨║, ╨▓╨░╨╗╤û╨┤╨░╤å╤û╤Å schema, ╨║╤û╨╜╨╡╤å╤î run.', who: 'LLM ╤é╨╡╨║╤ü╤é, harness stop rules.',
      input: '╨ƒ╨╛╨▓╨╜╨╕╨╣ context', output: 'summary + evidence + draftBug', why: '╨É╤Ç╤é╨╡╤ä╨░╨║╤é ╨┤╨╗╤Å ╨╗╤Ä╨┤╨╕╨╜╨╕.', risks: '╨Æ╨╕╤ü╨╜╨╛╨▓╨╛╨║ ╨▒╨╡╨╖ evidence.',
      qaAgent: '╨á╨╡╨╖╤â╨╗╤î╤é╨░╤é ΓÇö ╨▓╨╕╤ü╨╜╨╛╨▓╨╛╨║ ╨╖ ╨┐╨╛╤ü╨╕╨╗╨░╨╜╨╜╤Å╨╝╨╕ ╨╜╨░ report/trace ╨░╨▒╨╛ ┬½╨┤╨░╨╜╨╕╤à ╨╜╨╡╨┤╨╛╤ü╤é╨░╤é╨╜╤î╨╛┬╗.',
    },
  },
];

export const AGENT_SCHEMA: ArchitectureSchema = {
  id: 'agent',
  tabLabel: '╨É╨│╨╡╨╜╤é: ╨╖╨░╨│╨░╨╗╤î╨╜╨╕╨╣ ╤å╨╕╨║╨╗',
  title: '╨ù╨░╨│╨░╨╗╤î╨╜╨░ ╤ü╤à╨╡╨╝╨░ ╨░╨│╨╡╨╜╤é╨░',
  subtitle: '╨₧╨┤╨╕╨╜ ╨╜╨░╨▓╤ç╨░╨╗╤î╨╜╨╕╨╣ run QA Regression Investigation Agent',
  disclaimer: '╨¥╨░╨▓╤ç╨░╨╗╤î╨╜╨░ ╤ü╨╕╨╝╤â╨╗╤Å╤å╤û╤Å. ╨¥╨╡ ╤Ç╨╡╨░╨╗╤î╨╜╨╕╨╣ agent run ╤û ╨╜╨╡ ╨▓╨╕╨║╨╛╨╜╤â╤ö ╨║╨╛╨┤ ╨╜╨░ ╨▓╨░╤ê╤û╨╣ ╨╝╨░╤ê╨╕╨╜╤û.',
  svgLabel: '╨ù╨░╨│╨░╨╗╤î╨╜╨╕╨╣ ╤å╨╕╨║╨╗ QA Regression Investigation Agent',
  viewW: 1000,
  viewH: 520,
  nodes,
  edges,
  steps,
  exitConditions: [
    '╨ö╨╛╤ü╤é╨░╤é╨╜╤î╨╛ ╨┤╨╛╨║╨░╨╖╤û╨▓ ΓÇö ╤ä╤û╨╜╨░╨╗╤î╨╜╨░ ╨▓╤û╨┤╨┐╨╛╨▓╤û╨┤╤î ╨┐╤û╤ü╨╗╤Å ╨▓╨░╨╗╤û╨┤╨░╤å╤û╤ù.',
    '╨¢╤û╨╝╤û╤é ╨║╤Ç╨╛╨║╤û╨▓ ΓÇö harness ╨╖╤â╨┐╨╕╨╜╤Å╤ö ╤å╨╕╨║╨╗.',
    '╨ƒ╨╛╨╝╨╕╨╗╨║╨░ tool/API ΓÇö run ╨╖╨░╨▓╨╡╤Ç╤ê╤â╤ö╤é╤î╤ü╤Å ╨╖ ╨┐╨╛╨╝╨╕╨╗╨║╨╛╤Ä.',
  ],
  aux,
  optionalToggleLabel: '╨ƒ╨╛╨║╨░╨╖╨░╤é╨╕ MCP / RAG (╨╛╨┐╤å╤û╨╣╨╜╨╛)',
};
