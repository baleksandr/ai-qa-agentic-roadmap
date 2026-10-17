/** Підказки для stepper «один запит» (concept-03 RAG) — лише runtime-кроки */
export type RagFlowStepHelp = {
  titleUk: string;
  actor: 'code' | 'llm' | 'human' | 'mixed';
  actorLabel: string;
  inputUk: string;
  outputUk: string;
  explainUk: string;
};

/** Передумова показується окремо, не в цьому масиві */
export const RAG_OFFLINE_DOCS_SECTION_ID = 'як-підготувати-документи-для-пошуку';

export const RAG_ONE_QUERY_PREREQUISITE = {
  titleUk: 'До початку розслідування',
  teaserUk:
    'Incident notes уже оброблено й додано до пошукового індексу index-v12 — не крок поточного run.',
  panelMarkdownUk: `**Що це?** Offline-підготовка: postmortem і incident notes уже в searchable store (\`index-v12\`). Індексація відбулася **до** падіння \`login_spec\`.

**Хто це створює?** Pipeline offline (loader → parse → chunks → embed/index) — див. розділ «Як підготувати документи для пошуку».

**Що далі?** Після signal з CI починається нумерований runtime (кроки 1–6 нижче).

**Що перевірити?** Після зміни wiki — reindex; версія індексу в deploy збігається з очікуваною.`,
  terms: [
    { label: 'index-v12', text: 'Умовна навчальна версія індексу.' },
    { label: 'offline', text: 'Не плутати з кроками run після падіння CI.' },
  ],
};

export const RAG_QUERY_FLOW_STEPS: RagFlowStepHelp[] = [
  {
    titleUk: 'CI, harness і пошуковий запит',
    actor: 'code',
    actorLabel: 'Harness',
    inputUk: 'Signal CI: login_spec failed, лог, trace ci-8842 (умовно)',
    outputUk:
      'Текст retrieval query + metadata-фільтри (tenant, env, service, incident_date_gte) з перевіреної ідентичності CI',
    explainUk:
      'Run починається з CI, не з індексації. Вікно «90 днів» — фільтр incident_date_gte від часу run, не «магія» фрази в query.',
  },
  {
    titleUk: 'Retriever: кандидати з фільтрами та ACL',
    actor: 'code',
    actorLabel: 'Search service',
    inputUk: 'Query + embedding/BM25 + metadata filters + tenant/ACL з harness',
    outputUk: 'authorized hits[] (після фільтрів і ACL на пошуку): chunk_id, text, source_id, retrieval score',
    explainUk:
      'Пошук не довіряє полям від LLM. Якщо backend не застосовує ACL — потрібен окремий кодовий gate до використання тексту.',
  },
  {
    titleUk: 'Відбір дозволені фрагменти й rerank',
    actor: 'code',
    actorLabel: 'Harness',
    inputUk: 'authorized hits[]',
    outputUk: 'selected evidence[] — список chunk_id, що підуть у prompt (після rerank/token budget)',
    explainUk:
      'Код керує кроком; reranker може бути алгоритмом або окремою моделлю. Rerank score ≠ retrieval score ≠ «правда».',
  },
  {
    titleUk: 'Context builder → messages[]',
    actor: 'code',
    actorLabel: 'Context builder',
    inputUk: 'selected evidence[] + system policy + user turn (CI)',
    outputUk: 'messages[] з блоком Retrieved context лише з selected chunk_id',
    explainUk: 'Повторна перевірка: жоден недозволений chunk не потрапив у текст для LLM.',
  },
  {
    titleUk: 'LLM: гіпотеза з citations',
    actor: 'llm',
    actorLabel: 'LLM',
    inputUk: 'messages[]',
    outputUk: 'Текст гіпотези з source_id (умовно INC-442) — не підтверджена root cause',
    explainUk: 'Generative LLM не створює Jira ticket і не встановлює правду падіння тесту.',
  },
  {
    titleUk: 'Перевірки коду та QA',
    actor: 'mixed',
    actorLabel: 'Код + QA',
    inputUk: 'Відповідь LLM, trace (hits → selected → context → відповідь)',
    outputUk:
      '(A) citation ∈ selected evidence; (B) твердження vs текст chunk; (C) QA: DOM/trace/логи CI. Окремо — permissions на tool actions.',
    explainUk:
      'Policy не доводить технічну гіпотезу. QA відхиляє або підтверджує причину поточного падіння.',
  },
];

export function lookupRagFlowStep(stepIndex: number, _fallbackText: string): RagFlowStepHelp | null {
  if (stepIndex >= 1 && stepIndex <= RAG_QUERY_FLOW_STEPS.length) {
    return RAG_QUERY_FLOW_STEPS[stepIndex - 1];
  }
  return null;
}
