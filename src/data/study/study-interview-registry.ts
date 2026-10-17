import type { StudyInterviewDeck } from './study-interview-types';
import { RAG_INTERVIEW_DECK } from './rag-interview-self-check';
import { TOOL_CALLING_INTERVIEW_DECK } from './tool-calling-interview-self-check';
import { GUARDRAILS_INTERVIEW_DECK } from './guardrails-interview-self-check';
import { PROMPT_PE_INTERVIEW_DECK } from './prompt-engineering-interview-self-check';
import { PART_II_INTERVIEW_BY_TOPIC } from './part-ii-interview-decks';
import { PART_II_INTERVIEW_REST } from './part-ii-interview-decks-rest';

const BY_TOPIC: Record<string, StudyInterviewDeck> = {
  ...PART_II_INTERVIEW_BY_TOPIC,
  ...PART_II_INTERVIEW_REST,
  'concept-03': RAG_INTERVIEW_DECK,
  'concept-10': TOOL_CALLING_INTERVIEW_DECK,
  'concept-17': GUARDRAILS_INTERVIEW_DECK,
  'concept-14': PROMPT_PE_INTERVIEW_DECK,
};

/** Чи показувати deck співбесіди в цьому розділі Study Mode */
export function shouldShowInterviewDeck(topicId: string, sectionNavTitle: string): boolean {
  if (!BY_TOPIC[topicId]) return false;
  const t = sectionNavTitle.toLowerCase();
  if (topicId === 'concept-17') {
    return t.includes('співбесід') || t.includes('запам') || t.includes('ось воно');
  }
  return t.includes('співбесід') || t.includes('запам');
}

export function getStudyInterviewDeck(topicId: string): StudyInterviewDeck | null {
  return BY_TOPIC[topicId] ?? null;
}
