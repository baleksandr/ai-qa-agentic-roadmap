/**
 * Теми, де Study Mode готовий для навчання (повний урок + інтерактив).
 * Окремо від migrationStatus і від особистого прогресу користувача.
 */
export const STUDY_READY_FOR_LEARNING_TOPIC_IDS: readonly string[] = ['concept-03', 'concept-10'];

const READY_SET = new Set(STUDY_READY_FOR_LEARNING_TOPIC_IDS);

export function isStudyReadyForLearning(topicId: string): boolean {
  return READY_SET.has(topicId);
}
