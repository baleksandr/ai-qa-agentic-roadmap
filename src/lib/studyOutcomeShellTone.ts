/** Тон рамки / маркера для вкладеного варіанта (processStepPick, outcome). */
export type StudyOutcomeShellTone = 'positive' | 'warn' | 'neutral';

export function studyOutcomeShellToneFromStepKey(key: string): StudyOutcomeShellTone {
  if (key === 'allow' || key === 'data') return 'positive';
  if (key === 'deny' || key === 'error' || key === 'needs-approval') return 'warn';
  return 'neutral';
}
