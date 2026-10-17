import type { StudyModelResponseExample } from './study-learner-panel-sections';

const PE_RUN42_FORMAT_RESPONSE_JSON = {
  hypothesis: 'Локатор у тесті може не відповідати поточній сторінці',
  evidence_needed: 'Код spec, DOM і trace run-42',
} as const;

/** Навчальний контракт полів для §3 PE «Формат результату» (run-42). */
export const PE_RUN42_FORMAT_RESPONSE_EXAMPLE: StudyModelResponseExample = {
  blockLabelUk: 'Приклад умовної відповіді',
  teachingExampleHeader: {
    badgeUk: 'Навчальний контракт',
    captionUk:
      'Поля для обробки в коді. «Відповідає схемі» — лише якщо така схема задана в продукті; це не доказ причини збою.',
  },
  mainCardTitleUk: 'Поля відповіді',
  fields: [
    {
      labelUk: 'hypothesis',
      valueUk: PE_RUN42_FORMAT_RESPONSE_JSON.hypothesis,
      technicalUk: 'hypothesis',
    },
    {
      labelUk: 'evidence_needed',
      valueUk: PE_RUN42_FORMAT_RESPONSE_JSON.evidence_needed,
      technicalUk: 'evidence_needed',
    },
  ],
  schemaSectionTitleUk: 'Приклад JSON',
  schemaRules: [
    {
      fieldKeyUk: 'hypothesis',
      ruleUk: 'Рядок із можливим поясненням збою (гіпотеза, не встановлена причина).',
    },
    {
      fieldKeyUk: 'evidence_needed',
      ruleUk: 'Що потрібно отримати для перевірки гіпотези (у продукті може бути рядок або список).',
    },
  ],
  jsonExample: JSON.stringify(PE_RUN42_FORMAT_RESPONSE_JSON, null, 2),
};
