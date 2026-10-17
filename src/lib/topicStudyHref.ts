/** Study Mode URL для теми з `topics.registry` (шлях для React Router `Link`). */
export function topicStudyHref(topicId: string): string {
  return `/topic/${topicId}/study`;
}
