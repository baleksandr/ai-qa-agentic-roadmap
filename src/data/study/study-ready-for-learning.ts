/**
 * Теми, де Study Mode готовий для навчання (повний урок + інтерактив).
 * Окремо від migrationStatus і від особистого прогресу користувача.
 */
export const STUDY_READY_FOR_LEARNING_TOPIC_IDS: readonly string[] = [
  'fundamentals',
  'concept-01',
  'concept-03',
  'concept-04',
  'concept-06',
  'concept-07',
  'concept-11',
  'concept-10',
  'concept-12',
  'concept-13',
  'concept-14',
  'concept-15',
];

const READY_SET = new Set(STUDY_READY_FOR_LEARNING_TOPIC_IDS);

export function isStudyReadyForLearning(topicId: string): boolean {
  return READY_SET.has(topicId);
}
