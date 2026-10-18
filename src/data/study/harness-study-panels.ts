import type { FundamentalsCardPanel, StudyPanelTermEntry } from './fundamentals-card-panels';

export function harnessRunPanel(
  plainUk: string,
  inputUk: string,
  actionUk: string,
  outputUk: string,
  qaUk: string,
  terms: StudyPanelTermEntry[],
): FundamentalsCardPanel {
  return {
    sections: [
      { type: 'plain', labelUk: 'Простими словами', bodyUk: plainUk },
      { type: 'plain', labelUk: 'Вхід', bodyUk: inputUk },
      { type: 'plain', labelUk: 'Дія', bodyUk: actionUk },
      { type: 'plain', labelUk: 'Результат', bodyUk: outputUk },
      { type: 'qaCheck', bodyUk: qaUk },
    ],
    terms,
  };
}

export function harnessComponentPanel(
  plainUk: string,
  inputUk: string,
  actionUk: string,
  outputUk: string,
  qaUk: string,
  terms: StudyPanelTermEntry[],
): FundamentalsCardPanel {
  return {
    sections: [
      { type: 'plain', labelUk: 'Простими словами', bodyUk: plainUk },
      { type: 'plain', labelUk: 'Вхід', bodyUk: inputUk },
      { type: 'plain', labelUk: 'Дія', bodyUk: actionUk },
      { type: 'plain', labelUk: 'Результат (login_spec)', bodyUk: outputUk },
      { type: 'qaCheck', bodyUk: qaUk },
    ],
    terms,
  };
}

