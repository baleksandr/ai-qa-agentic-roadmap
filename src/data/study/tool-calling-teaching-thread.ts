/** Навчальний наскрізний приклад Tool Calling (умовно, курс). */
export const TC_LOGIN_FAILURE =
  'Після падіння login_spec harness передає в LLM tool schemas і короткий опис збою з CI.';

export const TC_READ_REPORT = {
  toolName: 'readPlaywrightReport',
  argsExample: '{ "path": "./playwright-report/index.html" }',
  sandboxNote: 'Лише шлях у sandbox playwright-report/ — не довільний диск.',
} as const;
