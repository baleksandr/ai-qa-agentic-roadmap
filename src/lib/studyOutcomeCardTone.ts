import type { StudyLearnerPanelMiniCardTone } from '../data/study/study-learner-panel-sections';

/** Візуальний тон вкладеної картки наслідку в центральній панелі уроку. */
export type StudyOutcomeCardVisualTone =
  | 'neutral'
  | 'allow'
  | 'deny'
  | 'refute'
  | 'readFail'
  | 'end';

export function resolveOutcomeCardVisualTone(
  tone?: StudyLearnerPanelMiniCardTone,
): StudyOutcomeCardVisualTone {
  switch (tone) {
    case 'allow':
    case 'investigationContinue':
      return 'allow';
    case 'deny':
      return 'deny';
    case 'refute':
      return 'refute';
    case 'readFail':
      return 'readFail';
    case 'end':
    case 'investigationEnd':
      return 'end';
    case 'neutral':
      return 'neutral';
    default:
      return 'neutral';
  }
}

export function studyOutcomeCardClassName(tone?: StudyLearnerPanelMiniCardTone): string {
  const visual = resolveOutcomeCardVisualTone(tone);
  return `study-outcome-card study-outcome-card--${visual}`;
}
