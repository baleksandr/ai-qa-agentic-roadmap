import type { ChainStageDetail } from './rag-chain-stage-details';
import {
  TC_EXECUTOR_PANEL,
  TC_HARNESS_SCHEMAS_PANEL,
  TC_LLM_TOOL_CALL_PANEL,
  TC_RESULT_CONTEXT_PANEL,
  TC_VALIDATION_PANEL,
} from './tool-calling-panel-content';

const DETAILS: Record<number, ChainStageDetail> = {
  1: {
    titleUk: 'Harness і tool schemas',
    visualKey: 'harness',
    cardBadgeUk: 'Harness',
    cardActorUk: 'Код',
    cardTeaserUk: 'Allow-list tools у запиті разом із історією messages.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: TC_HARNESS_SCHEMAS_PANEL,
    terms: [
      { label: 'tool schema', text: 'name, description, parameters (JSON Schema).' },
      { label: 'tools', text: 'Поле API: allow-list операцій для цього run (масив tool schemas).' },
      { label: 'messages', text: 'Поле API: історія діалогу run, включно з tool results.' },
    ],
  },
  2: {
    titleUk: 'LLM: tool_call',
    visualKey: 'llm',
    cardBadgeUk: 'Generation',
    cardActorUk: 'LLM',
    cardTeaserUk: 'Structured tool_call: ім’я tool і JSON args — пропозиція, не I/O.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: TC_LLM_TOOL_CALL_PANEL,
    terms: [
      { label: 'tool_call', text: 'Пропозиція виклику — не виконання.' },
      { label: 'arguments', text: 'JSON params; перевіряє harness.' },
    ],
  },
  3: {
    titleUk: 'Validation і policy',
    visualKey: 'filter',
    cardBadgeUk: 'Policy',
    cardActorUk: 'Код',
    cardTeaserUk: 'Schema, sandbox і policy allow / deny / needs_approval до executor.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: TC_VALIDATION_PANEL,
    terms: [
      { label: 'sandbox', text: 'Обмеження path для read tools.' },
      { label: 'allow-list', text: 'Лише оголошені tool names.' },
    ],
  },
  4: {
    titleUk: 'Tool handler і I/O',
    visualKey: 'executor',
    cardBadgeUk: 'Executor',
    cardActorUk: 'Код',
    cardTeaserUk: 'Deterministic handler після allow — readPlaywrightReport, API тощо.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: TC_EXECUTOR_PANEL,
    terms: [
      { label: 'tool handler', text: 'Deterministic I/O після allow.' },
      { label: 'MCP', text: 'Адаптер може бути зовнішнім протоколом — принцип той самий.' },
    ],
  },
  5: {
    titleUk: 'Tool result у context',
    visualKey: 'context',
    cardBadgeUk: 'Контекст run',
    cardActorUk: 'Код',
    cardTeaserUk: 'Tool result у messages; великі звіти обрізають перед наступним turn.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: TC_RESULT_CONTEXT_PANEL,
    terms: [
      { label: 'tool result', text: 'Observation для моделі; часто truncated.' },
      { label: 'max_steps', text: 'Ліміт циклів harness ↔ LLM.' },
    ],
  },
};

export function lookupToolCallingComponentDetail(index: number): ChainStageDetail | null {
  return DETAILS[index] ?? null;
}
