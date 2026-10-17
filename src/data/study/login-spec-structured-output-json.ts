import type { StudyModelResponseExample } from './study-learner-panel-sections';

/** Спільний умовний JSON плану investigation (§16 structured output). */
export const LOGIN_SPEC_STRUCTURED_OUTPUT_VALUES = {
  steps: [{ action: 'readPlaywrightReport' }],
  priority: 2,
  suggested_tool: 'createJiraIssue',
} as const;

export function loginSpecStructuredOutputJsonPretty(): string {
  return JSON.stringify(LOGIN_SPEC_STRUCTURED_OUTPUT_VALUES, null, 2);
}

export const LOGIN_SPEC_STRUCTURED_OUTPUT_INTRO_EXAMPLE: StudyModelResponseExample = {
  blockLabelUk: 'Умовний приклад плану',
  teachingExampleHeader: {
    badgeUk: 'Навчальний приклад · login_spec',
    captionUk: 'Умовний формат відповіді, не контракт API репозиторію',
  },
  mainCardTitleUk: 'Поля відповіді',
  fields: [
    {
      labelUk: 'steps',
      valueUk: 'readPlaywrightReport',
      explanationUk: 'Один запропонований крок із плану розслідування.',
      technicalUk: 'steps[0].action = readPlaywrightReport',
    },
    {
      labelUk: 'priority',
      valueUk: '2',
      explanationUk: 'Пропозиція моделі, не підтверджена важливість інциденту.',
      technicalUk: 'priority = 2',
    },
    {
      labelUk: 'suggested_tool',
      valueUk: 'createJiraIssue',
      explanationUk: 'Лише пропозиція моделі, інструмент ще не виконано.',
      technicalUk: 'suggested_tool = createJiraIssue',
    },
  ],
  schemaSectionTitleUk: 'Умовна схема для цього прикладу',
  schemaRules: [
    {
      fieldKeyUk: 'steps',
      ruleUk:
        'Обов’язковий масив об’єктів. У кожного кроку є рядкове поле action.',
    },
    {
      fieldKeyUk: 'priority',
      ruleUk: 'Обов’язкове число від 1 до 3.',
    },
    {
      fieldKeyUk: 'suggested_tool',
      ruleUk:
        'Обов’язковий рядок зі списку readPlaywrightReport або createJiraIssue.',
    },
  ],
  jsonExample: loginSpecStructuredOutputJsonPretty(),
};
