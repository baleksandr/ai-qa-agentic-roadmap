/**
 * Уроки з rich Study UI (split-панель підказок, розгорнуті картки).
 * Щоб перенести патерн Guardrails на інший concept:
 * 1) додати topicId сюди;
 * 2) створити `src/data/study/<topic>-extra-sections.ts`;
 * 3) підключити рендер у `StudyModeSections` (як `renderGuardrailsBySection`).
 */
export const STUDY_ENRICHED_TOPIC_IDS: readonly string[] = ['concept-17'];

export function isStudyEnrichedTopic(topicId?: string): boolean {
  return Boolean(topicId && STUDY_ENRICHED_TOPIC_IDS.includes(topicId));
}
