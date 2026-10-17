import type { StudyLearnerPanelSection } from './study-learner-panel-sections';

/** Коротке нагадування для блоку «Терміни» (1–3 на картку). */
export type StudyPanelTermEntry = { label: string; text: string };

/** Панель для карток Fundamentals — без жорсткого шаблону з 7 полів. */
export type FundamentalsCardPanel = {
  whatUk?: string;
  exampleUk?: string;
  relationUk?: string;
  qaUk?: string;
  inputOutputUk?: string;
  failureUk?: string;
  /** Короткий висновок саме для цієї картки (не копіювати з інших понять). */
  rememberUk?: string;
  /** Терміни поточної картки — `StudyPanelTerms` у `StudyLearnerPanelBody`. */
  terms?: StudyPanelTermEntry[];
  /** Якщо задано — рендериться замість плоских полів (тези, мінікартки, зіставлення). */
  sections?: StudyLearnerPanelSection[];
};

export function fundamentalsCardPanelSections(
  p: FundamentalsCardPanel,
): Array<{ labelUk: string; bodyUk: string }> {
  if (p.sections?.length) return [];
  const rows: Array<{ labelUk: string; bodyUk: string }> = [
    { labelUk: 'Простими словами', bodyUk: p.whatUk ?? '' },
    { labelUk: 'Приклад', bodyUk: p.exampleUk ?? '' },
    { labelUk: 'Зв’язок з іншими поняттями', bodyUk: p.relationUk ?? '' },
  ];
  if (p.inputOutputUk) rows.push({ labelUk: 'Вхід і вихід', bodyUk: p.inputOutputUk });
  if (p.failureUk) rows.push({ labelUk: 'Що може піти не так', bodyUk: p.failureUk });
  if (p.qaUk) rows.push({ labelUk: 'Для QA investigation', bodyUk: p.qaUk });
  if (p.rememberUk) rows.push({ labelUk: 'Запам’ятати', bodyUk: p.rememberUk });
  return rows;
}

/** @deprecated Використовуйте StudyLearnerPanelBody + fundamentalsCardPanelSections */
export function fundamentalsPanelToMarkdown(p: FundamentalsCardPanel): string {
  return fundamentalsCardPanelSections(p)
    .map((s) => `**${s.labelUk}.** ${s.bodyUk}`)
    .join('\n\n');
}
