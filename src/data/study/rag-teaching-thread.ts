/**
 * Навчальний наскрізний приклад RAG (умовні дані курсу, не прод).
 * Один postmortem INC-442 від offline chunking до runtime prompt.
 */
export const RAG_LOGIN_SPEC_SIGNAL =
  'На staging впав автотест login_spec: таймаут на селекторі #login-btn, trace ci-8842 (умовно).';

export const RAG_INC442 = {
  sourceId: 'INC-442',
  chunkId: 'chk-442-a',
  /** Текст у chunk після Parse + Chunker — той самий уривок, що в Study Mode §2 */
  chunkTextUk:
    'селектор #login-btn змінився на data-test=login-submit; тест чекав старий id …',
  queryUk: 'login timeout staging #login-btn similar incidents',
  filtersUk: 'tenant=acme, env=staging, service=auth',
  indexVersion: 'index-v12',
} as const;

export const RAG_INC318 = {
  sourceId: 'INC-318',
  chunkId: 'chk-318-b',
  chunkTextUk: 'схожий симптом, інший root cause (CDN cache) …',
} as const;
