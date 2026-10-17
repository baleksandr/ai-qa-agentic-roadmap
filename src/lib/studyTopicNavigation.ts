import { TOPIC_BY_ID, getLearningRoute } from '../data/topics.registry';
import type { TopicMeta } from '../types/topic';

/** Наступна тема Study Mode (узгоджено з навчальною картою, не лише learningOrder). */
const STUDY_NEXT_TOPIC_ID: Record<string, string> = {
  fundamentals: 'concept-14',
};

export function getStudyNextTopic(currentId: string): TopicMeta | null {
  const overrideId = STUDY_NEXT_TOPIC_ID[currentId];
  if (overrideId) {
    return TOPIC_BY_ID[overrideId] ?? null;
  }
  const route = getLearningRoute();
  const index = route.findIndex((t) => t.id === currentId);
  if (index < 0 || index >= route.length - 1) return null;
  return route[index + 1];
}

export function getStudyPrevTopic(currentId: string): TopicMeta | null {
  const route = getLearningRoute();
  const index = route.findIndex((t) => t.id === currentId);
  if (index <= 0) return null;
  return route[index - 1];
}
