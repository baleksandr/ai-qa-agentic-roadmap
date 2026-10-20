import type { FundamentalsCardPanel } from './fundamentals-card-panels';
import type { StudyLearnerPanelSection } from './study-learner-panel-sections';

export function framed(labelUk: string, bodyUk: string): StudyLearnerPanelSection {
  return { type: 'plain', labelUk, bodyUk, framed: true };
}

export function qaBulletBody(items: string[]): string {
  return items.map((item) => `- ${item}`).join('\n');
}

export function terminology(
  items: Array<{ termUk: string; bodyUk: string }>,
): StudyLearnerPanelSection {
  return { type: 'taxonomy', labelUk: 'Термінологія', items };
}

export type GuardrailsQaNestedStep = {
  key: string;
  titleUk: string;
  teaserUk: string;
  whatUk: string;
  exampleUk: string;
  expected: string[];
  terms: Array<{ termUk: string; explanationUk: string }>;
};

export function guardrailsQaNestedStep(step: GuardrailsQaNestedStep) {
  return {
    key: step.key,
    titleUk: step.titleUk,
    teaserUk: step.teaserUk,
    sections: [
      { labelUk: 'Що перевіряємо', bodyUk: step.whatUk },
      { labelUk: 'Приклад login_spec', bodyUk: step.exampleUk },
      { labelUk: 'Очікувана поведінка', bodyUk: qaBulletBody(step.expected) },
      { labelUk: 'Термінологія', labeledPairs: step.terms },
    ],
  };
}

type NestedPickStep = {
  key: string;
  titleUk: string;
  teaserUk: string;
  sections: Array<{
    labelUk: string;
    bodyUk?: string;
    labeledPairs?: Array<{ termUk: string; explanationUk: string }>;
  }>;
};

export function guardrailsNestedPick(
  labelUk: string,
  pickAriaLabel: string,
  steps: NestedPickStep[],
): StudyLearnerPanelSection {
  return {
    type: 'processStepPick',
    labelUk,
    pickAriaLabel,
    presentation: 'concepts',
    showActorInPanel: false,
    showStepIndexInPanel: false,
    showNestedCardNumberInPanel: true,
    navLayout: 'sidebar',
    navCompactTitleOnly: true,
    pickPanelDetailVariant: 'outcome',
    steps: steps.map((step) => ({
      key: step.key,
      titleUk: step.titleUk,
      teaserUk: step.teaserUk,
      actorUk: '',
      detailSections: step.sections,
    })),
  };
}

export function guardrailsPanel(
  sections: StudyLearnerPanelSection[],
  terms?: FundamentalsCardPanel['terms'],
): FundamentalsCardPanel {
  return { sections, terms: terms ?? [] };
}
