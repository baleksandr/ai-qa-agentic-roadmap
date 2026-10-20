import { isStudyReadyForLearning } from '../data/study/study-ready-for-learning';

/** Клас зони шапки / outcomes з Neon HUD (не на всю сторінку). */
export const STUDY_NEON_HUD_HERO_ZONE_CLASS = 'study-neon-hud-hero-zone';

const NEON_HUD_PARTIAL_TOPIC_IDS = new Set(['concept-02', 'concept-09', 'concept-16']);

/** Neon HUD для шапки та outcomes (окремо від «готовий для навчання»). */
export function usesStudyNeonHudTheme(topicId: string): boolean {
  return isStudyReadyForLearning(topicId) || NEON_HUD_PARTIAL_TOPIC_IDS.has(topicId);
}

export function studyNeonHudHeroZoneClassName(topicId: string): string {
  return usesStudyNeonHudTheme(topicId) ? STUDY_NEON_HUD_HERO_ZONE_CLASS : '';
}

/** @deprecated Не застосовуйте на корені сторінки — лише {@link studyNeonHudHeroZoneClassName}. */
export function studyNeonHudThemeClassName(_topicId: string): string {
  return '';
}
