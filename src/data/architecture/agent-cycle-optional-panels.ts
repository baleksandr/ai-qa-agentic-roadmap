import type { SimStepPanel } from '../../types/architecture-simulation';
import type { AgentOptionalFlags } from '../../lib/agentCycleOptionalNodes';

export type { AgentOptionalFlags };

export function getAgentOptionalSchemaStateUk(flags: AgentOptionalFlags): {
  ragUk: string;
  mcpUk: string;
} {
  return {
    ragUk: flags.showRag
      ? 'RAG увімкнено — код шукає документи перед першим запитом до моделі.'
      : 'RAG вимкнено — цей маршрут не виконує пошук документів.',
    mcpUk: flags.showMcp
      ? 'MCP увімкнено — після дозволу застосунок звертається до інструмента через MCP.'
      : 'MCP вимкнено — після дозволу застосунок викликає інструмент без MCP.',
  };
}

/** @deprecated Використовуйте AgentOptionalRagMcpExplainer у панелі. */
export function getAgentOptionalComparisonUk(flags: AgentOptionalFlags): string {
  const state = getAgentOptionalSchemaStateUk(flags);
  return `${state.ragUk} ${state.mcpUk}`;
}

export function getAgentOptionalModePanel(flags: AgentOptionalFlags): SimStepPanel | null {
  if (!flags.showRag && !flags.showMcp) {
    return {
      what:
        'Базовий навчальний run login_spec без опційних шарів: harness формує запит до моделі з даних CI, після дозволу інструмент читає звіт локально.',
      who: 'Harness і локальний handler інструмента; модель лише пропонує дії.',
      input: 'Подія падіння тесту та шляхи до артефактів.',
      output: 'Запит до моделі → перевірка → читання звіту → відповідь моделі з доказами.',
      why: 'Показати мінімальний цикл без retrieval і без MCP.',
      unknown: 'Чи потрібні postmortem з бази — не перевіряється, поки RAG вимкнений.',
      risks: 'Очікувати retrieval без увімкненого RAG на схемі.',
    };
  }
  const state = getAgentOptionalSchemaStateUk(flags);
  return {
    what: `${state.ragUk} ${state.mcpUk}`,
    who: 'Harness керує тим, які опційні блоки беруть участь у run.',
    input: 'Поточні перемикачі RAG і MCP на схемі.',
    output: 'Додаткові вузли й стрілки на полотні (підсвічені) і пояснення при виборі переходу.',
    why: 'Порівняти, коли який шар доречний, без плутанини «мозок» vs «протокол».',
    unknown: 'Конкретний вміст знайдених документів або відповідь MCP — лише після кроку симуляції.',
    risks: 'Вважати RAG або MCP обов’язковими для будь-якого агента.',
  };
}
