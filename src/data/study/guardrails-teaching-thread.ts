/** Навчальний приклад курсу (синтетичний) — policy flow навколо Jira write. */
export const GR_LOGIN_CONTEXT =
  'Regression run: login_spec падає після deploy; агент має лише read logs/report і обмежений write у Jira.';

export const GR_CREATE_JIRA = {
  toolName: 'createJiraIssue',
  argsExample: '{ project: "QA", summary: "Login flaky after deploy" }',
  policyNote:
    'Політика: createJiraIssue → needs_approval до human OK; deleteIssue відсутній у tool registry.',
};

export const GR_READ_REPORT = {
  toolName: 'readPlaywrightReport',
  verdict: 'allow',
  sandboxNote: 'Лише file:/work/reports/… у sandbox harness.',
};
