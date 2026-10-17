import type { StudyModelResponseExample } from './study-learner-panel-sections';

/** Сирі значення умовної відповіді моделі (єдине джерело для картки й JSON). */
export const LOGIN_SPEC_MODEL_RESPONSE_VALUES = {
  root_cause: 'selector_mismatch',
  claimed_current_selector: '#submit',
  test_locator: '#login-btn',
  confidence: 'high',
} as const;

export function loginSpecModelResponseJsonPretty(): string {
  return JSON.stringify(LOGIN_SPEC_MODEL_RESPONSE_VALUES, null, 2);
}

/** Блок «Приклад відповіді моделі» для §14 «Формат і допустимі значення». */
export const LOGIN_SPEC_MODEL_RESPONSE_EXAMPLE: StudyModelResponseExample = {
  blockLabelUk: 'Приклад відповіді моделі',
  introUk:
    'Одна відповідь моделі проходить три окремі перевірки: чи читається JSON, чи відповідає він схемі та чи підтверджується твердження актуальними даними.',
  mainCardTitleUk: 'Що заявила модель',
  fields: [
    {
      labelUk: 'Ймовірна причина',
      valueUk: 'Локатори не збігаються',
      technicalUk: `root_cause = ${LOGIN_SPEC_MODEL_RESPONSE_VALUES.root_cause}`,
    },
    {
      labelUk: 'Селектор за словами моделі',
      valueUk: LOGIN_SPEC_MODEL_RESPONSE_VALUES.claimed_current_selector,
      technicalUk: 'claimed_current_selector',
    },
    {
      labelUk: 'Що шукав тест',
      valueUk: LOGIN_SPEC_MODEL_RESPONSE_VALUES.test_locator,
      technicalUk: 'test_locator',
    },
    {
      labelUk: 'Оцінка впевненості моделі',
      valueUk: LOGIN_SPEC_MODEL_RESPONSE_VALUES.confidence,
      technicalUk: 'confidence',
    },
  ],
  fieldsSummaryUk:
    '#submit — неперевірене твердження моделі. high — її власна оцінка, а не доказ правильності.',
  checksSectionTitleUk: 'Що вже перевірено',
  checks: [
    { labelUk: 'JSON читається', status: 'yes', statusTextUk: 'так' },
    { labelUk: 'Поля відповідають умовній схемі', status: 'yes', statusTextUk: 'так' },
    {
      labelUk: 'Твердження про #submit підтверджене',
      status: 'pending',
      statusTextUk: 'ще не перевірено в цей момент історії',
    },
  ],
  conclusionUk:
    'Правильний формат відповіді не підтверджує ні поточний селектор кнопки, ні причину падіння тесту.',
  schemaSectionTitleUk: 'Що дозволяє схема',
  schemaRules: [
    {
      fieldKeyUk: 'root_cause',
      ruleUk:
        'Обов’язкове поле. Допустимі значення: selector_mismatch або other.',
    },
    {
      fieldKeyUk: 'claimed_current_selector',
      ruleUk: 'Обов’язковий рядок.',
    },
    {
      fieldKeyUk: 'test_locator',
      ruleUk: 'Обов’язковий рядок.',
    },
    {
      fieldKeyUk: 'confidence',
      ruleUk: 'Обов’язкове поле. Допустимі значення: low, medium або high.',
    },
  ],
  jsonExample: loginSpecModelResponseJsonPretty(),
};
