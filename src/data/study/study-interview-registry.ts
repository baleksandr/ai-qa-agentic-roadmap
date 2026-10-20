import type { StudyInterviewDeck } from './study-interview-types';
import { RAG_INTERVIEW_DECK } from './rag-interview-self-check';
import { TOOL_CALLING_INTERVIEW_DECK } from './tool-calling-interview-self-check';
import { GUARDRAILS_INTERVIEW_DECK } from './guardrails-interview-self-check';
import { PROMPT_PE_INTERVIEW_DECK } from './prompt-engineering-interview-self-check';
import { REASONING_INTERVIEW_DECK } from './reasoning-interview-self-check';
import { MEMORY_STATE_INTERVIEW_DECK } from './memory-state-interview-self-check';
import { VECTOR_DATABASE_INTERVIEW_DECK } from './vector-database-interview-self-check';
import { MCP_INTERVIEW_DECK } from './mcp-interview-self-check';
import { FINE_TUNING_INTERVIEW_DECK } from './fine-tuning-interview-self-check';
import { SKILLS_INTERVIEW_DECK } from './skills-interview-self-check';
import { PLANNING_INTERVIEW_DECK } from './planning-interview-self-check';
import { ORCHESTRATION_INTERVIEW_DECK } from './orchestration-interview-self-check';
import { AGENTIC_WORKFLOWS_INTERVIEW_DECK } from './agentic-workflows-interview-self-check';
import { MULTI_AGENT_INTERVIEW_DECK } from './multi-agent-interview-self-check';
import { A2A_INTERVIEW_DECK } from './a2a-interview-self-check';
import { PART_II_INTERVIEW_BY_TOPIC } from './part-ii-interview-decks';
import { PART_II_INTERVIEW_REST } from './part-ii-interview-decks-rest';

const BY_TOPIC: Record<string, StudyInterviewDeck> = {
  ...PART_II_INTERVIEW_BY_TOPIC,
  ...PART_II_INTERVIEW_REST,
  'concept-03': RAG_INTERVIEW_DECK,
  'concept-10': TOOL_CALLING_INTERVIEW_DECK,
  'concept-17': GUARDRAILS_INTERVIEW_DECK,
  'concept-14': PROMPT_PE_INTERVIEW_DECK,
  'concept-12': REASONING_INTERVIEW_DECK,
  'concept-01': MEMORY_STATE_INTERVIEW_DECK,
  'concept-15': VECTOR_DATABASE_INTERVIEW_DECK,
  'concept-06': MCP_INTERVIEW_DECK,
  'concept-13': FINE_TUNING_INTERVIEW_DECK,
  'concept-07': SKILLS_INTERVIEW_DECK,
  'concept-11': PLANNING_INTERVIEW_DECK,
  'concept-02': ORCHESTRATION_INTERVIEW_DECK,
  'concept-16': AGENTIC_WORKFLOWS_INTERVIEW_DECK,
  'concept-09': MULTI_AGENT_INTERVIEW_DECK,
  'concept-08': A2A_INTERVIEW_DECK,
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
