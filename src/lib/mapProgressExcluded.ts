/** Вузли на карті, які не входять у загальний лічильник прогресу (допоміжні матеріали). */
export const MAP_PROGRESS_EXCLUDED_TOPIC_IDS = new Set(['reference-library', 'qa-interview']);

export function isMapProgressTopic(topicId: string): boolean {
  return !MAP_PROGRESS_EXCLUDED_TOPIC_IDS.has(topicId);
}
