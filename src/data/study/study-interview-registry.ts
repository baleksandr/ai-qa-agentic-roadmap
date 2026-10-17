import type { StudyInterviewDeck } from './study-interview-types';
import { RAG_INTERVIEW_DECK } from './rag-interview-self-check';
import { TOOL_CALLING_INTERVIEW_DECK } from './tool-calling-interview-self-check';
import { GUARDRAILS_INTERVIEW_DECK } from './guardrails-interview-self-check';

const BY_TOPIC: Record<string, StudyInterviewDeck> = {
  'concept-03': RAG_INTERVIEW_DECK,
  'concept-10': TOOL_CALLING_INTERVIEW_DECK,
  'concept-17': GUARDRAILS_INTERVIEW_DECK,
};

/** Чи показувати deck співбесіди в цьому розділі Study Mode */
export function shouldShowInterviewDeck(topicId: string, sectionNavTitle: string): boolean {
  const t = sectionNavTitle.toLowerCase();
  if (!BY_TOPIC[topicId]) return false;
  if (topicId === 'concept-03') return t.includes('співбесід') || t.includes('запам');
  if (topicId === 'concept-10') {
    return t.includes('співбесід') || t.includes('запам');
  }
  if (topicId === 'concept-17') {
    return t.includes('співбесід') || t.includes('запам') || t.includes('ось воно');
  }
  return false;
}

export function getStudyInterviewDeck(topicId: string): StudyInterviewDeck | null {
  return BY_TOPIC[topicId] ?? null;
}
