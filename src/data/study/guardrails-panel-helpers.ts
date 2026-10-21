import type { FundamentalsCardPanel } from './fundamentals-card-panels';
import type { StudyLearnerPanelSection } from './study-learner-panel-sections';

export function framed(labelUk: string, bodyUk: string): StudyLearnerPanelSection {
  return { type: 'plain', labelUk, bodyUk, framed: true };
}

export function qaBulletBody(items: string[]): string {
  return items.map((item) => `- ${item}`).join('\n');
}

/** Абзац + маркований список + опційний висновок (бокові панелі QA). */
export function qaBlockWithBullets(introUk: string, bullets: string[], outroUk?: string): string {
  const parts: string[] = [];
  if (introUk.trim()) parts.push(introUk.trim());
  if (bullets.length) parts.push(qaBulletBody(bullets));
  if (outroUk?.trim()) parts.push(outroUk.trim());
  return parts.join('\n\n');
}

/** Єдиний стиль пояснення рішень policy для навчальних панелей Guardrails. */
export const GUARDRAILS_POLICY_VERDICT_ALLOW_UK =
  'ALLOW — дія дозволена політикою, але інші обов’язкові перевірки все ще мають виконуватися.';
export const GUARDRAILS_POLICY_VERDICT_DENY_UK =
  'DENY — дія заборонена, її не можна передавати на виконання.';
export const GUARDRAILS_POLICY_VERDICT_NEEDS_APPROVAL_UK =
  'NEEDS_APPROVAL — необхідне погодження перед виконанням.';

export const GUARDRAILS_POLICY_VERDICTS_BLOCK_UK = [
  GUARDRAILS_POLICY_VERDICT_ALLOW_UK,
  GUARDRAILS_POLICY_VERDICT_DENY_UK,
  GUARDRAILS_POLICY_VERDICT_NEEDS_APPROVAL_UK,
].join('\n\n');

export function guardrailsPolicyVerdictsIntroBody(introUk: string): string {
  const intro = introUk.trim();
  if (!intro) return GUARDRAILS_POLICY_VERDICTS_BLOCK_UK;
  return `${intro}\n\n${GUARDRAILS_POLICY_VERDICTS_BLOCK_UK}`;
}

export function terminology(
  items: Array<{ termUk: string; bodyUk: string }>,
  labelUk = 'Термінологія',
): StudyLearnerPanelSection {
  return { type: 'taxonomy', labelUk, items };
}

/** Повна навчальна панель картки Guardrails (ролі, security, pipeline). */
export function guardrailsLearnerTeachingPanel(opts: {
  whoUk?: string;
  plainUk: string;
  howUk: string;
  exampleUk: string;
  qaBullets: string[];
  terms: Array<{ termUk: string; bodyUk: string }>;
  termsLabelUk?: string;
}): FundamentalsCardPanel {
  const sections: StudyLearnerPanelSection[] = [];
  if (opts.whoUk?.trim()) {
    sections.push(framed('Хто відповідає', opts.whoUk));
  }
  sections.push(framed('Простими словами', opts.plainUk));
  sections.push(framed('Як це працює', opts.howUk));
  sections.push(framed('Приклад login_spec', opts.exampleUk));
  sections.push(framed('Що перевіряє QA', qaBulletBody(opts.qaBullets)));
  sections.push(terminology(opts.terms, opts.termsLabelUk ?? 'Терміни'));
  return { sections, terms: [] };
}

/** Вкладена картка «Що перевіряє QA» — повна панель з «Що це означає». */
export function guardrailsNestedQaCardSections(opts: {
  meanUk: string;
  exampleUk: string;
  qaBullets: string[];
  terms: Array<{ termUk: string; explanationUk: string }>;
}): Array<{
  labelUk: string;
  bodyUk?: string;
  labeledPairs?: Array<{ termUk: string; explanationUk: string }>;
}> {
  return [
    { labelUk: 'Що це означає', bodyUk: opts.meanUk },
    { labelUk: 'Приклад login_spec', bodyUk: opts.exampleUk },
    { labelUk: 'Що перевіряє QA', bodyUk: qaBulletBody(opts.qaBullets) },
    { labelUk: 'Терміни', labeledPairs: opts.terms },
  ];
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
    hideLabel?: boolean;
    labeledLead?: { termUk: string; explanationUk: string };
    labeledPairs?: Array<{ termUk: string; explanationUk: string }>;
    compactPayload?: Array<{ keyUk: string; valueUk: string }>;
    compactPayloadFootnoteUk?: string;
  }>;
};

type NestedPickOptions = {
  leadUk?: string;
  interactionHintUk?: string;
  /** Без кольорових outcome-рамок на кожному підблоці (менше «блок у блоці»). */
  flatDetailPanels?: boolean;
};

export function guardrailsNestedPick(
  labelUk: string,
  pickAriaLabel: string,
  steps: NestedPickStep[],
  opts?: NestedPickOptions,
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
    ...(opts?.flatDetailPanels ? {} : { pickPanelDetailVariant: 'outcome' as const }),
    leadUk: opts?.leadUk,
    interactionHintUk: opts?.interactionHintUk,
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

type QaPickItem = { key: string; titleUk: string; teaserUk: string; detailUk: string };

export function guardrailsQaPick(
  labelUk: string,
  pickAriaLabel: string,
  items: QaPickItem[],
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
    steps: items.map((item) => ({
      key: item.key,
      titleUk: item.titleUk,
      teaserUk: item.teaserUk,
      actorUk: '',
      detailUk: item.detailUk,
    })),
  };
}

export function panelHeading(labelUk: string): StudyLearnerPanelSection {
  return { type: 'plain', labelUk, bodyUk: '', framed: true };
}
