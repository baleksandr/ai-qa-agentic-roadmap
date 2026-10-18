import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const explainerPath = path.join(
  root,
  'src/components/agent-arch/AgentOptionalRagMcpExplainer.tsx',
);
const panelPath = path.join(root, 'src/components/agent-arch/ArchitectureSimStepPanel.tsx');
const diagramPath = path.join(
  root,
  'src/components/agent-arch/ArchitectureVerticalSimDiagram.tsx',
);

const explainerSrc = readFileSync(explainerPath, 'utf8');
const panelSrc = readFileSync(panelPath, 'utf8');
const diagramSrc = readFileSync(diagramPath, 'utf8');

const errors = [];

if ((explainerSrc.match(/Поточний стан схеми/g) ?? []).length !== 1) {
  errors.push('AgentOptionalRagMcpExplainer must render «Поточний стан схеми» exactly once.');
}

if (/AGENT_EXPLAINER_DETAILS|Object\.values\(AGENT_EXPLAINER/.test(explainerSrc)) {
  errors.push('Do not iterate or map over all explainer records in the UI component.');
}

if (!/selectedExplanationId/.test(explainerSrc)) {
  errors.push('Explainer must use selectedExplanationId for the active body.');
}

if (!/SelectedExplanation/.test(explainerSrc)) {
  errors.push('Explainer must render a single SelectedExplanation branch.');
}

if (/AgentOptionalRagMcpExplainer/.test(panelSrc)) {
  errors.push('ArchitectureSimStepPanel must not embed AgentOptionalRagMcpExplainer.');
}

const explainerMounts = (diagramSrc.match(/<AgentOptionalRagMcpExplainer/g) ?? []).length;
if (explainerMounts !== 1) {
  errors.push(`Expected exactly one AgentOptionalRagMcpExplainer mount, found ${explainerMounts}.`);
}

if (!/ragMcpIntroOpen\s*\?/.test(diagramSrc)) {
  errors.push('AgentOptionalRagMcpExplainer must render only when ragMcpIntroOpen is true.');
}

if (!/ragMcpIntroOpen\s*\?[\s\S]*AgentOptionalRagMcpExplainer[\s\S]*:\s*\([\s\S]*ArchitectureSimStepPanel/.test(diagramSrc)) {
  errors.push('ArchitectureSimStepPanel must be hidden while ragMcpIntroOpen is true (ternary layout).');
}

if (errors.length) {
  console.error('verify-agent-rag-mcp-explainer failed:\n');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log('verify-agent-rag-mcp-explainer: ok');
