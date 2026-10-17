/** Прибирає один рядок з переліком компонентів — замінюється на StudyRagPipelineComponents */
export function stripRagPipelineInlineList(text: string): string {
  return text
    .replace(/^Типові компоненти pipeline[^\n]*\n+/im, '')
    .trim();
}
