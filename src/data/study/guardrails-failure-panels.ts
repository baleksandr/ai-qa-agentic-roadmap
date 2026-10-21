import type { FundamentalsCardPanel } from './fundamentals-card-panels';
import type { GuardrailsFailureModeDetail } from './guardrails-extra-sections';
import { GUARDRAILS_FAILURE_MODES_LIST } from './guardrails-extra-sections';
import { guardrailsFailureQaPanelSections } from './guardrails-failure-qa-panels';
import { framed, guardrailsPanel, terminology } from './guardrails-panel-helpers';

const FAILURE_MODE_KEYS = [
  'gr-fail-permissive',
  'gr-fail-injection',
  'gr-fail-false-positive',
  'gr-fail-inconsistent',
] as const;

function failureModePanel(modeKey: string, mode: GuardrailsFailureModeDetail): FundamentalsCardPanel {
  const sections = [
    framed('Що це', mode.whatUk),
    framed('Як проявляється', mode.symptomUk),
    framed('Що зробити в дизайні', mode.mitigationUk),
    ...guardrailsFailureQaPanelSections(modeKey),
    terminology(mode.terms, 'Термінологія'),
  ];
  return guardrailsPanel(sections);
}

export const GUARDRAILS_FAILURE_MODE_PANELS = GUARDRAILS_FAILURE_MODES_LIST.map((mode, index) => ({
  key: FAILURE_MODE_KEYS[index]!,
  titleUk: mode.titleUk,
  teaserUk: mode.teaserUk,
  termEn: mode.termEn,
  panel: failureModePanel(FAILURE_MODE_KEYS[index]!, mode),
}));
