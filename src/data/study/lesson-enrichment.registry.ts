/**
 * Статус збагачення Study Mode відносно еталону concept-03 (RAG).
 * Див. docs/STUDY_LESSON_RAG_TEMPLATE.md
 */
export type LessonEnrichmentTier = 'reference' | 'partial' | 'minimal' | 'legacy-docx';

export type LessonEnrichmentEntry = {
  topicId: string;
  tier: LessonEnrichmentTier;
  /** Навчальний потік у src/data/study/*-teaching-thread.ts */
  teachingThread?: boolean;
  /** clarityProcessPanel / *-panel-content.ts */
  clarityPanels?: boolean;
  /** StudyInterviewSelfCheck deck */
  interviewDeck?: boolean;
  /** Один runtime-сценарій (як StudyRagOneQueryFlow) */
  oneStoryFlow?: boolean;
  notes?: string;
};

export const LESSON_ENRICHMENT: LessonEnrichmentEntry[] = [
  {
    topicId: 'concept-03',
    tier: 'reference',
    teachingThread: true,
    clarityPanels: true,
    interviewDeck: true,
    oneStoryFlow: true,
    notes: 'Еталон курсу',
  },
  {
    topicId: 'concept-10',
    tier: 'partial',
    teachingThread: true,
    clarityPanels: true,
    interviewDeck: true,
    oneStoryFlow: false,
    notes: '8 розділів; hero + outcomes як RAG; 5 кроків §2; ribbon §3; interview deck',
  },
  {
    topicId: 'concept-17',
    tier: 'partial',
    teachingThread: true,
    interviewDeck: true,
    clarityPanels: false,
    notes: 'Enriched UI + interview deck (createJiraIssue thread); clarity panels — далі',
  },
];

export function getLessonEnrichment(topicId: string): LessonEnrichmentEntry | undefined {
  return LESSON_ENRICHMENT.find((e) => e.topicId === topicId);
}
