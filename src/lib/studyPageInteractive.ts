/** Стандартна підказка перед групою карток розділу (після короткого вступу). */
export const STUDY_SECTION_CARDS_INTERACTION_HINT_UK =
  'Оберіть картку ліворуч, щоб побачити пояснення. На телефоні воно з’явиться під картками.';

export type StudySectionCardsInteractionHintText = string;

/** @deprecated Використовуйте `STUDY_SECTION_CARDS_INTERACTION_HINT_UK` на рівні розділу. */
export const STUDY_PAGE_CARDS_INTERACTION_HINT_UK = STUDY_SECTION_CARDS_INTERACTION_HINT_UK;

const GENERIC_NESTED_PICK_HINTS = new Set([
  STUDY_SECTION_CARDS_INTERACTION_HINT_UK,
  'Оберіть картку ліворуч, щоб побачити пояснення.',
  'Натисніть картку, щоб прочитати пояснення поруч. На телефоні воно з’явиться під картками.',
  'Оберіть картку, щоб прочитати пояснення поруч. На телефоні воно з’явиться під картками.',
]);

/** Вкладений processStepPick — лише якщо дія відрізняється від стандартної підказки розділу. */
export function shouldShowNestedProcessStepPickHint(interactionHintUk?: string): boolean {
  const text = interactionHintUk?.trim();
  if (!text) return false;
  return !GENERIC_NESTED_PICK_HINTS.has(text);
}

const LEGACY_INTERACTIVE_STUDY_TOPIC_IDS = new Set([
  'concept-01',
  'concept-03',
  'concept-04',
  'concept-10',
  'concept-14',
  'concept-12',
  'concept-17',
]);

/** Сторінки з split-panel / інтерактивними навчальними картками. */
export function topicStudyPageHasInteractiveCards(topicId: string): boolean {
  if (topicId === 'fundamentals') return true;
  return LEGACY_INTERACTIVE_STUDY_TOPIC_IDS.has(topicId);
}
