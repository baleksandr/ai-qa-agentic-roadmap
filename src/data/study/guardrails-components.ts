export type ComponentHelp = {
  id: string;
  title: string;
  summaryUk: string;
  qaUk: string;
};

/** Пояснення компонентів Guardrails (читачкий шар; оригінальні назви з уроку збережені) */
export const GUARDRAILS_COMPONENT_HELP: Record<string, ComponentHelp> = {
  'input validator': {
    id: 'input-validator',
    title: 'Input validator',
    summaryUk: 'Перевіряє все, що потрапляє в run до LLM: prompt користувача, RAG-фрагменти, вкладення.',
    qaUk: 'Наприклад: відсікає prompt injection або PII з логів перед аналізом regression failure.',
  },
  'output/schema validator': {
    id: 'output-validator',
    title: 'Output / schema validator',
    summaryUk: 'Перевіряє відповідь моделі й tool call на очікуваний JSON/schema і обов’язкові поля.',
    qaUk: 'Агент не приймає «вигаданий» bug report без полів severity або evidence links.',
  },
  'tool permission matrix': {
    id: 'tool-matrix',
    title: 'Tool permission matrix',
    summaryUk: 'Таблиця правил: який актор (run/роль) яку дію на який ресурс може виконати.',
    qaUk: 'readPlaywrightReport — allow; deleteProductionDb — deny; createJira — лише після human approval.',
  },
  sandbox: {
    id: 'sandbox',
    title: 'Sandbox',
    summaryUk: 'Ізольоване середовище: tool бачить лише дозволені шляхи, мережу або API.',
    qaUk: 'Читання лише ./playwright-report/, без виходу в /etc або prod API.',
  },
  'allowlists/denylists': {
    id: 'allow-deny-lists',
    title: 'Allowlists / denylists',
    summaryUk: 'Явні списки дозволених і заборонених tools, URL, шляхів, команд.',
    qaUk: 'Whitelist tool names у harness; deny glob **/*.env на диску.',
  },
  'rate/cost limits': {
    id: 'rate-cost',
    title: 'Rate / cost limits',
    summaryUk: 'Ліміти на кількість LLM/tool викликів, токени й бюджет на run або користувача.',
    qaUk: 'max_steps=10 і daily token cap, щоб run не «з’їв» бюджет на нескінченних retry.',
  },
  'human approval': {
    id: 'human-approval',
    title: 'Human approval',
    summaryUk: 'Ризикова дія зупиняється до явного OK людини (UI, ticket, chat).',
    qaUk: 'Створення Jira bug або rerun prod test — лише після approve QA lead.',
  },
  'safety filters': {
    id: 'safety-filters',
    title: 'Safety filters',
    summaryUk: 'Фільтри контенту: токсичність, витік секретів, заборонені теми в in/out.',
    qaUk: 'Маскування API keys у trace перед показом моделі або в UI.',
  },
};

export function lookupGuardrailsComponent(label: string): ComponentHelp | null {
  const key = label.trim().toLowerCase();
  return GUARDRAILS_COMPONENT_HELP[key] ?? null;
}

export const GUARDRAILS_KEY_IDEA_UK =
  'Guardrails — це **детермінований код і політики** навколо LLM, а не поради в промпті. Система перевіряє дозволи, формат відповіді, sandbox, контент, бюджет і за потреби **зупиняє run** або відправляє дію на **підтвердження людині**.';
