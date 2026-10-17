/** Одна підказка керування картками на всю Study-сторінку (після вступу, перед розділами). */
export const STUDY_PAGE_CARDS_INTERACTION_HINT_UK =
  'Натисніть картку, щоб прочитати пояснення поруч. На телефоні воно з’явиться під картками.';

const LEGACY_INTERACTIVE_STUDY_TOPIC_IDS = new Set([
  'concept-03',
  'concept-10',
  'concept-14',
  'concept-17',
]);

/** Сторінки з split-panel / інтерактивними навчальними картками. */
export function topicStudyPageHasInteractiveCards(topicId: string): boolean {
  if (topicId === 'fundamentals') return true;
  return LEGACY_INTERACTIVE_STUDY_TOPIC_IDS.has(topicId);
}
