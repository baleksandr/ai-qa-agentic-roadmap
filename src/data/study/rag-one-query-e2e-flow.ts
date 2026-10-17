/** Навчальний прохід §2 — умовні дані, узгоджено з 03-rag.md */
export type RagE2eHop = {
  label: string;
  whoUk: string;
  dataUk: string;
};

export const RAG_ONE_QUERY_E2E_FLOW: RagE2eHop[] = [
  {
    label: 'CI failure',
    whoUk: 'CI → harness (код)',
    dataUk: 'login_spec failed, timeout #login-btn, trace ci-8842',
  },
  {
    label: 'query + перевірена ідентичність',
    whoUk: 'Harness (код)',
    dataUk:
      'query: симптоми; filters: tenant=acme, env=staging, service=auth, incident_date_gte=90d (від часу run)',
  },
  {
    label: 'retrieval з фільтрами',
    whoUk: 'Retriever (код)',
    dataUk: 'candidates → authorized hits (після ACL/metadata); chunk_id, source_id, score',
  },
  {
    label: 'selected evidence',
    whoUk: 'Harness + rerank (код; rerank може бути моделлю)',
    dataUk: 'відібрані chunk_id під token budget',
  },
  {
    label: 'messages → LLM',
    whoUk: 'Context builder → generative LLM',
    dataUk: 'System + Retrieved (INC-442…) + User turn',
  },
  {
    label: 'гіпотеза + citation',
    whoUk: 'LLM',
    dataUk: 'текст з source_id (умовно INC-442) — гіпотеза',
  },
  {
    label: 'перевірка citation / groundedness',
    whoUk: 'Harness (код)',
    dataUk: '(A) source_id ∈ selected evidence; (B) зміст vs chunk',
  },
  {
    label: 'перевірка причини QA',
    whoUk: 'QA (людина)',
    dataUk: '(C) актуальний DOM, Playwright trace, логи CI — не лише старий INC',
  },
];
