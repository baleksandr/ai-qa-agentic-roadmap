import { getLearningMapRoute } from '../data/learning-map.registry';
import type { TopicMeta } from '../types/topic';

export function getStudyNextTopic(currentId: string): TopicMeta | null {
  const route = getLearningMapRoute();
  const index = route.findIndex((t) => t.id === currentId);
  if (index < 0 || index >= route.length - 1) return null;
  return route[index + 1];
}

export function getStudyPrevTopic(currentId: string): TopicMeta | null {
  const route = getLearningMapRoute();
  const index = route.findIndex((t) => t.id === currentId);
  if (index <= 0) return null;
  return route[index - 1];
}
